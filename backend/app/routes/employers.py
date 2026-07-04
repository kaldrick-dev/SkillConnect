from flask import Blueprint, jsonify

employers_bp = Blueprint("employers", __name__)


@employers_bp.get("/")
def list_employers():
    # TODO: return all employer profiles
    return jsonify([])


@employers_bp.get("/<int:employer_id>")
def get_employer(employer_id):
    # TODO: return a single employer profile
    return jsonify({"message": "not implemented"}), 501


@employers_bp.get("/<int:employer_id>/internships")
def list_employer_internships(employer_id):
    # TODO: return internships posted by this employer
    return jsonify([])
