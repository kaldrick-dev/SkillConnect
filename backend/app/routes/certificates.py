from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import Certificate
from app.utils import role_required

certificates_bp = Blueprint("certificates", __name__)


@certificates_bp.post("/internship/<int:internship_id>")
@role_required("employer", "admin")
def generate_certificate(internship_id):
    data = request.get_json() or {}
    certificate = Certificate(
        student_id=data.get("student_id"),
        internship_id=internship_id,
        certificate_data=data.get("certificate_data"),
        grade_summary=data.get("grade_summary"),
        issuer_id=data.get("issuer_id"),
    )
    db.session.add(certificate)
    db.session.commit()
    return jsonify(certificate.to_dict()), 201


@certificates_bp.get("/student/<int:student_id>")
@role_required("student", "admin")
def list_student_certificates(student_id):
    # TODO: return all certificates earned by a student
    return jsonify([])
