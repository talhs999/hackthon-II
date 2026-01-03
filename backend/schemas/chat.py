"""Pydantic schemas for chat API requests and responses."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, validator


class ChatRequest(BaseModel):
    """Request body for chat endpoint."""

    conversation_id: Optional[str] = None
    message: str

    @validator("message")
    def message_not_empty(cls, v):
        """Ensure message is not empty."""
        if not v or not v.strip():
            raise ValueError("Message cannot be empty")
        return v.strip()

    @validator("message")
    def message_max_length(cls, v):
        """Ensure message is under 1000 characters."""
        if len(v) > 1000:
            raise ValueError("Message must be under 1000 characters")
        return v


class ChatResponse(BaseModel):
    """Response body for chat endpoint."""

    success: bool
    conversation_id: str
    user_message_id: str
    assistant_message_id: str
    response: str
    tool_used: Optional[str] = None
    action_taken: Optional[str] = None
    timestamp: datetime

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class ErrorResponse(BaseModel):
    """Error response body."""

    success: bool = False
    error: str
    details: Optional[str] = None


class ConversationSummary(BaseModel):
    """Summary of a conversation."""

    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
