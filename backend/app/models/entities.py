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

    internships = db.relationship("Internship", backref="mentor", cascade="all, delete-orphan")


class Internship(db.Model):
    __tablename__ = "INTERNSHIP"

    internshipId = db.Column(db.BigInteger, primary_key=True, autoincrement=True, nullable=False)
    studentId = db.Column(
        db.BigInteger,
        db.ForeignKey("students.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    mentorId = db.Column(
        db.BigInteger,
        db.ForeignKey("MENTOR.mentorId", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    employerId = db.Column(
        db.BigInteger,
        db.ForeignKey("employers.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text(), nullable=False)
    duration = db.Column(db.String(100), nullable=False)

    tasks = db.relationship("Task", backref="internship", cascade="all, delete-orphan")
    certificate = db.relationship("Certificate", backref="internship", uselist=False, cascade="all, delete-orphan")


class Task(db.Model):
    __tablename__ = "TASK"

    taskId = db.Column(db.BigInteger, primary_key=True, autoincrement=True, nullable=False)
    internshipId = db.Column(
        db.BigInteger,
        db.ForeignKey("INTERNSHIP.internshipId", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    title = db.Column(db.String(255), nullable=False)
    deadline = db.Column(db.Date, nullable=False)

    submissions = db.relationship("Submission", backref="task", cascade="all, delete-orphan")


class Submission(db.Model):
    __tablename__ = "SUBMISSION"

    submissionId = db.Column(db.BigInteger, primary_key=True, autoincrement=True, nullable=False)
    taskId = db.Column(
        db.BigInteger,
        db.ForeignKey("TASK.taskId", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    studentId = db.Column(
        db.BigInteger,
        db.ForeignKey("students.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    fileUrl = db.Column(db.String(1000), nullable=False)
    submittedDate = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), nullable=False)


class Certificate(db.Model):
    __tablename__ = "CERTIFICATE"

    certificateId = db.Column(db.BigInteger, primary_key=True, autoincrement=True, nullable=False)
    internshipId = db.Column(
        db.BigInteger,
        db.ForeignKey("INTERNSHIP.internshipId", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        unique=True,
    )
    issueDate = db.Column(db.Date, nullable=False)
