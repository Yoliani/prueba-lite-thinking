import os
import pytest
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from api.src.companies.models import Company
from api.src.products.models import Product
from api.src.inventory.models import InventoryItem
from api.src.inventory.pdf_generator import generate_inventory_pdf


@pytest.mark.asyncio
async def test_generate_inventory_pdf(session: AsyncSession):
    """Test PDF generation with WeasyPrint."""
    # Create test data
    company = Company(
        nit="123456789",
        name="Test Company",
        address="123 Test St",
        phone="123-456-7890"
    )
    session.add(company)
    await session.commit()
    
    product = Product(
        code="P001",
        name="Test Product",
        characteristics="Test characteristics",
        prices={"USD": 10.99, "EUR": 9.99},
        company_nit=company.nit
    )
    session.add(product)
    await session.commit()
    
    inventory_item = InventoryItem(
        quantity=10,
        product_id=product.id
    )
    session.add(inventory_item)
    await session.commit()
    
    # Generate PDF
    pdf_path = await generate_inventory_pdf(session)
    
    # Check if PDF was created
    assert os.path.exists(pdf_path)
    assert os.path.getsize(pdf_path) > 0
    
    # Clean up
    os.unlink(pdf_path)
