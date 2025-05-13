#!/usr/bin/env python
"""
Script to create an initial admin user.
Usage: python -m scripts.create_admin --email admin@example.com --password securepassword
"""
from api.src.users.service import UserService
from api.src.users.schemas import UserCreate
from api.src.users.models import UserRole
from api.core.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
import argparse
import asyncio
import sys
from pathlib import Path

# Add the parent directory to the path so we can import from the api package
sys.path.append(str(Path(__file__).parent.parent))


async def create_admin_user(email: str, password: str) -> None:
    """Create an admin user with the given email and password."""
    # Create user data
    user_data = UserCreate(
        email=email,
        password=password,
        role=UserRole.ADMIN
    )

    # Get database session
    session = None
    try:
        async for s in get_session():
            session = s
            break

        if not session:
            print("Failed to get database session")
            return

        # Create user
        user_service = UserService(session)
        try:
            user = await user_service.create_user(user_data)
            print(f"Admin user created successfully: {user.email}")
        except Exception as e:
            print(f"Error creating admin user: {str(e)}")
    finally:
        if session:
            await session.close()


def main():
    """Parse arguments and create admin user."""
    parser = argparse.ArgumentParser(description="Create an admin user")
    parser.add_argument("--email", required=True, help="Admin email")
    parser.add_argument("--password", required=True, help="Admin password")

    args = parser.parse_args()

    # Run the async function
    asyncio.run(create_admin_user(args.email, args.password))


if __name__ == "__main__":
    main()
