from flask import Blueprint, jsonify

internships_bp = Blueprint("internships", __name__)


@internships_bp.get("/")
def list_internships():
    # TODO: return all internship postings (with filters e.g. skill, employer)
    return jsonify([])


@internships_bp.post("/")
def create_internship():
    # TODO: employer creates a new internship posting
    return jsonify({"message": "not implemented"}), 501


@internships_bp.get("/<int:internship_id>")
def get_internship(internship_id):
    # TODO: return internship details, tasks, and assigned mentor
    return jsonify({"message": "not implemented"}), 501


@internships_bp.put("/<int:internship_id>")
def update_internship(internship_id):
    # TODO: update an internship posting
    return jsonify({"message": "not implemented"}), 501
