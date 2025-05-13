from sqlalchemy.ext.asyncio import AsyncSession

from api.core.logging import get_logger
from api.src.companies.models import Company
from api.src.companies.repository import CompanyRepository
from api.src.companies.schemas import CompanyCreate, CompanyUpdate

logger = get_logger(__name__)


class CompanyService:
    """Service for handling company business logic."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = CompanyRepository(session)

    async def create_company(self, company_data: CompanyCreate) -> Company:
        """Create a new company."""
        print("company_data", company_data)
        return await self.repository.create(company_data)

    async def update_company(self, nit: str, company_data: CompanyUpdate) -> Company:
        """Update a company."""
        return await self.repository.update(nit, company_data)

    async def delete_company(self, nit: str) -> None:
        """Delete a company."""
        await self.repository.delete(nit)

    async def get_company(self, nit: str) -> Company:
        """Get a company by NIT."""
        return await self.repository.get_by_nit(nit)

    async def get_companies(self, skip: int = 0, limit: int = 100) -> list[Company]:
        """Get all companies with pagination."""
        return await self.repository.get_all(skip, limit)
