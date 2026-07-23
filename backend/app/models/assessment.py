from app.extensions import db


class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    internship_id = db.Column(
        db.Integer,
        db.ForeignKey("internships.id", ondelete="CASCADE"),
        nullable=False,
    )
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
    )
    mentor_id = db.Column(
        db.BigInteger,
        db.ForeignKey("MENTOR.mentorId", ondelete="CASCADE"),
        nullable=False,
    )
    score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, nullable=False, default=True)
    assessed_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "internship_id": self.internship_id,
            "student_id": self.student_id,
            "mentor_id": self.mentor_id,
            "score": self.score,
            "feedback": self.feedback,
            "completed": self.completed,
            "assessed_at": self.assessed_at.isoformat() if self.assessed_at else None,
        }
