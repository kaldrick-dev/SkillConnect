<<<<<<< HEAD
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
=======
from flask import Blueprint, jsonify
from app.models import Submission
>>>>>>> dev

submissions_bp = Blueprint("submissions", __name__)

submissions = []


@submissions_bp.post("/task/<int:task_id>")
@jwt_required()
def submit_deliverable(task_id):
<<<<<<< HEAD
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
=======
    return jsonify({"message": "submission endpoint not implemented"}), 501
>>>>>>> dev


@submissions_bp.get("/task/<int:task_id>")
def list_submissions(task_id):
<<<<<<< HEAD
    task_submissions = [s for s in submissions if s["task_id"] == task_id]
    return jsonify(task_submissions), 200
=======
    submissions = Submission.query.filter_by(task_id=task_id).all()
    return jsonify([submission.to_dict() for submission in submissions])
>>>>>>> dev


@submissions_bp.put("/<int:submission_id>/review")
@jwt_required()
def review_submission(submission_id):
<<<<<<< HEAD
    return jsonify({"message": "review noted"}), 200
=======
    submission = Submission.query.get_or_404(submission_id)
    return jsonify({
        "id": submission.id,
        "score": submission.score,
        "feedback": submission.feedback,
        "graded_by_id": submission.graded_by_id,
        "graded_at": submission.graded_at.isoformat() if submission.graded_at else None,
    })
>>>>>>> dev
