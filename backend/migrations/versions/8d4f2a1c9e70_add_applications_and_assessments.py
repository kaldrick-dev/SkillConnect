"""add applications and assessments

Revision ID: 8d4f2a1c9e70
Revises: b3b3f1c2fce4
"""

from alembic import op
import sqlalchemy as sa


revision = "8d4f2a1c9e70"
down_revision = "b3b3f1c2fce4"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "internship_applications",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("internship_id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column(
            "applied_at",
            sa.DateTime(),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["internship_id"],
            ["internships.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["student_id"],
            ["students.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "internship_id",
            "student_id",
            name="unique_internship_application",
        ),
    )

    op.create_table(
        "assessments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("internship_id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("mentor_id", sa.BigInteger(), nullable=False),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("feedback", sa.Text(), nullable=True),
        sa.Column("completed", sa.Boolean(), nullable=False),
        sa.Column(
            "assessed_at",
            sa.DateTime(),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["internship_id"],
            ["internships.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["mentor_id"],
            ["MENTOR.mentorId"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["student_id"],
            ["students.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("assessments")
    op.drop_table("internship_applications")
