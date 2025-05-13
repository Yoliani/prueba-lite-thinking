from pydantic import BaseModel, ConfigDict, Field, validator
import re


class CompanyBase(BaseModel):
    """Base company schema."""

    name: str = Field(..., description="Name of the company")
    address: str = Field(..., description="Address of the company")
    phone: str = Field(..., description="Phone number of the company")
    email: str = Field(..., description="Email of the company")


class CompanyCreate(CompanyBase):
    """Company creation schema."""

    nit: str = Field(..., description="NIT (Tax ID) of the company")

    @validator('nit')
    def validate_nit(cls, v):
        if not re.match(r'^\d{9}$', v):
            raise ValueError('NIT must be exactly 9 numbers')
        return v


class CompanyUpdate(CompanyBase):
    """Company update schema."""

    name: str | None = Field(None, description="Name of the company")
    address: str | None = Field(None, description="Address of the company")
    phone: str | None = Field(None, description="Phone number of the company")


class CompanyResponse(CompanyCreate):
    """Company response schema."""

    model_config = ConfigDict(from_attributes=True)
