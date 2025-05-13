from pydantic import BaseModel, ConfigDict, EmailStr, Field

from api.src.users.models import UserRole


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr


class UserCreate(UserBase):
    """User creation schema."""

    password: str
    role: UserRole = Field(default=UserRole.EXTERNAL, description="User role")


class UserResponse(UserBase):
    """User response schema."""

    model_config = ConfigDict(from_attributes=True)
    id: int
    role: UserRole


class Token(BaseModel):
    """Token schema."""

    access_token: str
    token_type: str = "bearer"
    user_role: UserRole


class LoginData(BaseModel):
    """Login data schema."""

    email: EmailStr
    password: str
