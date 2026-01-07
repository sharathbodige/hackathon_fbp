import asyncio
from app.db.session import AsyncSessionLocal
from app.models.models import User, UserRole, JobSeeker, Recruiter, Job, JobType, JobStatus, Skill, JobSeekerSkill, JobSkill, ProficiencyLevel, Application, ApplicationStatus, Interview, InterviewMode, InterviewResult, ActivityLog
from app.core.security import get_password_hash
from datetime import datetime

async def seed_data():
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        
        # Helper to get user by email or create
        async def get_or_create_user(email, password, role):
            res = await db.execute(select(User).where(User.email == email))
            user = res.scalar_one_or_none()
            if not user:
                user = User(email=email, password_hash=get_password_hash(password), role=role)
                db.add(user)
                await db.flush()
                print(f"Created user: {email}")
            return user

        # Core Users
        u_alice = await get_or_create_user("alice@gmail.com", "hash123", UserRole.JOB_SEEKER)
        u_bob = await get_or_create_user("bob@gmail.com", "hash456", UserRole.JOB_SEEKER)
        u_recruiter = await get_or_create_user("recruiter@techcorp.com", "hash789", UserRole.RECRUITER)
        u_admin = await get_or_create_user("admin@portal.com", "adminhash", UserRole.ADMIN)

        # Helper for JobSeeker
        async def get_or_create_js(user_id, full_name, phone, exp, edu, resume):
            res = await db.execute(select(JobSeeker).where(JobSeeker.user_id == user_id))
            js = res.scalar_one_or_none()
            if not js:
                js = JobSeeker(user_id=user_id, full_name=full_name, phone=phone, experience_years=exp, education=edu, resume_url=resume)
                db.add(js)
                await db.flush()
                print(f"Created JobSeeker: {full_name}")
            return js

        js_alice = await get_or_create_js(u_alice.id, "Alice Johnson", "9876543210", 2, "B.Tech CSE", "https://resume.link/alice")
        js_bob = await get_or_create_js(u_bob.id, "Bob Smith", "9876501234", 4, "MCA", "https://resume.link/bob")

        # Helper for Recruiter
        async def get_or_create_recruiter(user_id, company, website):
            res = await db.execute(select(Recruiter).where(Recruiter.user_id == user_id))
            rec = res.scalar_one_or_none()
            if not rec:
                rec = Recruiter(user_id=user_id, company_name=company, company_website=website)
                db.add(rec)
                await db.flush()
                print(f"Created Recruiter: {company}")
            return rec

        rec_techcorp = await get_or_create_recruiter(u_recruiter.id, "TechCorp Pvt Ltd", "https://techcorp.com")

        # Helper for Skill
        async def get_or_create_skill(name):
            res = await db.execute(select(Skill).where(Skill.name == name))
            skill = res.scalar_one_or_none()
            if not skill:
                skill = Skill(name=name)
                db.add(skill)
                await db.flush()
                print(f"Created Skill: {name}")
            return skill

        s_python = await get_or_create_skill("Python")
        s_sql = await get_or_create_skill("SQL")
        s_powerbi = await get_or_create_skill("Power BI")
        s_fastapi = await get_or_create_skill("FastAPI")
        s_ml = await get_or_create_skill("Machine Learning")

        # Helper for Job
        async def get_or_create_job(recruiter_id, title, desc, loc, smin, smax, type):
            res = await db.execute(select(Job).where(Job.recruiter_id == recruiter_id, Job.title == title))
            job = res.scalar_one_or_none()
            if not job:
                job = Job(recruiter_id=recruiter_id, title=title, description=desc, location=loc, salary_min=smin, salary_max=smax, job_type=type)
                db.add(job)
                await db.flush()
                print(f"Created Job: {title}")
            return job

        j_python = await get_or_create_job(rec_techcorp.id, "Python Developer", "Backend Python Developer", "Hyderabad", 600000, 900000, JobType.FULL_TIME)
        j_data = await get_or_create_job(rec_techcorp.id, "Data Analyst", "SQL and Power BI expert", "Bangalore", 500000, 800000, JobType.FULL_TIME)

        # Job Seeker Skills
        async def add_js_skill(js_id, s_id, level):
            res = await db.execute(select(JobSeekerSkill).where(JobSeekerSkill.job_seeker_id == js_id, JobSeekerSkill.skill_id == s_id))
            if not res.scalar_one_or_none():
                db.add(JobSeekerSkill(job_seeker_id=js_id, skill_id=s_id, proficiency_level=level))

        await add_js_skill(js_alice.id, s_python.id, ProficiencyLevel.ADVANCED)
        await add_js_skill(js_alice.id, s_sql.id, ProficiencyLevel.INTERMEDIATE)
        await add_js_skill(js_bob.id, s_python.id, ProficiencyLevel.INTERMEDIATE)
        await add_js_skill(js_bob.id, s_powerbi.id, ProficiencyLevel.ADVANCED)

        # Job Skills
        async def add_job_skill(j_id, s_id):
            res = await db.execute(select(JobSkill).where(JobSkill.job_id == j_id, JobSkill.skill_id == s_id))
            if not res.scalar_one_or_none():
                db.add(JobSkill(job_id=j_id, skill_id=s_id))

        await add_job_skill(j_python.id, s_python.id)
        await add_job_skill(j_python.id, s_fastapi.id)
        await add_job_skill(j_data.id, s_sql.id)
        await add_job_skill(j_data.id, s_powerbi.id)

        # Applications
        async def add_app(job_id, js_id, status):
            res = await db.execute(select(Application).where(Application.job_id == job_id, Application.job_seeker_id == js_id))
            app = res.scalar_one_or_none()
            if not app:
                app = Application(job_id=job_id, job_seeker_id=js_id, status=status)
                db.add(app)
                await db.flush()
                print(f"Created Application for JS {js_id} to Job {job_id}")
            return app

        app1 = await add_app(j_python.id, js_alice.id, ApplicationStatus.APPLIED)
        app2 = await add_app(j_data.id, js_bob.id, ApplicationStatus.APPLIED)

        # Commit everything
        await db.commit()
        print("Seed data process completed.")

async def main():
    try:
        await seed_data()
    finally:
        from app.db.session import engine
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
