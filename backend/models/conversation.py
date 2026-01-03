"""Conversation model for storing chat sessions."""

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from uuid import uuid4


class Conversation(SQLModel, table=True):
    """Stores individual conversations per user.

    Tracks chat sessions with full message history.
    """

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id={self.user_id})>"
