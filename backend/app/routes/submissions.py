from flask import Blueprint, jsonify
from app.models import Submission

submissions_bp = Blueprint("submissions", __name__)


@submissions_bp.post("/task/<int:task_id>")
def submit_deliverable(task_id):
    return jsonify({"message": "submission endpoint not implemented"}), 501


@submissions_bp.get("/task/<int:task_id>")
def list_submissions(task_id):
    submissions = Submission.query.filter_by(task_id=task_id).all()
    return jsonify([submission.to_dict() for submission in submissions])


@submissions_bp.put("/<int:submission_id>/review")
def review_submission(submission_id):
    submission = Submission.query.get_or_404(submission_id)
    return jsonify({
        "id": submission.id,
        "score": submission.score,
        "feedback": submission.feedback,
        "graded_by_id": submission.graded_by_id,
        "graded_at": submission.graded_at.isoformat() if submission.graded_at else None,
    })
