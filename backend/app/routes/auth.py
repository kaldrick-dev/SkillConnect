from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = ["email", "password", "role"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    if data["role"] not in ("student", "employer", "mentor", "admin"):
        return jsonify({"error": "Invalid role"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        email=data["email"],
        role=data["role"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": user.to_dict()
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    if not all(k in data for k in ("email", "password")):
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "access_token": token,
        "user": user.to_dict()
    }), 200