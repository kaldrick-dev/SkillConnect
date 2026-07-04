from flask import Blueprint, jsonify

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.get("/internship/<int:internship_id>")
def list_tasks(internship_id):
    # TODO: return tasks assigned within an internship
    return jsonify([])


@tasks_bp.post("/internship/<int:internship_id>")
def create_task(internship_id):
    # TODO: mentor/employer assigns a new task with a deadline
    return jsonify({"message": "not implemented"}), 501
