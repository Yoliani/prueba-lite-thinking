from pydantic import BaseModel, ConfigDict, Field

from api.src.products.schemas import ProductResponse


class InventoryItemBase(BaseModel):
    """Base inventory item schema."""

    quantity: int = Field(...,
                          description="Quantity of the product in inventory")
    product_id: int = Field(..., description="ID of the product")


class InventoryItemCreate(InventoryItemBase):
    """Inventory item creation schema."""
    pass


class InventoryItemUpdate(BaseModel):
    """Inventory item update schema."""

    quantity: int | None = Field(None, description="Quantity of the product")


class InventoryItemResponse(InventoryItemBase):
    """Inventory item response schema."""

    model_config = ConfigDict(from_attributes=True)
    id: int


class InventoryItemDetail(InventoryItemResponse):
    """Detailed inventory item response with product information."""

    product: ProductResponse


class EmailData(BaseModel):
    """Email data schema."""
    email: str
    company_nit: str | None = None
