from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.exceptions import AlreadyExistsException, NotFoundException
from api.core.logging import get_logger
from api.src.products.models import Product
from api.src.products.schemas import ProductCreate, ProductUpdate

logger = get_logger(__name__)


class ProductRepository:
    """Repository for handling product database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, product_data: ProductCreate) -> Product:
        """Create a new product.

        Args:
            product_data: Product creation data

        Returns:
            Product: Created product

        Raises:
            AlreadyExistsException: If product with same code already exists
        """
        # Check if product exists
        existing_product = await self.get_by_code(product_data.code)
        if existing_product:
            raise AlreadyExistsException("Product with this code already exists")

        # Create product
        product = Product(
            code=product_data.code,
            name=product_data.name,
            characteristics=product_data.characteristics,
            prices=product_data.prices,
            company_nit=product_data.company_nit,
        )
        self.session.add(product)
        await self.session.commit()
        await self.session.refresh(product)

        logger.info(f"Created product: {product.name} with code: {product.code}")
        return product

    async def update(self, product_id: int, product_data: ProductUpdate) -> Product:
        """Update a product.

        Args:
            product_id: Product ID
            product_data: Product update data

        Returns:
            Product: Updated product

        Raises:
            NotFoundException: If product not found
        """
        product = await self.get_by_id(product_id)

        # Update product fields
        update_data = product_data.model_dump(exclude_unset=True)
        if update_data:
            stmt = (
                update(Product)
                .where(Product.id == product_id)
                .values(**update_data)
                .returning(Product)
            )
            result = await self.session.execute(stmt)
            await self.session.commit()
            updated_product = result.scalar_one()
            logger.info(f"Updated product: {updated_product.name}")
            return updated_product
        return product

    async def delete(self, product_id: int) -> None:
        """Delete a product.

        Args:
            product_id: Product ID

        Raises:
            NotFoundException: If product not found
        """
        product = await self.get_by_id(product_id)
        await self.session.delete(product)
        await self.session.commit()
        logger.info(f"Deleted product with ID: {product_id}")

    async def get_by_id(self, product_id: int) -> Product:
        """Get product by ID.

        Args:
            product_id: Product ID

        Returns:
            Product: Found product

        Raises:
            NotFoundException: If product not found
        """
        query = select(Product).where(Product.id == product_id)
        result = await self.session.execute(query)
        product = result.scalar_one_or_none()

        if not product:
            raise NotFoundException(f"Product with ID {product_id} not found")

        return product

    async def get_by_code(self, code: str) -> Product | None:
        """Get product by code.

        Args:
            code: Product code

        Returns:
            Optional[Product]: Found product or None if not found
        """
        query = select(Product).where(Product.code == code)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Product]:
        """Get all products with pagination.

        Args:
            skip: Number of products to skip
            limit: Maximum number of products to return

        Returns:
            List[Product]: List of products
        """
        query = select(Product).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_company_nit(
        self, company_nit: str, skip: int = 0, limit: int = 100
    ) -> list[Product]:
        """Get products by company NIT with pagination.

        Args:
            company_nit: Company NIT
            skip: Number of products to skip
            limit: Maximum number of products to return

        Returns:
            List[Product]: List of products for the company
        """
        query = (
            select(Product)
            .where(Product.company_nit == company_nit)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
