from flask import Blueprint, jsonify

certificates_bp = Blueprint("certificates", __name__)


@certificates_bp.post("/internship/<int:internship_id>")
def generate_certificate(internship_id):
    # TODO: generate a competency-based certificate on internship completion
    return jsonify({"message": "not implemented"}), 501


@certificates_bp.get("/student/<int:student_id>")
def list_student_certificates(student_id):
    # TODO: return all certificates earned by a student
    return jsonify([])
