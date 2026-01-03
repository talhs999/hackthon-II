"""
Recurring Tasks Service
Handles creation, management, and auto-generation of recurring tasks
"""

from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Session, select
from models.task import Task, RecurrenceEnum
import logging

logger = logging.getLogger(__name__)


class RecurringTaskService:
    """Service for managing recurring tasks"""

    RECURRENCE_PATTERNS = {
        RecurrenceEnum.DAILY: lambda dt: dt + timedelta(days=1),
        RecurrenceEnum.WEEKLY: lambda dt: dt + timedelta(weeks=1),
        RecurrenceEnum.MONTHLY: lambda dt: dt + timedelta(days=30),
        RecurrenceEnum.YEARLY: lambda dt: dt + timedelta(days=365),
    }

    @staticmethod
    def create_recurring_task(
        session: Session,
        user_id: str,
        title: str,
        description: str,
        priority: str,
        tags: Optional[str],
        due_date: datetime,
        reminder_at: Optional[datetime],
        recurrence_type: RecurrenceEnum,
        recurrence_end_date: Optional[datetime]
    ) -> Task:
        """Create a recurring task"""
        task = Task(
            user_id=user_id,
            title=title,
            description=description,
            priority=priority,
            tags=tags,
            due_date=due_date,
            reminder_at=reminder_at,
            is_recurring=True,
            recurrence_type=recurrence_type,
            recurrence_end_date=recurrence_end_date,
            next_occurrence=RecurringTaskService._calculate_next_occurrence(
                due_date, recurrence_type
            )
        )
        session.add(task)
        session.commit()
        logger.info(f"✅ Recurring task created: {title} ({recurrence_type.value})")
        return task

    @staticmethod
    def _calculate_next_occurrence(
        current_date: datetime,
        recurrence_type: RecurrenceEnum
    ) -> datetime:
        """Calculate next occurrence date"""
        calculator = RecurringTaskService.RECURRENCE_PATTERNS.get(recurrence_type)
        if calculator:
            return calculator(current_date)
        return current_date

    @staticmethod
    def generate_next_instance(
        session: Session,
        parent_task: Task
    ) -> Optional[Task]:
        """Generate next instance of recurring task"""
        if not parent_task.is_recurring or not parent_task.recurrence_type:
            return None

        # Check if we've reached the recurrence end date
        if (parent_task.recurrence_end_date and 
            parent_task.next_occurrence >= parent_task.recurrence_end_date):
            logger.info(f"⏹️ Recurring task ended: {parent_task.title}")
            return None

        # Calculate next occurrence
        next_due = RecurringTaskService._calculate_next_occurrence(
            parent_task.next_occurrence or parent_task.due_date,
            parent_task.recurrence_type
        )

        # Create new instance
        new_task = Task(
            user_id=parent_task.user_id,
            title=parent_task.title,
            description=parent_task.description,
            priority=parent_task.priority,
            tags=parent_task.tags,
            due_date=next_due,
            reminder_at=None,  # Will be set by reminder service
            is_recurring=True,
            recurrence_type=parent_task.recurrence_type,
            recurrence_end_date=parent_task.recurrence_end_date,
            parent_task_id=parent_task.id,
            next_occurrence=RecurringTaskService._calculate_next_occurrence(
                next_due, parent_task.recurrence_type
            )
        )

        session.add(new_task)
        
        # Update parent task's next occurrence
        parent_task.next_occurrence = next_due
        session.add(parent_task)
        session.commit()

        logger.info(f"✅ Generated next instance of: {parent_task.title}")
        return new_task

    @staticmethod
    def get_recurring_tasks(
        session: Session,
        user_id: str
    ) -> list:
        """Get all recurring tasks for user"""
        statement = select(Task).where(
            Task.user_id == user_id,
            Task.is_recurring == True
        )
        return session.exec(statement).all()

    @staticmethod
    def get_tasks_due_today(
        session: Session,
        user_id: str
    ) -> list:
        """Get tasks due today"""
        today = datetime.utcnow().date()
        statement = select(Task).where(
            Task.user_id == user_id,
            Task.completed == False
        )
        tasks = session.exec(statement).all()
        
        due_today = [
            t for t in tasks 
            if t.due_date and t.due_date.date() == today
        ]
        return due_today

    @staticmethod
    def get_overdue_tasks(
        session: Session,
        user_id: str
    ) -> list:
        """Get overdue tasks"""
        now = datetime.utcnow()
        statement = select(Task).where(
            Task.user_id == user_id,
            Task.completed == False,
            Task.due_date != None
        )
        tasks = session.exec(statement).all()
        
        overdue = [t for t in tasks if t.due_date < now]
        return overdue
