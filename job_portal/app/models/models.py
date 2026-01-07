from sqlalchemy import Column, Integer, String, Enum, Boolean, BigInteger, ForeignKey, Text, DateTime, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class UserRole(enum.Enum):
    JOB_SEEKER = "JOB_SEEKER"
    RECRUITER = "RECRUITER"
    ADMIN = "ADMIN"

class JobType(enum.Enum):
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"
    CONTRACT = "CONTRACT"
    INTERNSHIP = "INTERNSHIP"

class JobStatus(enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    PAUSED = "PAUSED"

class ApplicationStatus(enum.Enum):
    APPLIED = "APPLIED"
    SHORTLISTED = "SHORTLISTED"
    REJECTED = "REJECTED"
    HIRED = "HIRED"

class ProficiencyLevel(enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"

class InterviewMode(enum.Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"

class InterviewResult(enum.Enum):
    PENDING = "PENDING"
    PASS = "PASS"
    FAIL = "FAIL"

class User(Base):
    __tablename__ = "users"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)

    job_seeker = relationship("JobSeeker", back_populates="user", uselist=False)
    recruiter = relationship("Recruiter", back_populates="user", uselist=False)

class JobSeeker(Base):
    __tablename__ = "job_seekers"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), unique=True)
    full_name = Column(String(200))
    phone = Column(String(50))
    experience_years = Column(Integer)
    education = Column(String(200))
    resume_url = Column(Text)

    user = relationship("User", back_populates="job_seeker")
    skills = relationship("JobSeekerSkill", back_populates="job_seeker")
    applications = relationship("Application", back_populates="job_seeker")

class Recruiter(Base):
    __tablename__ = "recruiters"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), unique=True)
    company_name = Column(String(200))
    company_website = Column(String(255))

    user = relationship("User", back_populates="recruiter")
    jobs = relationship("Job", back_populates="recruiter")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    recruiter_id = Column(BigInteger, ForeignKey("recruiters.id"))
    title = Column(String(255), index=True)
    description = Column(Text)
    location = Column(String(150))
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    job_type = Column(Enum(JobType))
    status = Column(Enum(JobStatus), default=JobStatus.OPEN)

    recruiter = relationship("Recruiter", back_populates="jobs")
    skills = relationship("JobSkill", back_populates="job")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    job_id = Column(BigInteger, ForeignKey("jobs.id"))
    job_seeker_id = Column(BigInteger, ForeignKey("job_seekers.id"))
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.APPLIED)

    job = relationship("Job", back_populates="applications")
    job_seeker = relationship("JobSeeker", back_populates="applications")
    interviews = relationship("Interview", back_populates="application")

    __table_args__ = (
        UniqueConstraint("job_id", "job_seeker_id", name="uix_job_seeker_app"),
    )

class Skill(Base):
    __tablename__ = "skills"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)

class JobSeekerSkill(Base):
    __tablename__ = "job_seeker_skills"
    job_seeker_id = Column(BigInteger, ForeignKey("job_seekers.id"), primary_key=True)
    skill_id = Column(BigInteger, ForeignKey("skills.id"), primary_key=True)
    proficiency_level = Column(Enum(ProficiencyLevel))

    job_seeker = relationship("JobSeeker", back_populates="skills")
    skill = relationship("Skill")

class JobSkill(Base):
    __tablename__ = "job_skills"
    job_id = Column(BigInteger, ForeignKey("jobs.id"), primary_key=True)
    skill_id = Column(BigInteger, ForeignKey("skills.id"), primary_key=True)

    job = relationship("Job", back_populates="skills")
    skill = relationship("Skill")

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    application_id = Column(BigInteger, ForeignKey("applications.id"))
    interview_date = Column(DateTime)
    mode = Column(Enum(InterviewMode))
    result = Column(Enum(InterviewResult), default=InterviewResult.PENDING)

    application = relationship("Application", back_populates="interviews")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, index=True)
    action = Column(String(100))
    entity_type = Column(String(50))
    entity_id = Column(BigInteger)
    
    __table_args__ = (
        Index("ix_entity", "entity_type", "entity_id"),
    )
