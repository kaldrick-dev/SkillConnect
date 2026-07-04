from flask import Blueprint, jsonify

mentors_bp = Blueprint("mentors", __name__)


@mentors_bp.get("/")
def list_mentors():
    # TODO: return all mentor profiles
    return jsonify([])


@mentors_bp.get("/<int:mentor_id>")
def get_mentor(mentor_id):
    # TODO: return a single mentor profile
    return jsonify({"message": "not implemented"}), 501


@mentors_bp.get("/<int:mentor_id>/students")
def list_mentor_students(mentor_id):
    # TODO: return students assigned to this mentor for progress review
    return jsonify([])
