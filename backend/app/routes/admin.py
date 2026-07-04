from flask import Blueprint, jsonify

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/users")
def list_users():
    # TODO: return all platform users for the admin dashboard
    return jsonify([])


@admin_bp.delete("/users/<int:user_id>")
def deactivate_user(user_id):
    # TODO: deactivate/remove a user account
    return jsonify({"message": "not implemented"}), 501


@admin_bp.get("/stats")
def platform_stats():
    # TODO: return enrollment, completion rate, and engagement stats
    return jsonify({})
