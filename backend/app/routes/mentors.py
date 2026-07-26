from flask import Blueprint, jsonify

from app.extensions import db
from app.models import InternshipApplication, Mentor, Student

mentors_bp = Blueprint("mentors", __name__)


@mentors_bp.get("/")
def list_mentors():
    return jsonify([
        mentor.to_dict()
        for mentor in Mentor.query.all()
    ]), 200


@mentors_bp.get("/<int:mentor_id>")
def get_mentor(mentor_id):
    mentor = db.session.get(Mentor, mentor_id)
    if not mentor:
        return jsonify({"error": "mentor not found"}), 404
    return jsonify(mentor.to_dict()), 200


@mentors_bp.get("/<int:mentor_id>/students")
def list_mentor_students(mentor_id):
    mentor = db.session.get(Mentor, mentor_id)
    if not mentor:
        return jsonify({"error": "mentor not found"}), 404

    student_ids = {
        application.student_id
        for application in InternshipApplication.query.all()
    }
    students = Student.query.filter(Student.id.in_(student_ids)).all()
    return jsonify([
        {
            **student.to_dict(),
            "email": student.user.email,
        }
        for student in students
    ]), 200
