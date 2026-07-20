from app.extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    internship_id = db.Column(
        db.Integer,
        db.ForeignKey("internships.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    order = db.Column(db.Integer, nullable=False, default=0)
    max_score = db.Column(db.Float, nullable=False, default=100.0)
    due_date = db.Column(db.DateTime, nullable=True)
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

    internship = db.relationship("Internship", back_populates="tasks")
    submissions = db.relationship(
        "Submission",
        back_populates="task",
        cascade="all, delete-orphan",
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "internship_id": self.internship_id,
            "title": self.title,
            "description": self.description,
            "order": self.order,
            "max_score": self.max_score,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Task {self.id} title={self.title!r} internship_id={self.internship_id}>"
