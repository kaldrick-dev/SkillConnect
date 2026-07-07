from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db

submissions_bp = Blueprint("submissions", __name__)

submissions = []


@submissions_bp.post("/task/<int:task_id>")
@jwt_required()
def submit_deliverable(task_id):
    data = request.get_json()

    if not data or "content" not in data:
        return jsonify({"error": "content is required"}), 400

    student_id = get_jwt_identity()

    submission = {
        "task_id": task_id,
        "student_id": student_id,
        "content": data["content"]
    }
    submissions.append(submission)

    return jsonify({"message": "submission received", "submission": submission}), 201


@submissions_bp.get("/task/<int:task_id>")
def list_submissions(task_id):
    task_submissions = [s for s in submissions if s["task_id"] == task_id]
    return jsonify(task_submissions), 200


@submissions_bp.put("/<int:submission_id>/review")
@jwt_required()
def review_submission(submission_id):
    return jsonify({"message": "review noted"}), 200