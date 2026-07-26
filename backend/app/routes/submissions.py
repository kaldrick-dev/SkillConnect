from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity
from app.extensions import db
from app.models import Employer, Student, Submission, Task
from app.utils import role_required
from datetime import datetime

submissions_bp = Blueprint("submissions", __name__)


@submissions_bp.get("/mine")
@role_required("student")
def list_my_submissions():
    student = Student.query.filter_by(
        user_id=int(get_jwt_identity())
    ).first()
    if not student:
        return jsonify({"error": "student profile not found"}), 404
    return jsonify([
        submission.to_dict()
        for submission in Submission.query.filter_by(
            student_id=student.id
        ).all()
    ]), 200


@submissions_bp.get("/task/<int:task_id>")
@role_required("mentor", "employer", "admin")
def list_submissions(task_id):
    task = Task.query.get_or_404(task_id)
    if get_jwt().get("role") == "employer":
        employer = Employer.query.filter_by(
            user_id=int(get_jwt_identity())
        ).first()
        if not employer or task.internship.employer_id != employer.id:
            return jsonify({
                "error": "You can only view your own project submissions"
            }), 403
    submissions = Submission.query.filter_by(task_id=task_id).all()
    return jsonify([s.to_dict() for s in submissions]), 200


@submissions_bp.put("/<int:submission_id>/review")
@role_required("mentor", "employer")
def review_submission(submission_id):
    submission = Submission.query.get_or_404(submission_id)
    task = db.session.get(Task, submission.task_id)
    if get_jwt().get("role") == "employer":
        employer = Employer.query.filter_by(
            user_id=int(get_jwt_identity())
        ).first()
        if (
            not employer
            or not task
            or task.internship.employer_id != employer.id
        ):
            return jsonify({
                "error": "You can only review your own project submissions"
            }), 403
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
