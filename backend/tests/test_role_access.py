import pytest
from flask_jwt_extended import create_access_token

from app import create_app


@pytest.fixture()
def app():
    app = create_app()
    app.config.update(
        TESTING=True,
        JWT_SECRET_KEY="test-secret-with-at-least-32-bytes",
    )
    return app


@pytest.fixture()
def client(app):
    return app.test_client()


def authorization_header(app, role):
    with app.app_context():
        token = create_access_token(
            identity="1",
            additional_claims={"role": role},
        )
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.parametrize(
    ("method", "path", "role"),
    [
        ("PUT", "/api/students/1", "mentor"),
        ("PUT", "/api/employers/1", "student"),
        ("POST", "/api/internships/", "student"),
        ("PUT", "/api/internships/1", "student"),
        ("POST", "/api/internships/1/apply", "employer"),
        ("POST", "/api/tasks/internship/1", "student"),
        ("POST", "/api/submissions/task/1", "employer"),
        ("PUT", "/api/submissions/1/review", "student"),
        ("POST", "/api/certificates/internship/1", "student"),
        ("GET", "/api/certificates/student/1", "employer"),
        ("GET", "/api/admin/users", "student"),
        ("DELETE", "/api/admin/users/1", "employer"),
        ("GET", "/api/admin/stats", "mentor"),
    ],
)
def test_protected_routes_reject_wrong_role(app, client, method, path, role):
    response = client.open(
        path,
        method=method,
        headers=authorization_header(app, role),
        json={},
    )

    assert response.status_code == 403
    assert response.get_json()["error"] == "Access denied"


def test_protected_route_rejects_missing_token(client):
    response = client.get("/api/admin/users")

    assert response.status_code == 401
