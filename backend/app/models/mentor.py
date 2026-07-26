"""SQLAlchemy entities for SkillConnect."""

from app.extensions import db


class Mentor(db.Model):
    __tablename__ = "MENTOR"

    mentorId = db.Column(
        db.BigInteger().with_variant(db.Integer, "sqlite"),
        primary_key=True,
        autoincrement=True,
        nullable=False,
    )
    userId = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        unique=True,
    )
    expertise = db.Column(db.String(255), nullable=False)

    user = db.relationship("User")

    def to_dict(self) -> dict:
        return {
            "id": self.mentorId,
            "user_id": self.userId,
            "email": self.user.email if self.user else None,
            "expertise": self.expertise,
        }
