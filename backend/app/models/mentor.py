"""SQLAlchemy entities for SkillConnect."""

from app.extensions import db


class Mentor(db.Model):
    __tablename__ = "MENTOR"

    mentorId = db.Column(db.BigInteger, primary_key=True, autoincrement=True, nullable=False)
    userId = db.Column(
        db.BigInteger,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        unique=True,
    )
    expertise = db.Column(db.String(255), nullable=False)
