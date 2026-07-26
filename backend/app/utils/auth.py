from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request


def role_required(*allowed_roles):
    def decorator(view):
        @wraps(view)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()

            claims = get_jwt()
            user_role = claims.get("role")

            if user_role not in allowed_roles:
                return jsonify({"error": "Access denied"}), 403

            return view(*args, **kwargs)

        return wrapper

    return decorator
