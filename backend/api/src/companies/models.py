from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from api.core.database import Base


class Company(Base):
    """Company model."""

    __tablename__ = "companies"

    nit = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=False)

    # Relationships
    products = relationship(
        "Product", back_populates="company", cascade="all, delete-orphan"
    )
