from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from api.core.database import Base


class InventoryItem(Base):
    """Inventory item model."""

    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, default=0, nullable=False)

    # Foreign keys
    product_id = Column(
        Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    product = relationship("Product", back_populates="inventory_items")
