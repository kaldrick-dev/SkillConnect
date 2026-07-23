from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import Internship, Student, Submission, Task
from app.utils import role_required

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.get("/internships/<int:internship_id>/tasks")
def list_tasks(internship_id):
    internship = Internship.query.get_or_404(internship_id)
    return jsonify([task.to_dict() for task in internship.tasks]), 200


@tasks_bp.post("/internships/<int:internship_id>/tasks")
@role_required("employer")
def create_task(internship_id):
    internship = Internship.query.get_or_404(internship_id)
    data = request.get_json() or {}

    if not data.get("title"):
        return jsonify({"error": "title is required"}), 400

    task = Task(
        internship_id=internship.id,
        title=data.get("title"),
        description=data.get("description"),
        order=data.get("order", 0),
        max_score=data.get("max_score", 100),
        due_date=data.get("due_date"),
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "task created", "task": task.to_dict()}), 201


@tasks_bp.post("/tasks/<int:task_id>/submit")
@role_required("student")
def submit_task(task_id):
    Task.query.get_or_404(task_id)
    data = request.get_json() or {}

    student = Student.query.filter_by(
        user_id=int(get_jwt_identity())
    ).first()
    if not student:
        return jsonify({"error": "student profile not found"}), 404

    submission = Submission(
        task_id=task_id,
        student_id=student.id,
        content_url=data.get("content_url"),
        submitted_at=datetime.utcnow(),
    )

    db.session.add(submission)
    db.session.commit()

    return jsonify({
        "message": "submission received",
        "submission": submission.to_dict(),
    }), 201
