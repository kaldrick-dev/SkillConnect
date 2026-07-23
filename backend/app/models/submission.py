from app.extensions import db


class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(
        db.Integer,
        db.ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
    )
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
    )
    content_url = db.Column(db.String(1000), nullable=True)
    submitted_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    score = db.Column(db.Float, nullable=True)
    graded_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    feedback = db.Column(db.Text, nullable=True)
    graded_at = db.Column(db.DateTime, nullable=True)
    passed = db.Column(db.Boolean, nullable=True)
    rubric = db.Column(db.Text, nullable=True)
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

    task = db.relationship("Task", back_populates="submissions")
    student = db.relationship("Student", back_populates="submissions")
    grader = db.relationship("User", foreign_keys=[graded_by_id])

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "task_id": self.task_id,
            "student_id": self.student_id,
            "content_url": self.content_url,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "score": self.score,
            "graded_by_id": self.graded_by_id,
            "feedback": self.feedback,
            "graded_at": self.graded_at.isoformat() if self.graded_at else None,
            "passed": self.passed,
            "rubric": self.rubric,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Submission {self.id} task_id={self.task_id} student_id={self.student_id}>"
