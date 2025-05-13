from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_session
from api.core.logging import get_logger
from api.core.security import require_admin
from api.src.chat.schemas import QueryRequest, ChatResponse
from api.src.chat.service import ChatService
from api.src.users.models import User

logger = get_logger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def chat(
        query: QueryRequest,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(require_admin),

) -> ChatResponse:
    """Chat with the chatbot."""
    try:
        logger.debug(f"Chatting with query: {query}")
        return ChatService(session).chat(query)
    except Exception as e:
        logger.error(f"Error chatting with query: {query}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
