from sqlalchemy.ext.asyncio import AsyncSession

from api.core.logging import get_logger
from api.src.products.models import Product
from api.src.products.repository import ProductRepository
from api.src.products.schemas import ProductCreate, ProductUpdate

logger = get_logger(__name__)


class ProductService:
    """Service for handling product business logic."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = ProductRepository(session)

    async def create_product(self, product_data: ProductCreate) -> Product:
        """Create a new product."""
        return await self.repository.create(product_data)

    async def update_product(
        self, product_id: int, product_data: ProductUpdate
    ) -> Product:
        """Update a product."""
        return await self.repository.update(product_id, product_data)

    async def delete_product(self, product_id: int) -> None:
        """Delete a product."""
        await self.repository.delete(product_id)

    async def get_product(self, product_id: int) -> Product:
        """Get a product by ID."""
        return await self.repository.get_by_id(product_id)

    async def get_products(self, skip: int = 0, limit: int = 100) -> list[Product]:
        """Get all products with pagination."""
        return await self.repository.get_all(skip, limit)

    async def get_products_by_company(
        self, company_nit: str, skip: int = 0, limit: int = 100
    ) -> list[Product]:
        """Get products by company NIT with pagination."""
        return await self.repository.get_by_company_nit(company_nit, skip, limit)
