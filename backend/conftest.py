import pytest
from app import create_app
from app.config import Config
from app.extensions import db

@pytest.fixture
def app():
    old_database_url = Config.SQLALCHEMY_DATABASE_URI
    Config.SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    app = create_app()
    app.config.update({
        "TESTING": True,
        "JWT_SECRET_KEY": "test-secret-key-with-at-least-32-bytes"
    })
    Config.SQLALCHEMY_DATABASE_URI = old_database_url

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()
