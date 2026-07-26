from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity

from app.models import Certificate, Student
from app.utils import role_required

certificates_bp = Blueprint("certificates", __name__)


@certificates_bp.get("/student/<int:student_id>")
@role_required("student", "admin")
def list_student_certificates(student_id):
    if get_jwt().get("role") == "student":
        student = Student.query.filter_by(
            user_id=int(get_jwt_identity())
        ).first()
        if not student or student.id != student_id:
            return jsonify({
                "error": "You can only view your own certificates"
            }), 403
    certificates = Certificate.query.filter_by(student_id=student_id).all()
    return jsonify([
        certificate.to_dict() for certificate in certificates
    ]), 200
