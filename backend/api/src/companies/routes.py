from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_session
from api.core.logging import get_logger
from api.core.security import get_current_user, require_admin
from api.src.companies.schemas import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
)
from api.src.companies.service import CompanyService
from api.src.users.models import User

logger = get_logger(__name__)

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_data: CompanyCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> CompanyResponse:
    """Create a new company. Admin only."""
    logger.debug(f"Creating company with NIT: {company_data.nit}")
    return await CompanyService(session).create_company(company_data)


@router.get("", response_model=list[CompanyResponse])
async def get_companies(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> list[CompanyResponse]:
    """Get all companies."""
    logger.debug(f"Getting companies with skip={skip}, limit={limit}")
    return await CompanyService(session).get_companies(skip, limit)


@router.get("/{nit}", response_model=CompanyResponse)
async def get_company(
    nit: str,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(get_current_user),
) -> CompanyResponse:
    """Get a company by NIT."""
    logger.debug(f"Getting company with NIT: {nit}")
    return await CompanyService(session).get_company(nit)


@router.put("/{nit}", response_model=CompanyResponse)
async def update_company(
    nit: str,
    company_data: CompanyUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> CompanyResponse:
    """Update a company. Admin only."""
    logger.debug(f"Updating company with NIT: {nit}")
    return await CompanyService(session).update_company(nit, company_data)


@router.delete("/{nit}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(
    nit: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> None:
    """Delete a company. Admin only."""
    logger.debug(f"Deleting company with NIT: {nit}")
    await CompanyService(session).delete_company(nit)
