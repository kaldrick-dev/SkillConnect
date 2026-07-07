from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import User

employers_bp = Blueprint("employers", __name__)


@employers_bp.get("/")
def list_employers():
    employers = User.query.filter_by(role="employer").all()
    return jsonify([e.to_dict() for e in employers]), 200


@employers_bp.get("/<int:employer_id>")
def get_employer(employer_id):
    employer = User.query.filter_by(id=employer_id, role="employer").first()
    if not employer:
        return jsonify({"error": "employer not found"}), 404
    return jsonify(employer.to_dict()), 200


@employers_bp.put("/<int:employer_id>")
@jwt_required()
def update_employer(employer_id):
    employer = User.query.filter_by(id=employer_id, role="employer").first()
    if not employer:
        return jsonify({"error": "employer not found"}), 404

    data = request.get_json()
    if "full_name" in data:
        employer.full_name = data["full_name"]
    if "email" in data:
        employer.email = data["email"]

    db.session.commit()
    return jsonify({"message": "employer updated", "user": employer.to_dict()}), 200


@employers_bp.get("/<int:employer_id>/internships")
def list_employer_internships(employer_id):
    employer = User.query.filter_by(id=employer_id, role="employer").first()
    if not employer:
        return jsonify({"error": "employer not found"}), 404
    return jsonify([]), 200