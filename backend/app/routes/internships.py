from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from app.extensions import db
from app.models import (
    Assessment,
    Certificate,
    Employer,
    Internship,
    InternshipApplication,
    Mentor,
    Student,
    Task,
)
from app.utils import role_required

internships_bp = Blueprint("internships", __name__)


@internships_bp.get("/internships")
def list_internships():
    query = Internship.query.options(
        joinedload(Internship.employer)
    )
    search = request.args.get("search", "").strip()
    location = request.args.get("location", "").strip()
    is_active = request.args.get("is_active")

    if search:
        term = f"%{search}%"
        query = query.filter(or_(
            Internship.title.ilike(term),
            Internship.description.ilike(term),
        ))

    if location:
        query = query.filter(
            Internship.location.ilike(f"%{location}%")
        )

    if is_active == "true":
        query = query.filter(Internship.is_active.is_(True))
    elif is_active == "false":
        query = query.filter(Internship.is_active.is_(False))

    internships = query.order_by(Internship.created_at.desc()).all()
    response = jsonify([
        internship.to_dict()
        for internship in internships
    ])
    response.headers["Cache-Control"] = "public, max-age=30"
    return response, 200


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
    internship = db.session.get(Internship, internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    return jsonify(internship.to_dict()), 200


@internships_bp.put("/internships/<int:internship_id>")
@role_required("employer")
def update_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    employer = Employer.query.filter_by(
        user_id=int(get_jwt_identity())
    ).first()
    if not employer or internship.employer_id != employer.id:
        return jsonify({"error": "You can only update your own internships"}), 403

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
    internship = db.session.get(Internship, internship_id)
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


@internships_bp.get("/applications/mine")
@role_required("student")
def list_my_applications():
    applications = InternshipApplication.query.options(
        joinedload(InternshipApplication.student).joinedload(Student.user),
        joinedload(InternshipApplication.internship).joinedload(
            Internship.employer
        ),
        joinedload(InternshipApplication.internship)
        .joinedload(Internship.tasks)
        .joinedload(Task.submissions),
    ).filter(
        InternshipApplication.student.has(
            user_id=int(get_jwt_identity())
        )
    ).all()
    return jsonify([
        serialize_application(application, include_work=True)
        for application in applications
    ]), 200


@internships_bp.get(
    "/internships/<int:internship_id>/applications"
)
@role_required("employer", "mentor", "admin")
def list_internship_applications(internship_id):
    internship = db.session.get(Internship, internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404

    if get_jwt().get("role") == "employer":
        employer = Employer.query.filter_by(
            user_id=int(get_jwt_identity())
        ).first()
        if not employer or internship.employer_id != employer.id:
            return jsonify({
                "error": "You can only view your own internship applications"
            }), 403

    applications = InternshipApplication.query.options(
        joinedload(InternshipApplication.student).joinedload(Student.user),
        joinedload(InternshipApplication.internship).joinedload(
            Internship.employer
        ),
    ).filter_by(internship_id=internship.id).all()
    return jsonify([
        serialize_application(application)
        for application in applications
    ]), 200


@internships_bp.get(
    "/internships/<int:internship_id>/workspace"
)
@role_required("employer", "mentor", "admin")
def internship_workspace(internship_id):
    internship = Internship.query.options(
        joinedload(Internship.employer),
        joinedload(Internship.applications)
        .joinedload(InternshipApplication.student)
        .joinedload(Student.user),
        joinedload(Internship.tasks).joinedload(Task.submissions),
    ).filter_by(id=internship_id).first()
    if not internship:
        return jsonify({"error": "internship not found"}), 404

    if (
        get_jwt().get("role") == "employer"
        and internship.employer.user_id != int(get_jwt_identity())
    ):
        return jsonify({
            "error": "You can only view your own project workspace"
        }), 403

    return jsonify({
        "internship": internship.to_dict(),
        "applications": [
            serialize_application(application)
            for application in internship.applications
        ],
        "tasks": [
            {
                **task.to_dict(),
                "submissions": [
                    submission.to_dict()
                    for submission in task.submissions
                ],
            }
            for task in sorted(
                internship.tasks,
                key=lambda item: (item.order, item.id),
            )
        ],
    }), 200


@internships_bp.put("/applications/<int:application_id>")
@role_required("employer", "admin")
def update_application(application_id):
    application = db.session.get(InternshipApplication, application_id)
    if not application:
        return jsonify({"error": "application not found"}), 404

    internship = db.session.get(Internship, application.internship_id)
    if get_jwt().get("role") == "employer":
        employer = Employer.query.filter_by(
            user_id=int(get_jwt_identity())
        ).first()
        if not employer or internship.employer_id != employer.id:
            return jsonify({
                "error": "You can only manage your own applications"
            }), 403

    status = (request.get_json() or {}).get("status")
    allowed_statuses = {"applied", "accepted", "rejected", "completed"}
    if status not in allowed_statuses:
        return jsonify({
            "error": (
                "status must be applied, accepted, rejected, or completed"
            )
        }), 400

    application.status = status
    db.session.commit()
    return jsonify({
        "message": "application updated",
        "application": serialize_application(application),
    }), 200


@internships_bp.post("/internships/<int:internship_id>/assess")
@role_required("mentor")
def assess_student(internship_id):
    internship = db.session.get(Internship, internship_id)
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
    internship = db.session.get(Internship, internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    if get_jwt().get("role") == "employer":
        employer = Employer.query.filter_by(
            user_id=int(get_jwt_identity())
        ).first()
        if not employer or internship.employer_id != employer.id:
            return jsonify({
                "error": "You can only issue certificates for your internships"
            }), 403

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


def serialize_application(application, include_work=False):
    internship = application.internship
    student = application.student
    data = {
        **application.to_dict(),
        "internship": internship.to_dict() if internship else None,
        "student": (
            {
                **student.to_dict(),
                "email": student.user.email if student.user else None,
            }
            if student
            else None
        ),
    }
    if include_work and internship:
        data["tasks"] = [
            {
                **task.to_dict(),
                "submissions": [
                    submission.to_dict()
                    for submission in task.submissions
                    if submission.student_id == application.student_id
                ],
            }
            for task in sorted(
                internship.tasks,
                key=lambda item: (item.order, item.id),
            )
        ]
    return data
