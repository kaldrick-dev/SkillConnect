from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.extensions import db
from app.models import Internship
from app.utils import role_required

internships_bp = Blueprint("internships", __name__)


@internships_bp.get("/")
def list_internships():
    internships = Internship.query.all()
    return jsonify([i.to_dict() for i in internships]), 200


@internships_bp.post("/")
@role_required("employer")
def create_internship():
    data = request.get_json()

    if not data or "title" not in data:
        return jsonify({"error": "title is required"}), 400

    internship = Internship(
        title=data["title"],
        description=data.get("description"),
        location=data.get("location"),
        employer_id=int(get_jwt_identity())
    )

    db.session.add(internship)
    db.session.commit()

    return jsonify({
        "message": "internship created",
        "internship": internship.to_dict()
    }), 201

@internships_bp.get("/<int:internship_id>")
def get_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    return jsonify(internship.to_dict()), 200


@internships_bp.put("/<int:internship_id>")
@role_required("employer")
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
@role_required("student")
def apply_to_internship(internship_id):
    internship = Internship.query.get(internship_id)
    if not internship:
        return jsonify({"error": "internship not found"}), 404
    student_id = get_jwt_identity()
    return jsonify({"message": f"student {student_id} applied to internship {internship_id}"}), 201
