from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db
from app.models import User


auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400


    required = ["fullName", "email", "password", "role"]

    for field in required:
        if field not in data:
            return jsonify({
                "error": f"{field} is required"
            }), 400


    existing = User.query.filter_by(
        email=data["email"]
    ).first()


    if existing:
        return jsonify({
            "error": "Email already registered"
        }), 409


    user = User(
        fullName=data["fullName"],
        email=data["email"],
        password=generate_password_hash(data["password"]),
        role=data["role"]
    )


    db.session.add(user)
    db.session.commit()


    return jsonify({
        "message": "User registered successfully",
        "userId": user.userId
    }), 201



@auth_bp.post("/login")
def login():

    data = request.get_json()


    if not data:
        return jsonify({
            "error": "No data provided"
        }), 400


    user = User.query.filter_by(
        email=data["email"]
    ).first()


    if not user:
        return jsonify({
            "error": "Invalid credentials"
        }), 401


    if not check_password_hash(
        user.password,
        data["password"]
    ):
        return jsonify({
            "error": "Invalid credentials"
        }), 401



    token = create_access_token(
        identity=str(user.userId),
        additional_claims={
            "role": user.role
        }
    )


    return jsonify({
        "access_token": token,
        "user": {
            "userId": user.userId,
            "fullName": user.fullName,
            "email": user.email,
            "role": user.role
        }
    }), 200