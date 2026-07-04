from flask import Blueprint, jsonify

submissions_bp = Blueprint("submissions", __name__)


@submissions_bp.post("/task/<int:task_id>")
def submit_deliverable(task_id):
    # TODO: student submits a deliverable for a task
    return jsonify({"message": "not implemented"}), 501


@submissions_bp.get("/task/<int:task_id>")
def list_submissions(task_id):
    # TODO: mentor/employer reviews submissions for a task
    return jsonify([])


@submissions_bp.put("/<int:submission_id>/review")
def review_submission(submission_id):
    # TODO: mentor provides feedback/score on a submission
    return jsonify({"message": "not implemented"}), 501
