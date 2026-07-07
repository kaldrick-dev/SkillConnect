from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Internship

internships_bp = Blueprint("internships", __name__)


@internships_bp.get("/")
def list_internships():
    internships = Internship.query.all()
    return jsonify([i.to_dict() for i in internships]), 200


@internships_bp.post("/")
@jwt_required()
def create_internship():
    data = request.get_json()

    if not data or not all(k in data for k in ("title", "description")):
        return jsonify({"error": "title and description are required"}), 400

    employer_id = get_jwt_identity()

    internship = Internship(
        title=data["title"],
        description=data["description"],
        employer_id=employer_id
    )

    db.session.add(internship)
    db.session.commit()

    return jsonify({"message": "internship created", "internship": internship.to_dict()}), 201


@internships_bp.get("/<int:internship_id>")
def get_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    return jsonify(internship.to_dict()), 200


@internships_bp.put("/<int:internship_id>")
@jwt_required()
def update_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404

    data = request.get_json()
    if "title" in data:
        internship.title = data["title"]
    if "description" in data:
        internship.description = data["description"]

    db.session.commit()
    return jsonify({"message": "internship updated", "internship": internship.to_dict()}), 200


@internships_bp.post("/<int:internship_id>/apply")
@jwt_required()
def apply_to_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    student_id = get_jwt_identity()
    return jsonify({"message": f"student {student_id} applied to internship {internship_id}"}), 201