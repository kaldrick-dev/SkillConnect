from app.extensions import db


class InternshipApplication(db.Model):
    __tablename__ = "internship_applications"
    __table_args__ = (
        db.UniqueConstraint(
            "internship_id",
            "student_id",
            name="unique_internship_application",
        ),
    )

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
    status = db.Column(db.String(50), nullable=False, default="applied")
    applied_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "internship_id": self.internship_id,
            "student_id": self.student_id,
            "status": self.status,
            "applied_at": self.applied_at.isoformat() if self.applied_at else None,
        }
