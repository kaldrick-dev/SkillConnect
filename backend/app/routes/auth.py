from flask import Blueprint, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    # TODO: create a user (student, mentor, or employer) and hash their password
    return jsonify({"message": "not implemented"}), 501


@auth_bp.post("/login")
def login():
    # TODO: verify credentials and return a JWT access token
    return jsonify({"message": "not implemented"}), 501
