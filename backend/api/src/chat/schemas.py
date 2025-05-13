from pydantic import BaseModel, Field
from typing import Dict, Any


class QueryRequest(BaseModel):
    query: str = Field(..., description="Query to be sent to the chat")


class ChatResponse(BaseModel):
    status: str = Field(..., description="Status of the response")
    message: str = Field(..., description="Message from the chat")
    data: Dict[str, Any] = Field(
        ..., description="Additional data from the chat"
    )