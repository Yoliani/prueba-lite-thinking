from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.exceptions import NotFoundException
from api.core.logging import get_logger
from api.src.inventory.models import InventoryItem
from api.src.inventory.schemas import InventoryItemCreate, InventoryItemUpdate

logger = get_logger(__name__)


class InventoryRepository:
    """Repository for handling inventory database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, inventory_data: InventoryItemCreate) -> InventoryItem:
        """Create a new inventory item.

        Args:
            inventory_data: Inventory item creation data

        Returns:
            InventoryItem: Created inventory item
        """
        # Create inventory item
        inventory_item = InventoryItem(
            quantity=inventory_data.quantity,
            product_id=inventory_data.product_id,
        )
        self.session.add(inventory_item)
        await self.session.commit()
        await self.session.refresh(inventory_item)

        logger.info(
            f"Created inventory item for product ID: {inventory_item.product_id}"
        )
        return inventory_item

    async def update(
        self, inventory_id: int, inventory_data: InventoryItemUpdate
    ) -> InventoryItem:
        """Update an inventory item.

        Args:
            inventory_id: Inventory item ID
            inventory_data: Inventory item update data

        Returns:
            InventoryItem: Updated inventory item

        Raises:
            NotFoundException: If inventory item not found
        """
        inventory_item = await self.get_by_id(inventory_id)

        # Update inventory item fields
        update_data = inventory_data.model_dump(exclude_unset=True)
        if update_data:
            stmt = (
                update(InventoryItem)
                .where(InventoryItem.id == inventory_id)
                .values(**update_data)
                .returning(InventoryItem)
            )
            result = await self.session.execute(stmt)
            await self.session.commit()
            updated_item = result.scalar_one()
            logger.info(f"Updated inventory item with ID: {inventory_id}")
            return updated_item
        return inventory_item

    async def delete(self, inventory_id: int) -> None:
        """Delete an inventory item.

        Args:
            inventory_id: Inventory item ID

        Raises:
            NotFoundException: If inventory item not found
        """
        inventory_item = await self.get_by_id(inventory_id)
        await self.session.delete(inventory_item)
        await self.session.commit()
        logger.info(f"Deleted inventory item with ID: {inventory_id}")

    async def get_by_id(self, inventory_id: int) -> InventoryItem:
        """Get inventory item by ID.

        Args:
            inventory_id: Inventory item ID

        Returns:
            InventoryItem: Found inventory item

        Raises:
            NotFoundException: If inventory item not found
        """
        query = select(InventoryItem).where(InventoryItem.id == inventory_id)
        result = await self.session.execute(query)
        inventory_item = result.scalar_one_or_none()

        if not inventory_item:
            raise NotFoundException(
                f"Inventory item with ID {inventory_id} not found")

        return inventory_item

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[InventoryItem]:
        """Get all inventory items with pagination.

        Args:
            skip: Number of inventory items to skip
            limit: Maximum number of inventory items to return

        Returns:
            List[InventoryItem]: List of inventory items
        """
        query = select(InventoryItem).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_product_id(
        self, product_id: int, skip: int = 0, limit: int = 100
    ) -> list[InventoryItem]:
        """Get inventory items by product ID with pagination.

        Args:
            product_id: Product ID
            skip: Number of inventory items to skip
            limit: Maximum number of inventory items to return

        Returns:
            List[InventoryItem]: List of inventory items for the product
        """
        query = (
            select(InventoryItem)
            .where(InventoryItem.product_id == product_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
