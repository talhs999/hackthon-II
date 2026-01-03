from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime
from pydantic import validator
import re

if TYPE_CHECKING:
    from tasks import Task  # Avoid circular import


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str  # Store user_id in database
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Add relationships if needed
    # user: Optional["User"] = Relationship(back_populates="tasks")


class TaskCreate(TaskBase):
    # Don't include user_id - it comes from URL path
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskRead(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime]
    completed_at: Optional[datetime]