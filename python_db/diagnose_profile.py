import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.models import User, JobSeeker, Recruiter

async def check_data():
    async with AsyncSessionLocal() as db:
        # List all users
        users_res = await db.execute(select(User))
        users = users_res.scalars().all()
        print(f"Total Users found: {len(users)}")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Role: {u.role}")

        # Check existing JobSeeker profiles
        js_res = await db.execute(select(JobSeeker))
        js_list = js_res.scalars().all()
        print(f"\nTotal JobSeeker profiles found: {len(js_list)}")
        for js in js_list:
            print(f"ID: {js.id}, User ID: {js.user_id}, Name: {js.full_name}")

        # Check existing Recruiter profiles
        rec_res = await db.execute(select(Recruiter))
        rec_list = rec_res.scalars().all()
        print(f"\nTotal Recruiter profiles found: {len(rec_list)}")
        for rec in rec_list:
            print(f"ID: {rec.id}, User ID: {rec.user_id}, Company: {rec.company_name}")

        # Check Jobs
        from app.models.models import Job, Skill, Application
        job_res = await db.execute(select(Job))
        job_list = job_res.scalars().all()
        print(f"\nTotal Jobs found: {len(job_list)}")
        for j in job_list:
            print(f"ID: {j.id}, Title: {j.title}, Recruiter ID: {j.recruiter_id}")

        # Check Skills
        skill_res = await db.execute(select(Skill))
        skill_list = skill_res.scalars().all()
        print(f"\nTotal Skills found: {len(skill_list)}")
        for s in skill_list:
            print(f"ID: {s.id}, Name: {s.name}")

        # Check Applications
        app_res = await db.execute(select(Application))
        app_list = app_res.scalars().all()
        print(f"\nTotal Applications found: {len(app_list)}")
        for a in app_list:
            print(f"ID: {a.id}, Job ID: {a.job_id}, JobSeeker ID: {a.job_seeker_id}, Status: {a.status}")

async def main():
    try:
        await check_data()
    finally:
        from app.db.session import engine
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
