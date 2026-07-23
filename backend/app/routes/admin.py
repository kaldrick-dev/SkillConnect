from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models import User, Internship, Submission

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/users")
@jwt_required()
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.delete("/users/<int:user_id>")
@jwt_required()
def deactivate_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = False
    from app.extensions import db
    db.session.commit()
    return jsonify({"message": "user deactivated"}), 200


@admin_bp.get("/stats")
@jwt_required()
def platform_stats():
    total_users = User.query.count()
    total_students = User.query.filter_by(role="student").count()
    total_employers = User.query.filter_by(role="employer").count()
    total_mentors = User.query.filter_by(role="mentor").count()
    total_internships = Internship.query.count()
    total_submissions = Submission.query.count()

    return jsonify({
        "total_users": total_users,
        "total_students": total_students,
        "total_employers": total_employers,
        "total_mentors": total_mentors,
        "total_internships": total_internships,
        "total_submissions": total_submissions
    }), 200