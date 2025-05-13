from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_session
from api.core.logging import get_logger
from api.core.security import get_current_user, require_admin
from api.src.products.schemas import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from api.src.products.service import ProductService
from api.src.users.models import User

logger = get_logger(__name__)

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> ProductResponse:
    """Create a new product. Admin only."""
    logger.debug(f"Creating product with code: {product_data.code}")
    return await ProductService(session).create_product(product_data)


@router.get("", response_model=list[ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> list[ProductResponse]:
    """Get all products."""
    logger.debug(f"Getting products with skip={skip}, limit={limit}")
    return await ProductService(session).get_products(skip, limit)


@router.get("/company/{company_nit}", response_model=list[ProductResponse])
async def get_products_by_company(
    company_nit: str,
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> list[ProductResponse]:
    """Get products by company NIT."""
    logger.debug(f"Getting products for company NIT: {company_nit}")
    return await ProductService(session).get_products_by_company(
        company_nit, skip, limit
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> ProductResponse:
    """Get a product by ID."""
    logger.debug(f"Getting product with ID: {product_id}")
    return await ProductService(session).get_product(product_id)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> ProductResponse:
    """Update a product. Admin only."""
    logger.debug(f"Updating product with ID: {product_id}")
    return await ProductService(session).update_product(product_id, product_data)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> None:
    """Delete a product. Admin only."""
    logger.debug(f"Deleting product with ID: {product_id}")
    await ProductService(session).delete_product(product_id)
