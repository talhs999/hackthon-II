from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING, List
from datetime import datetime
from enum import Enum
from pydantic import validator
import re

if TYPE_CHECKING:
    from tasks import Task  # Avoid circular import


class PriorityEnum(str, Enum):
    """Task priority levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class RecurrenceEnum(str, Enum):
    """Task recurrence patterns"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    CUSTOM = "custom"


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: PriorityEnum = Field(default=PriorityEnum.MEDIUM)
    tags: Optional[str] = Field(default=None, max_length=500)  # comma-separated
    due_date: Optional[datetime] = Field(default=None)
    reminder_at: Optional[datetime] = Field(default=None)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str  # Store user_id in database
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Advanced features for Phase 5
    is_recurring: bool = Field(default=False)
    recurrence_type: Optional[RecurrenceEnum] = Field(default=None)
    recurrence_end_date: Optional[datetime] = Field(default=None)
    parent_task_id: Optional[int] = Field(default=None)  # For recurring task instances
    next_occurrence: Optional[datetime] = Field(default=None)


class TaskCreate(TaskBase):
    # Don't include user_id - it comes from URL path
    is_recurring: Optional[bool] = Field(default=False)
    recurrence_type: Optional[RecurrenceEnum] = None
    recurrence_end_date: Optional[datetime] = None


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: Optional[PriorityEnum] = None
    tags: Optional[str] = None
    due_date: Optional[datetime] = None
    reminder_at: Optional[datetime] = None
    completed: Optional[bool] = None
    is_recurring: Optional[bool] = None
    recurrence_type: Optional[RecurrenceEnum] = None
    recurrence_end_date: Optional[datetime] = None


class TaskRead(TaskBase):
    id: int
    completed: bool
    is_recurring: bool
    recurrence_type: Optional[RecurrenceEnum]
    created_at: datetime
    updated_at: Optional[datetime]
    completed_at: Optional[datetime]
    next_occurrence: Optional[datetime]


# Event schemas for Kafka
class TaskEventBase(SQLModel):
    event_type: str  # "created", "updated", "completed", "deleted"
    task_id: int
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TaskEvent(TaskEventBase):
    task_data: Optional[dict] = None


class ReminderEvent(SQLModel):
    task_id: int
    task_title: str
    user_id: str
    due_at: datetime
    remind_at: datetime
    timestamp: datetime = Field(default_factory=datetime.utcnow)