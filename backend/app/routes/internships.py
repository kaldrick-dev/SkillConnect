from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import (
    Assessment,
    Certificate,
    Employer,
    Internship,
    InternshipApplication,
    Mentor,
    Student,
)
from app.utils import role_required

internships_bp = Blueprint("internships", __name__)


@internships_bp.get("/internships")
def list_internships():
    internships = Internship.query.all()
    search = request.args.get("search", "").strip()
    location = request.args.get("location", "").strip()
    is_active = request.args.get("is_active")

    if search:
        search = search.lower()
        internships = [
            internship for internship in internships
            if search in internship.title.lower()
            or search in (internship.description or "").lower()
        ]

    if location:
        location = location.lower()
        internships = [
            internship for internship in internships
            if location in (internship.location or "").lower()
        ]

    if is_active == "true":
        internships = [
            internship for internship in internships
            if internship.is_active
        ]
    elif is_active == "false":
        internships = [
            internship for internship in internships
            if not internship.is_active
        ]

    return jsonify([internship.to_dict() for internship in internships]), 200


@internships_bp.post("/internships")
@role_required("employer")
def create_internship():
    data = request.get_json() or {}

    if not data.get("title"):
        return jsonify({"error": "title is required"}), 400

    employer = Employer.query.filter_by(
        user_id=int(get_jwt_identity())
    ).first()
    if not employer:
        return jsonify({"error": "employer profile not found"}), 404

    internship = Internship(
        employer_id=employer.id,
        title=data["title"],
        code=data.get("code"),
        description=data.get("description"),
        location=data.get("location"),
        is_active=data.get("is_active", True),
    )

    db.session.add(internship)
    db.session.commit()

    return jsonify({
        "message": "internship created",
        "internship": internship.to_dict(),
    }), 201


@internships_bp.get("/internships/<int:internship_id>")
def get_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    return jsonify(internship.to_dict()), 200


@internships_bp.put("/internships/<int:internship_id>")
@role_required("employer")
def update_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404

    data = request.get_json() or {}
    if "title" in data:
        internship.title = data["title"]
    if "description" in data:
        internship.description = data["description"]
    if "location" in data:
        internship.location = data["location"]
    if "is_active" in data:
        internship.is_active = data["is_active"]

    db.session.commit()
    return jsonify({
        "message": "internship updated",
        "internship": internship.to_dict(),
    }), 200


@internships_bp.post("/internships/<int:internship_id>/apply")
@role_required("student")
def apply_to_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    if not internship.is_active:
        return jsonify({"error": "internship is not accepting applications"}), 400

    student = Student.query.filter_by(
        user_id=int(get_jwt_identity())
    ).first()
    if not student:
        return jsonify({"error": "student profile not found"}), 404

    application = InternshipApplication.query.filter_by(
        internship_id=internship.id,
        student_id=student.id,
    ).first()

    if application:
        return jsonify({
            "message": "already applied",
            "application": application.to_dict(),
        }), 200

    application = InternshipApplication(
        internship_id=internship.id,
        student_id=student.id,
    )
    db.session.add(application)
    db.session.commit()
    return jsonify({
        "message": "application submitted",
        "application": application.to_dict(),
    }), 201


@internships_bp.post("/internships/<int:internship_id>/assess")
@role_required("mentor")
def assess_student(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404

    data = request.get_json() or {}
    student_id = data.get("student_id")
    score = data.get("score")

    if student_id is None or score is None:
        return jsonify({"error": "student_id and score are required"}), 400

    try:
        score = float(score)
    except (TypeError, ValueError):
        return jsonify({"error": "score must be a number"}), 400

    if score < 0 or score > 100:
        return jsonify({"error": "score must be between 0 and 100"}), 400

    application = InternshipApplication.query.filter_by(
        internship_id=internship.id,
        student_id=student_id,
    ).first()
    if not application:
        return jsonify({"error": "student has not applied"}), 404

    mentor = Mentor.query.filter_by(
        userId=int(get_jwt_identity())
    ).first()
    if not mentor:
        return jsonify({"error": "mentor profile not found"}), 404

    assessment = Assessment.query.filter_by(
        internship_id=internship.id,
        student_id=student_id,
    ).first()

    if not assessment:
        assessment = Assessment(
            internship_id=internship.id,
            student_id=student_id,
            mentor_id=mentor.mentorId,
        )
        db.session.add(assessment)

    assessment.score = score
    assessment.feedback = data.get("feedback")
    assessment.completed = data.get("completed", True)

    db.session.commit()
    return jsonify({
        "message": "assessment saved",
        "assessment": assessment.to_dict(),
    }), 200


@internships_bp.post("/internships/<int:internship_id>/certificate")
@role_required("employer", "admin")
def generate_certificate(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404

    data = request.get_json() or {}
    student_id = data.get("student_id")
    if student_id is None:
        return jsonify({"error": "student_id is required"}), 400

    assessment = Assessment.query.filter_by(
        internship_id=internship.id,
        student_id=student_id,
        completed=True,
    ).first()
    if not assessment:
        return jsonify({"error": "internship is not completed"}), 400

    certificate = Certificate.query.filter_by(
        internship_id=internship.id,
        student_id=student_id,
    ).first()
    if certificate:
        return jsonify({
            "message": "certificate already generated",
            "certificate": certificate.to_dict(),
        }), 200

    certificate = Certificate(
        internship_id=internship.id,
        student_id=student_id,
        issuer_id=int(get_jwt_identity()),
        certificate_data=(
            f"Certificate of completion for {internship.title}"
        ),
        grade_summary=f"Final score: {assessment.score}",
    )
    db.session.add(certificate)
    db.session.commit()

    return jsonify({
        "message": "certificate generated",
        "certificate": certificate.to_dict(),
    }), 201
