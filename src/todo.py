#!/usr/bin/env python3
"""
Todo Console Application
A simple command-line todo application with in-memory storage.
"""
import sys
import json
from datetime import datetime
from typing import List, Optional


class Task:
    """Represents a single task in the todo list."""
    
    def __init__(self, id: int, title: str, description: str = "", completed: bool = False):
        self.id = id
        self.title = title
        self.description = description
        self.completed = completed
        self.created_at = datetime.now()
        self.updated_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None
        
        if completed:
            self.completed_at = datetime.now()
    
    def to_dict(self):
        """Convert task to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create a Task instance from a dictionary."""
        task = cls(
            id=data['id'],
            title=data['title'],
            description=data.get('description', ''),
            completed=data.get('completed', False)
        )
        task.created_at = datetime.fromisoformat(data['created_at'])
        if data.get('updated_at'):
            task.updated_at = datetime.fromisoformat(data['updated_at'])
        if data.get('completed_at'):
            task.completed_at = datetime.fromisoformat(data['completed_at'])
        return task


class TodoApp:
    """Main Todo application class."""
    
    def __init__(self):
        self.tasks: List[Task] = []
        self.next_id = 1
        self.load_data()
    
    def load_data(self):
        """Load tasks from a file if it exists."""
        try:
            with open('tasks.json', 'r') as f:
                data = json.load(f)
                self.tasks = [Task.from_dict(task_data) for task_data in data['tasks']]
                self.next_id = data.get('next_id', 1)
        except FileNotFoundError:
            # Start with empty task list if no file exists
            self.tasks = []
            self.next_id = 1
    
    def save_data(self):
        """Save tasks to a file."""
        data = {
            'tasks': [task.to_dict() for task in self.tasks],
            'next_id': self.next_id
        }
        with open('tasks.json', 'w') as f:
            json.dump(data, f, indent=2)
    
    def add_task(self, title: str, description: str = ""):
        """Add a new task to the list."""
        if not title.strip():
            print("Error: Title is required")
            return False
        
        task = Task(self.next_id, title.strip(), description.strip())
        self.tasks.append(task)
        print(f"Task added successfully with ID: {task.id}")
        self.next_id += 1
        self.save_data()
        return True
    
    def list_tasks(self):
        """Display all tasks in a formatted table."""
        if not self.tasks:
            print("No tasks found.")
            return
        
        print("TODO LIST:")
        print("ID | STATUS | TITLE | DESCRIPTION | CREATED")
        print("---|--------|-------|-------------|--------")
        
        for task in self.tasks:
            status = "[x]" if task.completed else "[ ]"
            description = task.description if task.description else ""
            created_str = task.created_at.strftime("%Y-%m-%d %H:%M")
            print(f"{task.id}  | {status}    | {task.title} | {description} | {created_str}")
    
    def update_task(self, task_id: int, title: str = None, description: str = None):
        """Update an existing task."""
        task = self.find_task_by_id(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found")
            return False
        
        if title is not None:
            task.title = title.strip() if title.strip() else task.title
        if description is not None:
            task.description = description.strip()
        
        task.updated_at = datetime.now()
        print(f"Task {task_id} updated successfully")
        self.save_data()
        return True
    
    def delete_task(self, task_id: int):
        """Delete a task by ID."""
        task = self.find_task_by_id(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found")
            return False
        
        confirmation = input(f"Are you sure you want to delete task {task_id}? (y/N) ")
        if confirmation.lower() != 'y':
            print("Deletion cancelled")
            return False
        
        self.tasks.remove(task)
        print(f"Task {task_id} deleted successfully")
        self.save_data()
        return True
    
    def complete_task(self, task_id: int):
        """Mark a task as complete/incomplete."""
        task = self.find_task_by_id(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found")
            return False
        
        task.completed = not task.completed
        task.updated_at = datetime.now()
        
        if task.completed:
            task.completed_at = datetime.now()
            print(f"Task {task_id} marked as complete")
        else:
            task.completed_at = None
            print(f"Task {task_id} marked as incomplete")
        
        self.save_data()
        return True
    
    def find_task_by_id(self, task_id: int) -> Optional[Task]:
        """Find a task by its ID."""
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None


def print_usage():
    """Print usage instructions."""
    print("Usage:")
    print("  python todo.py add \"task title\" [\"task description\"]")
    print("  python todo.py list")
    print("  python todo.py update <task_id> \"new title\" [\"new description\"]")
    print("  python todo.py delete <task_id>")
    print("  python todo.py complete <task_id>")


def main():
    """Main function to handle command-line arguments."""
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(2)
    
    command = sys.argv[1].lower()
    app = TodoApp()
    
    try:
        if command == 'add':
            if len(sys.argv) < 3:
                print("Error: Title is required")
                print_usage()
                sys.exit(2)
            
            title = sys.argv[2]
            description = sys.argv[3] if len(sys.argv) > 3 else ""
            app.add_task(title, description)
        
        elif command == 'list':
            app.list_tasks()
        
        elif command == 'update':
            if len(sys.argv) < 4:
                print("Error: Task ID and new title are required")
                print_usage()
                sys.exit(2)
            
            try:
                task_id = int(sys.argv[2])
            except ValueError:
                print("Error: Task ID must be a number")
                sys.exit(2)
            
            title = sys.argv[3]
            description = sys.argv[4] if len(sys.argv) > 4 else None
            app.update_task(task_id, title, description)
        
        elif command == 'delete':
            if len(sys.argv) < 3:
                print("Error: Task ID is required")
                print_usage()
                sys.exit(2)
            
            try:
                task_id = int(sys.argv[2])
                app.delete_task(task_id)
            except ValueError:
                print("Error: Task ID must be a number")
                sys.exit(2)
        
        elif command == 'complete':
            if len(sys.argv) < 3:
                print("Error: Task ID is required")
                print_usage()
                sys.exit(2)
            
            try:
                task_id = int(sys.argv[2])
                app.complete_task(task_id)
            except ValueError:
                print("Error: Task ID must be a number")
                sys.exit(2)
        
        else:
            print(f"Error: Unknown command '{command}'")
            print_usage()
            sys.exit(2)
    
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()