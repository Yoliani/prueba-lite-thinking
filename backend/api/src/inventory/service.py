from sqlalchemy.ext.asyncio import AsyncSession

from api.core.logging import get_logger
from api.src.inventory.models import InventoryItem
from api.src.inventory.repository import InventoryRepository
from api.src.inventory.schemas import InventoryItemCreate, InventoryItemUpdate

logger = get_logger(__name__)


class InventoryService:
    """Service for handling inventory business logic."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = InventoryRepository(session)

    async def create_inventory_item(
        self, inventory_data: InventoryItemCreate
    ) -> InventoryItem:
        """Create a new inventory item."""
        return await self.repository.create(inventory_data)

    async def update_inventory_item(
        self, inventory_id: int, inventory_data: InventoryItemUpdate
    ) -> InventoryItem:
        """Update an inventory item."""
        return await self.repository.update(inventory_id, inventory_data)

    async def delete_inventory_item(self, inventory_id: int) -> None:
        """Delete an inventory item."""
        await self.repository.delete(inventory_id)

    async def get_inventory_item(self, inventory_id: int) -> InventoryItem:
        """Get an inventory item by ID."""
        return await self.repository.get_by_id(inventory_id)

    async def get_inventory_items(
        self, skip: int = 0, limit: int = 100
    ) -> list[InventoryItem]:
        """Get all inventory items with pagination."""
        return await self.repository.get_all(skip, limit)

    async def get_inventory_items_by_product(
        self, product_id: int, skip: int = 0, limit: int = 100
    ) -> list[InventoryItem]:
        """Get inventory items by product ID with pagination."""
        return await self.repository.get_by_product_id(product_id, skip, limit)
