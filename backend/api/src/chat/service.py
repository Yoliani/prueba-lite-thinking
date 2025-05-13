from sqlalchemy.ext.asyncio import AsyncSession

from api.core.logging import get_logger
from api.src.chat.repository import ChatRepository
from api.src.chat.schemas import QueryRequest

logger = get_logger(__name__)


class ChatService:
    """Service for handling chat business logic."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = ChatRepository(session)

    def chat(self, query: QueryRequest) -> dict:
        try:
            return self.repository.create(query)
        except Exception as e:
            logger.error(f"Error creating chat: {e}")
            raise Exception(f"Error creating chat: {e}")
