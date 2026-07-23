from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.extensions import db
from app.models import Submission, Task
from app.utils import role_required
from datetime import datetime

submissions_bp = Blueprint("submissions", __name__)


@submissions_bp.get("/task/<int:task_id>")
def list_submissions(task_id):
    Task.query.get_or_404(task_id)
    submissions = Submission.query.filter_by(task_id=task_id).all()
    return jsonify([s.to_dict() for s in submissions]), 200


@submissions_bp.put("/<int:submission_id>/review")
@role_required("mentor", "employer")
def review_submission(submission_id):
    submission = Submission.query.get_or_404(submission_id)
    data = request.get_json() or {}

    submission.score = data.get("score", submission.score)
    submission.feedback = data.get("feedback", submission.feedback)
    submission.graded_by_id = int(get_jwt_identity())
    submission.graded_at = datetime.utcnow()
    submission.passed = data.get("passed", submission.passed)

    db.session.commit()

    return jsonify({
        "message": "submission reviewed",
        "submission": submission.to_dict()
    }), 200
