from flask import Blueprint, jsonify

from app.models import Certificate
from app.utils import role_required

certificates_bp = Blueprint("certificates", __name__)


@certificates_bp.get("/student/<int:student_id>")
@role_required("student", "admin")
def list_student_certificates(student_id):
    certificates = Certificate.query.filter_by(student_id=student_id).all()
    return jsonify([
        certificate.to_dict() for certificate in certificates
    ]), 200
