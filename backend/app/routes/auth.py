from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models import Employer, Mentor, Student, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}

    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = ["email", "password", "role"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    if data["role"] not in ("student", "employer", "mentor", "admin"):
        return jsonify({"error": "Invalid role"}), 400

    email = str(data["email"]).strip().lower()
    if not email or "@" not in email:
        return jsonify({"error": "A valid email is required"}), 400

    if len(str(data["password"])) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        email=email,
        role=data["role"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.flush()

    if user.role == "student":
        db.session.add(Student(
            user_id=user.id,
            first_name=str(data.get("first_name", "")).strip() or None,
            last_name=str(data.get("last_name", "")).strip() or None,
            university=str(data.get("university", "")).strip() or None,
        ))
    elif user.role == "employer":
        company_name = str(data.get("company_name", "")).strip()
        if not company_name:
            db.session.rollback()
            return jsonify({"error": "company_name is required for employers"}), 400
        db.session.add(Employer(
            user_id=user.id,
            company_name=company_name,
            contact_email=email,
        ))
    elif user.role == "mentor":
        db.session.add(Mentor(
            userId=user.id,
            expertise=str(data.get("expertise", "")).strip() or "General",
        ))

    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": serialize_user(user)
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    if not all(k in data for k in ("email", "password")):
        return jsonify({"error": "email and password are required"}), 400

    email = str(data["email"]).strip().lower()
    user = User.query.filter_by(email=email).first()

    if not user or not user.is_active or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "access_token": token,
        "user": serialize_user(user)
    }), 200


def serialize_user(user):
    data = user.to_dict()
    if user.role == "student" and user.student:
        data["profile"] = user.student.to_dict()
    elif user.role == "employer" and user.employer:
        data["profile"] = user.employer.to_dict()
    return data
