from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

try:
    from auth import get_current_user_id
    from database import get_session
    from models.task import Task, TaskCreate, TaskUpdate, TaskRead
except ImportError:
    from ..auth import get_current_user_id
    from ..database import get_session
    from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead

router = APIRouter()

@router.get("/{user_id}/tasks", response_model=List[TaskRead])
def get_tasks(
    user_id: str,
    status_filter: str = Query("all", description="Filter by status: all, pending, completed"),
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Demo mode: allow any user_id from URL
    # In production, verify: if user_id != current_user_id: raise error
    
    # Build query based on status filter
    query = select(Task).where(Task.user_id == user_id)
    
    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)
    
    tasks = session.exec(query).all()
    return tasks


@router.post("/{user_id}/tasks", response_model=TaskRead)
def create_task(
    user_id: str,
    task: TaskCreate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # In demo mode, allow any user_id
    # In production, you would check: if user_id != current_user_id: raise error
    # For now, use the URL user_id as the source of truth

    # Create new task with user_id
    db_task = Task(
        title=task.title,
        description=task.description,
        user_id=user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def get_task(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Demo mode: allow any user_id from URL
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Demo mode: allow any user_id from URL
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update task fields
    for field, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.delete("/{user_id}/tasks/{task_id}")
def delete_task(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Demo mode: allow any user_id from URL
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    session.delete(db_task)
    session.commit()
    return {"message": "Task deleted successfully"}


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_task_completion(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Demo mode: allow any user_id from URL
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Toggle completion status
    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.utcnow()
    
    if db_task.completed:
        db_task.completed_at = datetime.utcnow()
    else:
        db_task.completed_at = None
    
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task