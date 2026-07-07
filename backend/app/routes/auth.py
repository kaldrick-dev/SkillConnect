from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ("full_name", "email", "password", "role")):
        return jsonify({"error": "full_name, email, password and role are required"}), 400

    # check role is valid
    if data["role"] not in ("student", "mentor", "employer", "admin"):
        return jsonify({"error": "role must be student, mentor, employer or admin"}), 400

    # looking if email already exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "email already registered"}), 409

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        role=data["role"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "user registered successfully", "user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
   data = request.get_json()

   if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "email and password are required"}), 400

   user = User.query.filter_by(email=data["email"]).first()

   if not user or not user.check_password(data["password"]):
        return jsonify({"error": "invalid email or password"}), 401

   access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

   return jsonify({
        "message": "login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200