from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity
from app.extensions import db
from app.models import Employer, User, Internship
from app.utils import role_required

employers_bp = Blueprint("employers", __name__)


@employers_bp.get("/")
def list_employers():
    employers = User.query.filter_by(role="employer").all()
    return jsonify([serialize_employer(e) for e in employers]), 200


@employers_bp.get("/<int:employer_id>")
def get_employer(employer_id):
    employer = User.query.filter_by(id=employer_id, role="employer").first()
    if not employer:
        return jsonify({"error": "employer not found"}), 404
    return jsonify(serialize_employer(employer)), 200


@employers_bp.put("/<int:employer_id>")
@role_required("employer", "admin")
def update_employer(employer_id):
    if (
        get_jwt().get("role") != "admin"
        and int(get_jwt_identity()) != employer_id
    ):
        return jsonify({"error": "You can only update your own profile"}), 403

    employer = User.query.filter_by(id=employer_id, role="employer").first()
    if not employer:
        return jsonify({"error": "employer not found"}), 404

    data = request.get_json() or {}

    if "email" in data:
        employer.email = data["email"]
    if "is_active" in data:
        employer.is_active = data["is_active"]

    profile = employer.employer
    if not profile:
        return jsonify({"error": "employer profile not found"}), 404
    for field in (
        "company_name",
        "website",
        "contact_name",
        "contact_email",
    ):
        if field in data:
            setattr(profile, field, data[field])

    db.session.commit()
    return jsonify({
        "message": "employer updated",
        "user": employer.to_dict(),
        "profile": profile.to_dict(),
    }), 200


@employers_bp.get("/<int:employer_id>/internships")
def list_employer_internships(employer_id):
    employer = User.query.filter_by(id=employer_id, role="employer").first()
    if not employer:
        return jsonify({"error": "employer not found"}), 404
    internships = Internship.query.filter_by(
        employer_id=employer.employer.id
    ).all()
    return jsonify([i.to_dict() for i in internships]), 200


def serialize_employer(user):
    data = user.to_dict()
    data["profile"] = user.employer.to_dict() if user.employer else None
    return data
