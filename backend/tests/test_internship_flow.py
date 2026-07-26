import pytest
from flask_jwt_extended import create_access_token

from app import create_app
from app.config import Config
from app.extensions import db
from app.models import Employer, Mentor, Student, User


@pytest.fixture()
def app():
    old_database_url = Config.SQLALCHEMY_DATABASE_URI
    Config.SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

    app = create_app()
    app.config.update(
        TESTING=True,
        JWT_SECRET_KEY="test-secret-with-at-least-32-bytes",
    )

    Config.SQLALCHEMY_DATABASE_URI = old_database_url

    with app.app_context():
        db.create_all()

        student_user = User(
            email="student@test.com",
            role="student",
            password_hash="test",
        )
        employer_user = User(
            email="employer@test.com",
            role="employer",
            password_hash="test",
        )
        mentor_user = User(
            email="mentor@test.com",
            role="mentor",
            password_hash="test",
        )
        db.session.add_all([
            student_user,
            employer_user,
            mentor_user,
        ])
        db.session.flush()

        db.session.add_all([
            Student(user_id=student_user.id),
            Employer(
                user_id=employer_user.id,
                company_name="Test Company",
            ),
            Mentor(
                mentorId=1,
                userId=mentor_user.id,
                expertise="Software",
            ),
        ])
        db.session.commit()

        app.test_tokens = {
            user.role: create_access_token(
                identity=str(user.id),
                additional_claims={"role": user.role},
            )
            for user in [student_user, employer_user, mentor_user]
        }

    return app


@pytest.fixture()
def client(app):
    return app.test_client()


def auth_header(app, role):
    token = app.test_tokens[role]
    return {"Authorization": f"Bearer {token}"}


def test_internship_application_and_completion_flow(app, client):
    response = client.post(
        "/api/internships",
        headers=auth_header(app, "employer"),
        json={
            "title": "Python Developer Intern",
            "description": "Build a Flask API",
            "location": "Kigali",
        },
    )
    assert response.status_code == 201
    internship_id = response.get_json()["internship"]["id"]

    response = client.get(
        "/api/internships"
        "?search=python&location=kigali&is_active=true"
    )
    assert response.status_code == 200
    assert len(response.get_json()) == 1

    first_application = client.post(
        f"/api/internships/{internship_id}/apply",
        headers=auth_header(app, "student"),
    )
    second_application = client.post(
        f"/api/internships/{internship_id}/apply",
        headers=auth_header(app, "student"),
    )

    assert first_application.status_code == 201
    assert second_application.status_code == 200

    first_id = first_application.get_json()["application"]["id"]
    second_id = second_application.get_json()["application"]["id"]
    assert first_id == second_id

    student_id = first_application.get_json()["application"]["student_id"]
    response = client.post(
        f"/api/internships/{internship_id}/assess",
        headers=auth_header(app, "mentor"),
        json={
            "student_id": student_id,
            "score": 86,
            "feedback": "Good work",
        },
    )
    assert response.status_code == 200

    response = client.post(
        f"/api/internships/{internship_id}/certificate",
        headers=auth_header(app, "employer"),
        json={"student_id": student_id},
    )
    assert response.status_code == 201
    first_certificate_id = response.get_json()["certificate"]["id"]

    response = client.post(
        f"/api/internships/{internship_id}/certificate",
        headers=auth_header(app, "employer"),
        json={"student_id": student_id},
    )
    assert response.status_code == 200
    assert response.get_json()["certificate"]["id"] == first_certificate_id
