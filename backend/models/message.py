"""Message model for storing chat messages."""

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from uuid import uuid4


class Message(SQLModel, table=True):
    """Stores all messages in conversations.

    Tracks both user and assistant messages with tool execution details.
    """

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id", index=True)
    user_id: str = Field(index=True)
    role: str = Field(index=True)  # "user" or "assistant"
    content: str  # The message text
    tool_used: Optional[str] = None  # Name of MCP tool if executed
    action_taken: Optional[str] = None  # Description of what tool did
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    def __repr__(self):
        return f"<Message(id={self.id}, role={self.role}, conversation_id={self.conversation_id})>"
