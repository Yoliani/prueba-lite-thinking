from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine

from api.core.config import settings

# Create async engine
engine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)
engine_sync = create_engine(settings.DATABASE_URL_SYNC, echo=False)

# Create async session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False)

# Create declarative base for models
Base = declarative_base()


async def get_session() -> AsyncSession:
    """Dependency for getting async database session.

    Yields:
        AsyncSession: Async database session
    """
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
