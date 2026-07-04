from flask import Blueprint, jsonify

students_bp = Blueprint("students", __name__)


@students_bp.get("/")
def list_students():
    # TODO: return all student profiles
    return jsonify([])


@students_bp.get("/<int:student_id>")
def get_student(student_id):
    # TODO: return a single student profile
    return jsonify({"message": "not implemented"}), 501


@students_bp.put("/<int:student_id>")
def update_student(student_id):
    # TODO: update a student profile
    return jsonify({"message": "not implemented"}), 501


@students_bp.post("/<int:student_id>/apply/<int:internship_id>")
def apply_to_internship(student_id, internship_id):
    # TODO: create an application linking student and internship
    return jsonify({"message": "not implemented"}), 501
