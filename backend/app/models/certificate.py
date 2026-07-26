from app.extensions import db


class Certificate(db.Model):
    __tablename__ = "certificates"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
    )
    internship_id = db.Column(
        db.Integer,
        db.ForeignKey("internships.id", ondelete="CASCADE"),
        nullable=False,
    )
    issued_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
    )
    certificate_data = db.Column(db.Text, nullable=True)
    grade_summary = db.Column(db.Text, nullable=True)
    issuer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
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

    student = db.relationship("Student", back_populates="certificates")
    internship = db.relationship("Internship", back_populates="certificates")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "student_id": self.student_id,
            "internship_id": self.internship_id,
            "issued_at": self.issued_at.isoformat() if self.issued_at else None,
            "certificate_data": self.certificate_data,
            "grade_summary": self.grade_summary,
            "issuer_id": self.issuer_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Certificate {self.id} student_id={self.student_id} internship_id={self.internship_id}>"
