from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity

from app.extensions import db
from app.models import Student, User
from app.utils import role_required

students_bp = Blueprint("students", __name__)


@students_bp.get("/")
def list_students():
    students = User.query.filter_by(role="student").all()
    return jsonify([s.to_dict() for s in students]), 200


@students_bp.get("/<int:student_id>")
def get_student(student_id):
    user = User.query.filter_by(id=student_id, role="student").first()
    if not user:
        return jsonify({"error": "student not found"}), 404
    data = user.to_dict()
    data["profile"] = user.student.to_dict() if user.student else None
    return jsonify(data), 200


@students_bp.put("/<int:student_id>")
@role_required("student", "admin")
def update_student(student_id):
    requester_id = int(get_jwt_identity())
    if get_jwt().get("role") != "admin" and requester_id != student_id:
        return jsonify({"error": "You can only update your own profile"}), 403

    user = User.query.filter_by(id=student_id, role="student").first()
    if not user:
        return jsonify({"error": "student not found"}), 404

    data = request.get_json() or {}
    if "email" in data:
        email = str(data["email"]).strip().lower()
        duplicate = User.query.filter(
            User.email == email,
            User.id != user.id,
        ).first()
        if duplicate:
            return jsonify({"error": "Email already registered"}), 409
        user.email = email
    if "is_active" in data:
        user.is_active = data["is_active"]

    profile = user.student
    if not profile:
        profile = Student(user_id=user.id)
        db.session.add(profile)

    for field in (
        "first_name",
        "last_name",
        "bio",
        "skills",
        "university",
        "graduation_year",
        "resume_url",
    ):
        if field in data:
            setattr(profile, field, data[field])

    db.session.commit()
    return jsonify({
        "message": "student updated",
        "user": user.to_dict(),
        "profile": profile.to_dict(),
    }), 200
