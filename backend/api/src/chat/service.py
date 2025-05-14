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
            # Add validation to ensure the response is in Spanish
            # The repository will handle preventing access to alembic_version
            response = self.repository.create(query)

            # Validate that the response is in Spanish
            # This is a second layer of validation in case the repository doesn't enforce it
            if not self._is_spanish_response(response):
                logger.warning(
                    "Response was not in Spanish, forcing Spanish response")
                # Force a Spanish response by adding a note to the repository
                query.query = f"{query.query} (Responde siempre en español)"
                response = self.repository.create(query)

            return response
        except Exception as e:
            logger.error(f"Error creating chat: {e}")
            raise Exception(f"Error creating chat: {e}")

    def _is_spanish_response(self, response: dict) -> bool:
        """Check if the response is in Spanish.

        This is a simple heuristic check that looks for common Spanish words.
        A more robust solution would use a language detection library.
        """
        if not response or "message" not in response.get("data", {}):
            return False

        message = response["data"]["message"].lower()
        spanish_indicators = ["el", "la", "los", "las", "en", "es", "son",
                              "está", "están", "para", "por", "con", "y",
                              "que", "de", "no", "sí", "hay"]

        # Check if at least 2 Spanish indicators are present
        count = sum(
            1 for word in spanish_indicators if f" {word} " in f" {message} ")
        return count >= 2
