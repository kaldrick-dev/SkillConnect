"""create skillconnect tables

Revision ID: 001_create_skillconnect_tables
Revises: 
Create Date: 2026-07-06 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_create_skillconnect_tables'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'USER',
        sa.Column('userId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('fullName', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('userId'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )

    op.create_table(
        'STUDENT',
        sa.Column('studentId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('userId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('institution', sa.String(length=255), nullable=False),
        sa.Column('skills', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('studentId'),
        sa.UniqueConstraint('userId', name='uq_student_user'),
        sa.ForeignKeyConstraint(['userId'], ['USER.userId'], ondelete='CASCADE', onupdate='CASCADE'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )
    op.create_index('idx_student_user', 'STUDENT', ['userId'], unique=True)

    op.create_table(
        'MENTOR',
        sa.Column('mentorId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('userId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('expertise', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('mentorId'),
        sa.UniqueConstraint('userId', name='uq_mentor_user'),
        sa.ForeignKeyConstraint(['userId'], ['USER.userId'], ondelete='CASCADE', onupdate='CASCADE'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )
    op.create_index('idx_mentor_user', 'MENTOR', ['userId'], unique=True)

    op.create_table(
        'EMPLOYER',
        sa.Column('employerId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('userId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('companyName', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('employerId'),
        sa.UniqueConstraint('userId', name='uq_employer_user'),
        sa.ForeignKeyConstraint(['userId'], ['USER.userId'], ondelete='CASCADE', onupdate='CASCADE'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )
    op.create_index('idx_employer_user', 'EMPLOYER', ['userId'], unique=True)

    op.create_table(
        'INTERNSHIP',
        sa.Column('internshipId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('studentId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('mentorId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('employerId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('duration', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('internshipId'),
        sa.ForeignKeyConstraint(['studentId'], ['STUDENT.studentId'], ondelete='CASCADE', onupdate='CASCADE'),
        sa.ForeignKeyConstraint(['mentorId'], ['MENTOR.mentorId'], ondelete='CASCADE', onupdate='CASCADE'),
        sa.ForeignKeyConstraint(['employerId'], ['EMPLOYER.employerId'], ondelete='CASCADE', onupdate='CASCADE'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )
    op.create_index('idx_internship_student', 'INTERNSHIP', ['studentId'], unique=False)
    op.create_index('idx_internship_mentor', 'INTERNSHIP', ['mentorId'], unique=False)
    op.create_index('idx_internship_employer', 'INTERNSHIP', ['employerId'], unique=False)

    op.create_table(
        'TASK',
        sa.Column('taskId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('internshipId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('deadline', sa.Date(), nullable=False),
        sa.PrimaryKeyConstraint('taskId'),
        sa.ForeignKeyConstraint(['internshipId'], ['INTERNSHIP.internshipId'], ondelete='CASCADE', onupdate='CASCADE'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )
    op.create_index('idx_task_internship', 'TASK', ['internshipId'], unique=False)

    op.create_table(
        'SUBMISSION',
        sa.Column('submissionId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('taskId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('studentId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('fileUrl', sa.String(length=1000), nullable=False),
        sa.Column('submittedDate', sa.Date(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('submissionId'),
        sa.ForeignKeyConstraint(['taskId'], ['TASK.taskId'], ondelete='CASCADE', onupdate='CASCADE'),
        sa.ForeignKeyConstraint(['studentId'], ['STUDENT.studentId'], ondelete='CASCADE', onupdate='CASCADE'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )
    op.create_index('idx_submission_task', 'SUBMISSION', ['taskId'], unique=False)
    op.create_index('idx_submission_student', 'SUBMISSION', ['studentId'], unique=False)

    op.create_table(
        'CERTIFICATE',
        sa.Column('certificateId', sa.BigInteger(), autoincrement=True, nullable=False, mysql_unsigned=True),
        sa.Column('internshipId', sa.BigInteger(), nullable=False, mysql_unsigned=True),
        sa.Column('issueDate', sa.Date(), nullable=False),
        sa.PrimaryKeyConstraint('certificateId'),
        sa.UniqueConstraint('internshipId', name='uq_certificate_internship'),
        sa.ForeignKeyConstraint(['internshipId'], ['INTERNSHIP.internshipId'], ondelete='CASCADE', onupdate='CASCADE'),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )


def downgrade():
    op.drop_table('CERTIFICATE')
    op.drop_table('SUBMISSION')
    op.drop_table('TASK')
    op.drop_table('INTERNSHIP')
    op.drop_table('EMPLOYER')
    op.drop_table('MENTOR')
    op.drop_table('STUDENT')
    op.drop_table('USER')
