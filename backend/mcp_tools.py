"""MCP-compatible task management tools for the AI agent.

These tools allow the AI agent to execute task operations
with full user isolation and proper error handling.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlmodel import Session, select

try:
    from database import engine
    from models.task import Task
except ImportError:
    from .database import engine
    from .models.task import Task


class TaskTools:
    """Task management tools for MCP."""

    def __init__(self):
        """Initialize task tools."""
        self.engine = engine

    def add_task(
        self, user_id: str, title: str, description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new task.

        Args:
            user_id: User ID (from JWT)
            title: Task title (1-200 chars)
            description: Optional description (max 1000 chars)

        Returns:
            Created task or error dict
        """
        try:
            if not title or not title.strip():
                return {"success": False, "error": "Title cannot be empty"}

            if len(title) > 200:
                return {"success": False, "error": "Title must be under 200 characters"}

            if description and len(description) > 1000:
                return {
                    "success": False,
                    "error": "Description must be under 1000 characters",
                }

            with Session(self.engine) as session:
                task = Task(
                    user_id=user_id,
                    title=title.strip(),
                    description=description.strip() if description else None,
                    completed=False,
                    created_at=datetime.utcnow(),
                )
                session.add(task)
                session.commit()
                session.refresh(task)

                return {
                    "success": True,
                    "task": {
                        "id": task.id,
                        "user_id": task.user_id,
                        "title": task.title,
                        "description": task.description,
                        "completed": task.completed,
                        "created_at": task.created_at.isoformat(),
                    },
                }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def list_tasks(
        self, user_id: str, status_filter: str = "all"
    ) -> Dict[str, Any]:
        """List user's tasks with optional filtering.

        Args:
            user_id: User ID (from JWT)
            status_filter: "all", "pending", or "completed"

        Returns:
            List of tasks or error dict
        """
        try:
            with Session(self.engine) as session:
                query = select(Task).where(Task.user_id == user_id)

                if status_filter == "pending":
                    query = query.where(Task.completed == False)
                elif status_filter == "completed":
                    query = query.where(Task.completed == True)

                tasks = session.exec(query.order_by(Task.created_at.desc())).all()

                return {
                    "success": True,
                    "tasks": [
                        {
                            "id": task.id,
                            "user_id": task.user_id,
                            "title": task.title,
                            "description": task.description,
                            "completed": task.completed,
                            "created_at": task.created_at.isoformat(),
                            "completed_at": task.completed_at.isoformat()
                            if task.completed_at
                            else None,
                        }
                        for task in tasks
                    ],
                    "summary": {
                        "total": len(tasks),
                        "pending": sum(1 for t in tasks if not t.completed),
                        "completed": sum(1 for t in tasks if t.completed),
                    },
                }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def complete_task(
        self, user_id: str, task_id: int, completed: bool = True
    ) -> Dict[str, Any]:
        """Toggle task completion status.

        Args:
            user_id: User ID (from JWT)
            task_id: Task ID to toggle
            completed: True to mark complete, False to reopen

        Returns:
            Updated task or error dict
        """
        try:
            with Session(self.engine) as session:
                task = session.exec(
                    select(Task).where(
                        (Task.id == task_id) & (Task.user_id == user_id)
                    )
                ).first()

                if not task:
                    return {"success": False, "error": "Task not found"}

                task.completed = completed
                if completed:
                    task.completed_at = datetime.utcnow()
                else:
                    task.completed_at = None

                task.updated_at = datetime.utcnow()
                session.add(task)
                session.commit()
                session.refresh(task)

                return {
                    "success": True,
                    "task": {
                        "id": task.id,
                        "user_id": task.user_id,
                        "title": task.title,
                        "completed": task.completed,
                        "completed_at": task.completed_at.isoformat()
                        if task.completed_at
                        else None,
                    },
                }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def update_task(
        self,
        user_id: str,
        task_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Update task title and/or description.

        Args:
            user_id: User ID (from JWT)
            task_id: Task ID to update
            title: New title (optional)
            description: New description (optional)

        Returns:
            Updated task or error dict
        """
        try:
            if not title and description is None:
                return {
                    "success": False,
                    "error": "Must provide title or description",
                }

            with Session(self.engine) as session:
                task = session.exec(
                    select(Task).where(
                        (Task.id == task_id) & (Task.user_id == user_id)
                    )
                ).first()

                if not task:
                    return {"success": False, "error": "Task not found"}

                if title:
                    if len(title) > 200:
                        return {
                            "success": False,
                            "error": "Title must be under 200 characters",
                        }
                    task.title = title.strip()

                if description is not None:
                    if len(description) > 1000:
                        return {
                            "success": False,
                            "error": "Description must be under 1000 characters",
                        }
                    task.description = description.strip() if description else None

                task.updated_at = datetime.utcnow()
                session.add(task)
                session.commit()
                session.refresh(task)

                return {
                    "success": True,
                    "task": {
                        "id": task.id,
                        "user_id": task.user_id,
                        "title": task.title,
                        "description": task.description,
                        "updated_at": task.updated_at.isoformat(),
                    },
                }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def delete_task(self, user_id: str, task_id: int) -> Dict[str, Any]:
        """Delete a task.

        Args:
            user_id: User ID (from JWT)
            task_id: Task ID to delete

        Returns:
            Success message or error dict
        """
        try:
            with Session(self.engine) as session:
                task = session.exec(
                    select(Task).where(
                        (Task.id == task_id) & (Task.user_id == user_id)
                    )
                ).first()

                if not task:
                    return {"success": False, "error": "Task not found"}

                task_title = task.title
                session.delete(task)
                session.commit()

                return {
                    "success": True,
                    "message": f"Task '{task_title}' has been deleted",
                }

        except Exception as e:
            return {"success": False, "error": str(e)}


# Create global instance
task_tools = TaskTools()


def get_tool_function(tool_name: str):
    """Get a tool function by name.

    Args:
        tool_name: Name of the tool

    Returns:
        Tool function or None
    """
    tools = {
        "add_task": task_tools.add_task,
        "list_tasks": task_tools.list_tasks,
        "complete_task": task_tools.complete_task,
        "update_task": task_tools.update_task,
        "delete_task": task_tools.delete_task,
    }
    return tools.get(tool_name)


def get_mcp_tool_schemas() -> List[Dict[str, Any]]:
    """Return OpenAI function calling schemas for all tools.

    Returns list of tool definitions compatible with OpenAI Agents SDK.
    """
    return [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user. Use this when user wants to remember something, create a todo, or add a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "The task title (1-200 characters)"
                        },
                        "description": {
                            "type": "string",
                            "description": "Optional task description (max 1000 chars)"
                        }
                    },
                    "required": ["title"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "list_tasks",
                "description": "Get user's tasks with optional status filter. Use when user asks what tasks they have, what to do, or wants to see their todos.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status_filter": {
                            "type": "string",
                            "enum": ["all", "pending", "completed"],
                            "description": "Filter tasks by status",
                            "default": "all"
                        }
                    },
                    "required": []
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "complete_task",
                "description": "Toggle task completion status. Use when user says they finished something or wants to mark a task done.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "integer",
                            "description": "The ID of the task to complete"
                        },
                        "completed": {
                            "type": "boolean",
                            "description": "True to mark complete, False to reopen",
                            "default": True
                        }
                    },
                    "required": ["task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "update_task",
                "description": "Update task title and/or description. Use when user wants to change or edit a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "integer",
                            "description": "The ID of the task to update"
                        },
                        "title": {
                            "type": "string",
                            "description": "New task title (optional, 1-200 chars)"
                        },
                        "description": {
                            "type": "string",
                            "description": "New task description (optional, max 1000 chars)"
                        }
                    },
                    "required": ["task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "delete_task",
                "description": "Delete a task permanently. Use when user wants to remove or delete a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "integer",
                            "description": "The ID of the task to delete"
                        }
                    },
                    "required": ["task_id"]
                }
            }
        }
    ]


def execute_tool(tool_name: str, user_id: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool with given arguments.

    This wraps TaskTools methods and handles user_id injection.

    Args:
        tool_name: Name of the tool to execute
        user_id: User ID for authorization
        arguments: Arguments to pass to the tool

    Returns:
        Result from the tool execution
    """
    tool_func = get_tool_function(tool_name)
    if not tool_func:
        return {"success": False, "error": f"Tool {tool_name} not found"}

    try:
        # Inject user_id as first argument
        result = tool_func(user_id, **arguments)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}
