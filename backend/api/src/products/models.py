from sqlalchemy import Column, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from api.core.database import Base


class Product(Base):
    """Product model."""

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    characteristics = Column(String, nullable=False)

    # Store prices in different currencies as a JSON object
    # Example: {"USD": 10.50, "EUR": 9.80, "COP": 40000}
    prices = Column(JSON, nullable=False)

    # Foreign key to company
    company_nit = Column(
        String, ForeignKey("companies.nit", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    company = relationship("Company", back_populates="products")
    inventory_items = relationship(
        "InventoryItem", back_populates="product", cascade="all, delete-orphan"
    )
