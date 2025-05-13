from typing import Dict

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    """Base product schema."""

    code: str = Field(..., description="Unique code of the product")
    name: str = Field(..., description="Name of the product")
    characteristics: str = Field(..., description="Characteristics of the product")
    prices: Dict[str, float] = Field(
        ..., description="Prices in different currencies (e.g. USD, EUR, COP)"
    )


class ProductCreate(ProductBase):
    """Product creation schema."""

    company_nit: str = Field(..., description="NIT of the company")


class ProductUpdate(BaseModel):
    """Product update schema."""

    name: str | None = Field(None, description="Name of the product")
    characteristics: str | None = Field(
        None, description="Characteristics of the product"
    )
    prices: Dict[str, float] | None = Field(
        None, description="Prices in different currencies"
    )


class ProductResponse(ProductBase):
    """Product response schema."""

    model_config = ConfigDict(from_attributes=True)
    id: int
    company_nit: str
