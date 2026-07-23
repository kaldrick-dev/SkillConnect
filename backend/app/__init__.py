from flask import Flask

from app.config import Config
from app.extensions import db, migrate, jwt, cors
from app.models import *  # noqa: F401,F403


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    register_blueprints(app)

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    return app


def register_blueprints(app):
    from app.routes.auth import auth_bp
    from app.routes.students import students_bp
    from app.routes.mentors import mentors_bp
    from app.routes.employers import employers_bp
    from app.routes.internships import internships_bp
    from app.routes.tasks import tasks_bp
    from app.routes.submissions import submissions_bp
    from app.routes.certificates import certificates_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(mentors_bp, url_prefix="/api/mentors")
    app.register_blueprint(employers_bp, url_prefix="/api/employers")
    app.register_blueprint(internships_bp, url_prefix="/api/internships")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    app.register_blueprint(submissions_bp, url_prefix="/api/submissions")
    app.register_blueprint(certificates_bp, url_prefix="/api/certificates")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
