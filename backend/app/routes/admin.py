from flask import Blueprint, jsonify
from sqlalchemy import case, func
from app.extensions import db
from app.models import User, Internship, Submission
from app.utils import role_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/users")
@role_required("admin")
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.delete("/users/<int:user_id>")
@role_required("admin")
def deactivate_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    return jsonify({"message": "user deactivated"}), 200


@admin_bp.patch("/users/<int:user_id>/reactivate")
@role_required("admin")
def reactivate_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = True
    db.session.commit()
    return jsonify({"message": "user reactivated", "user": user.to_dict()}), 200


@admin_bp.get("/stats")
@role_required("admin")
def platform_stats():
    return jsonify(build_platform_stats()), 200


@admin_bp.get("/overview")
@role_required("admin")
def platform_overview():
    return jsonify({
        "stats": build_platform_stats(),
        "users": [user.to_dict() for user in User.query.all()],
    }), 200


def build_platform_stats():
    total_internships = db.select(
        func.count(Internship.id)
    ).scalar_subquery()
    total_submissions = db.select(
        func.count(Submission.id)
    ).scalar_subquery()
    row = db.session.query(
        func.count(User.id),
        func.sum(case((User.role == "student", 1), else_=0)),
        func.sum(case((User.role == "employer", 1), else_=0)),
        func.sum(case((User.role == "mentor", 1), else_=0)),
        total_internships,
        total_submissions,
    ).one()
    return {
        "total_users": row[0] or 0,
        "total_students": row[1] or 0,
        "total_employers": row[2] or 0,
        "total_mentors": row[3] or 0,
        "total_internships": row[4] or 0,
        "total_submissions": row[5] or 0,
    }
