from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import Internship, Task

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.get("/internship/<int:internship_id>")
def list_tasks(internship_id):
    internship = Internship.query.get_or_404(internship_id)
    return jsonify([task.to_dict() for task in internship.tasks]), 200


@tasks_bp.post("/internship/<int:internship_id>")
@jwt_required()
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