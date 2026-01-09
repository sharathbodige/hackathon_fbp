import pytest
from httpx import AsyncClient
from app.models.models import UserRole

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post(
        "/api/v1/users/",
        json={
            "email": "test@example.com",
            "password": "password123",
            "role": "JOB_SEEKER",
            "is_active": True
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "JOB_SEEKER"
    assert "id" in data

@pytest.mark.asyncio
async def test_read_users(client: AsyncClient):
    response = await client.get("/api/v1/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
