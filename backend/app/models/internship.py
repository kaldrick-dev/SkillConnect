from app.extensions import db
from datetime import datetime


class Internship(db.Model):
    __tablename__ = "internships"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    employer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "employer_id": self.employer_id,
            "created_at": self.created_at.isoformat()
        }