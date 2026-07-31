from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models import User


def admin_header(app, user_id):
    with app.app_context():
        token = create_access_token(
            identity=str(user_id),
            additional_claims={"role": "admin"},
        )
    return {"Authorization": f"Bearer {token}"}


def test_admin_can_reactivate_user(app, client):
    with app.app_context():
        admin = User(email="admin@example.com", role="admin", is_active=True)
        admin.set_password("Password123!")
        inactive_user = User(
            email="inactive@example.com",
            role="student",
            is_active=False,
        )
        inactive_user.set_password("Password123!")
        db.session.add_all([admin, inactive_user])
        db.session.commit()
        admin_id = admin.id
        inactive_user_id = inactive_user.id

    response = client.patch(
        f"/api/admin/users/{inactive_user_id}/reactivate",
        headers=admin_header(app, admin_id),
    )

    assert response.status_code == 200
    assert response.get_json()["user"]["is_active"] is True
    with app.app_context():
        assert db.session.get(User, inactive_user_id).is_active is True
