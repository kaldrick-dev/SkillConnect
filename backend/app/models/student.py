from app.extensions import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    first_name = db.Column(db.String(120), nullable=True)
    last_name = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    skills = db.Column(db.Text, nullable=True)
    university = db.Column(db.String(255), nullable=True)
    graduation_year = db.Column(db.Integer, nullable=True)
    resume_url = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
        onupdate=db.func.now(),
    )

    user = db.relationship("User", back_populates="student")
    submissions = db.relationship(
        "Submission",
        back_populates="student",
        cascade="all, delete-orphan",
    )
    certificates = db.relationship(
        "Certificate",
        back_populates="student",
        cascade="all, delete-orphan",
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "bio": self.bio,
            "skills": self.skills,
            "university": self.university,
            "graduation_year": self.graduation_year,
            "resume_url": self.resume_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Student {self.id} user_id={self.user_id}>"
