from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.exceptions import AlreadyExistsException, NotFoundException
from api.core.logging import get_logger
from api.src.companies.models import Company
from api.src.companies.schemas import CompanyCreate, CompanyUpdate

logger = get_logger(__name__)


class CompanyRepository:
    """Repository for handling company database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, company_data: CompanyCreate) -> Company:
        """Create a new company.

        Args:
            company_data: Company creation data

        Returns:
            Company: Created company

        Raises:
            AlreadyExistsException: If company with same NIT already exists
        """
        # Check if company exists
        existing_company = await self.get_by_nit(company_data.nit)
        print("existing_company", existing_company)
        if existing_company:
            raise AlreadyExistsException(
                "Company with thisp NIT already exists")

        # Create company
        company = Company(
            nit=company_data.nit,
            name=company_data.name,
            address=company_data.address,
            phone=company_data.phone,
            email=company_data.email
        )
        self.session.add(company)
        await self.session.commit()
        await self.session.refresh(company)

        logger.info(f"Created company: {company.name} with NIT: {company.nit}")
        return company

    async def update(self, nit: str, company_data: CompanyUpdate) -> Company:
        """Update a company.

        Args:
            nit: Company NIT
            company_data: Company update data

        Returns:
            Company: Updated company

        Raises:
            NotFoundException: If company not found
        """
        company = await self.get_by_nit(nit)

        if not company:
            raise NotFoundException(
                f"Company with NIT {nit} not found"
            )

        # Update company fields
        update_data = company_data.model_dump(exclude_unset=True)
        if update_data:
            stmt = (
                update(Company)
                .where(Company.nit == nit)
                .values(**update_data)
                .returning(Company)
            )
            result = await self.session.execute(stmt)
            await self.session.commit()
            updated_company = result.scalar_one()
            logger.info(f"Updated company: {updated_company.name}")
            return updated_company
        return company

    async def delete(self, nit: str) -> None:
        """Delete a company.

        Args:
            nit: Company NIT

        Raises:
            NotFoundException: If company not found
        """
        company = await self.get_by_nit(nit)
        if not company:
            raise NotFoundException(
                f"Company with NIT {nit} not found"
            )
        await self.session.delete(company)
        await self.session.commit()
        logger.info(f"Deleted company with NIT: {nit}")

    async def get_by_nit(self, nit: str) -> Optional[Company]:
        """Get company by NIT.

        Args:
            nit: Company NIT

        Returns:
            Company: Found company

        Raises:
            NotFoundException: If company not found
        """
        query = select(Company).where(Company.nit == nit)
        result = await self.session.execute(query)
        company = result.scalar_one_or_none()

        if not company:
            return None

        return company

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Company]:
        """Get all companies with pagination.

        Args:
            skip: Number of companies to skip
            limit: Maximum number of companies to return

        Returns:
            List[Company]: List of companies
        """
        query = select(Company).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()
