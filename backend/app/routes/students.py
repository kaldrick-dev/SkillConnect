from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import User, Student

students_bp = Blueprint("students", __name__)


@students_bp.get("/")
def list_students():
    students = User.query.filter_by(role="student").all()
    return jsonify([s.to_dict() for s in students]), 200


@students_bp.get("/<int:student_id>")
def get_student(student_id):
    student = User.query.filter_by(id=student_id, role="student").first()
    if not student:
        return jsonify({"error": "student not found"}), 404
    return jsonify(student.to_dict()), 200


@students_bp.put("/<int:student_id>")
@jwt_required()
def update_student(student_id):
    student = User.query.filter_by(id=student_id, role="student").first()
    if not student:
        return jsonify({"error": "student not found"}), 404

    data = request.get_json() or {}

    if "email" in data:
        student.email = data["email"]
    if "is_active" in data:
        student.is_active = data["is_active"]

    db.session.commit()
    return jsonify({"message": "student updated", "user": student.to_dict()}), 200