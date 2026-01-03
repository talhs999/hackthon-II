# MCP Server: Task Management Tools

## Overview
The MCP (Model Context Protocol) server provides stateless tools for the OpenAI agent to execute task operations. Each tool validates the user context and interacts with the database.

## Architecture

```
OpenAI Agent SDK
        ↓
MCP Client (in FastAPI)
        ↓
MCP Server (separate process)
        ↓
Database (Neon PostgreSQL)
```

## Tools

### 1. add_task

**Purpose:** Create a new task for the user

**Schema:**
```json
{
  "name": "add_task",
  "description": "Create a new task for the user",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "User ID from JWT token"
      },
      "title": {
        "type": "string",
        "description": "Task title (required, 1-200 chars)",
        "minLength": 1,
        "maxLength": 200
      },
      "description": {
        "type": "string",
        "description": "Task description (optional, max 1000 chars)",
        "maxLength": 1000
      }
    },
    "required": ["user_id", "title"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": 123,
    "user_id": "user-123",
    "title": "Buy groceries",
    "description": null,
    "completed": false,
    "created_at": "2025-01-01T12:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Title cannot be empty"
}
```

---

### 2. list_tasks

**Purpose:** Retrieve user's tasks with optional filtering

**Schema:**
```json
{
  "name": "list_tasks",
  "description": "Get user's tasks with optional status filter",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "User ID from JWT token"
      },
      "status_filter": {
        "type": "string",
        "enum": ["all", "pending", "completed"],
        "description": "Filter tasks by status",
        "default": "all"
      }
    },
    "required": ["user_id"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "user_id": "user-123",
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": false,
      "created_at": "2025-01-01T10:00:00Z"
    },
    {
      "id": 2,
      "user_id": "user-123",
      "title": "Call mom",
      "completed": true,
      "created_at": "2025-01-01T09:00:00Z",
      "completed_at": "2025-01-01T11:00:00Z"
    }
  ],
  "summary": {
    "total": 2,
    "pending": 1,
    "completed": 1
  }
}
```

---

### 3. complete_task

**Purpose:** Mark a task as complete or incomplete

**Schema:**
```json
{
  "name": "complete_task",
  "description": "Toggle task completion status",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "User ID from JWT token"
      },
      "task_id": {
        "type": "integer",
        "description": "ID of task to toggle"
      },
      "completed": {
        "type": "boolean",
        "description": "Set to true to mark complete, false to reopen",
        "default": true
      }
    },
    "required": ["user_id", "task_id"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": 1,
    "user_id": "user-123",
    "title": "Buy groceries",
    "completed": true,
    "completed_at": "2025-01-01T12:05:00Z"
  }
}
```

---

### 4. update_task

**Purpose:** Update task title and/or description

**Schema:**
```json
{
  "name": "update_task",
  "description": "Update task title and/or description",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "User ID from JWT token"
      },
      "task_id": {
        "type": "integer",
        "description": "ID of task to update"
      },
      "title": {
        "type": "string",
        "description": "New task title (optional, 1-200 chars)",
        "minLength": 1,
        "maxLength": 200
      },
      "description": {
        "type": "string",
        "description": "New task description (optional, max 1000 chars)",
        "maxLength": 1000
      }
    },
    "required": ["user_id", "task_id"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": 1,
    "user_id": "user-123",
    "title": "Buy groceries and cook",
    "description": "Milk, bread, eggs, chicken",
    "completed": false,
    "updated_at": "2025-01-01T12:10:00Z"
  }
}
```

---

### 5. delete_task

**Purpose:** Delete a task

**Schema:**
```json
{
  "name": "delete_task",
  "description": "Delete a task permanently",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "User ID from JWT token"
      },
      "task_id": {
        "type": "integer",
        "description": "ID of task to delete"
      }
    },
    "required": ["user_id", "task_id"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task 'Buy groceries' has been deleted"
}
```

---

## Implementation Details

### MCP Server Process
- Runs as separate Python process
- Communicates via stdio with FastAPI
- Handles tool invocation
- Validates user_id for all operations
- Returns structured JSON responses

### Database Operations
- All tools use SQLModel ORM
- Enforce user isolation (user_id parameter)
- Implement proper error handling
- Log all operations
- Use database transactions

### Error Handling

**Common Errors:**
- `404: Task not found` - Task doesn't exist or doesn't belong to user
- `400: Invalid parameters` - Missing or invalid input
- `500: Database error` - Unexpected database issue

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Security

#### User Isolation
- Every tool requires user_id parameter
- Verify task.user_id matches request user_id
- Prevent cross-user task access

#### Input Validation
- Validate all input parameters
- Enforce string length limits
- Reject invalid enum values
- Sanitize text input

#### Rate Limiting (Future)
- Limit requests per user
- Prevent abuse
- Log suspicious patterns

## Testing

### Unit Tests
- Test each tool with valid input
- Test error cases
- Test user isolation
- Test database operations

### Integration Tests
- Test MCP client communication
- Test with actual database
- Test concurrent requests
- Test transaction handling

## Performance Targets
- Tool execution: < 500ms
- Database query: < 200ms
- Response serialization: < 100ms
- Total latency: < 1 second

## Future Enhancements
- Batch operations
- Search and filtering
- Task dependencies
- Priority levels
- Due dates
- Recurring tasks
- Collaboration features
