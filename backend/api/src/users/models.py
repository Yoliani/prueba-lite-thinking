from sqlalchemy import Column, Integer, String, Enum
import enum

from api.core.database import Base


class UserRole(str, enum.Enum):
    """User role enum."""
    ADMIN = "admin"
    EXTERNAL = "external"


class User(Base):
    """User model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.EXTERNAL, nullable=False)
