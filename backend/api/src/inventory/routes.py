from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_session
from api.core.logging import get_logger
from api.core.security import get_current_user, require_admin
from api.src.inventory.schemas import (
    EmailData,
    InventoryItemCreate,
    InventoryItemDetail,
    InventoryItemResponse,
    InventoryItemUpdate,
)
from api.src.inventory.service import InventoryService
from api.src.users.models import User
from api.src.inventory.pdf_generator import generate_inventory_pdf, send_pdf_by_email

logger = get_logger(__name__)

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.post(
    "", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED
)
async def create_inventory_item(
    inventory_data: InventoryItemCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> InventoryItemResponse:
    """Create a new inventory item. Admin only."""
    logger.debug(
        f"Creating inventory item for product ID: {inventory_data.product_id}")
    return await InventoryService(session).create_inventory_item(inventory_data)


@router.get("", response_model=list[InventoryItemResponse])
async def get_inventory_items(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> list[InventoryItemResponse]:
    """Get all inventory items."""
    logger.debug(f"Getting inventory items with skip={skip}, limit={limit}")
    return await InventoryService(session).get_inventory_items(skip, limit)


@router.get("/product/{product_id}", response_model=list[InventoryItemResponse])
async def get_inventory_items_by_product(
    product_id: int,
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> list[InventoryItemResponse]:
    """Get inventory items by product ID."""
    logger.debug(f"Getting inventory items for product ID: {product_id}")
    return await InventoryService(session).get_inventory_items_by_product(
        product_id, skip, limit
    )


@router.get("/{inventory_id}", response_model=InventoryItemDetail)
async def get_inventory_item(
    inventory_id: int,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> InventoryItemDetail:
    """Get an inventory item by ID."""
    logger.debug(f"Getting inventory item with ID: {inventory_id}")
    return await InventoryService(session).get_inventory_item(inventory_id)


@router.put("/{inventory_id}", response_model=InventoryItemResponse)
async def update_inventory_item(
    inventory_id: int,
    inventory_data: InventoryItemUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> InventoryItemResponse:
    """Update an inventory item. Admin only."""
    logger.debug(f"Updating inventory item with ID: {inventory_id}")
    return await InventoryService(session).update_inventory_item(
        inventory_id, inventory_data
    )


@router.delete("/{inventory_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inventory_item(
    inventory_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> None:
    """Delete an inventory item. Admin only."""
    logger.debug(f"Deleting inventory item with ID: {inventory_id}")
    await InventoryService(session).delete_inventory_item(inventory_id)


@router.get("/report/download", response_class=FileResponse)
async def download_inventory_report(
    company_nit: str = Query(None, description="Filter by company NIT"),
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> FileResponse:
    """Generate and download inventory report as PDF."""
    logger.debug("Generating inventory report PDF")
    pdf_path = await generate_inventory_pdf(session, company_nit)
    return FileResponse(
        path=pdf_path,
        filename="inventory_report.pdf",
        media_type="application/pdf",
    )


@router.post("/report/email", status_code=status.HTTP_202_ACCEPTED)
async def email_inventory_report(
    email_data: EmailData,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> dict:
    """Generate inventory report and send it by email."""
    logger.debug(f"Sending inventory report to email: {email_data.email}")
    background_tasks.add_task(
        send_pdf_by_email, session, email_data.email, email_data.company_nit
    )
    return {"message": "Inventory report will be sent to your email shortly"}
