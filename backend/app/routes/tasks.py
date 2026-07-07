from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import Task

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.get("/internship/<int:internship_id>")
def list_tasks(internship_id):
    tasks = Task.query.filter_by(internship_id=internship_id).all()
    return jsonify([t.to_dict() for t in tasks]), 200


@tasks_bp.post("/internship/<int:internship_id>")
@jwt_required()
def create_task(internship_id):
    data = request.get_json()

    if not data or not all(k in data for k in ("title", "description")):
        return jsonify({"error": "title and description are required"}), 400

    task = Task(
        internship_id=internship_id,
        title=data["title"],
        description=data["description"]
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "task created", "task": task.to_dict()}), 201