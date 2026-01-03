# Feature: Task CRUD Operations (Web Application)

## User Stories
- As a user, I can create a new task through the web interface
- As a user, I can view all my tasks in a responsive list
- As a user, I can update my tasks through the web interface
- As a user, I can delete my tasks through the web interface
- As a user, I can mark my tasks as complete/incomplete through the web interface
- As a user, I cannot access or modify other users' tasks

## Acceptance Criteria

### Create Task (Web)
- Title is required (1-200 characters)
- Description is optional (max 1000 characters)
- Task is associated with authenticated user
- Task is stored in Neon PostgreSQL database
- User receives success feedback
- Task appears in task list immediately

### View Tasks (Web)
- Only show tasks for authenticated user
- Display title, description, status, and creation date
- Support filtering by status (all, pending, completed)
- Support sorting (by creation date, by title)
- Responsive layout for different screen sizes

### Update Task (Web)
- Update task title and/or description
- Preserve task ID and creation timestamp
- Update modification timestamp
- Only authenticated user can update their own task
- Task reflects changes in the UI immediately

### Delete Task (Web)
- Remove task from database by ID
- Show confirmation dialog before deletion
- Only authenticated user can delete their own task
- Task is removed from UI immediately upon deletion
- User receives success feedback

### Mark Complete/Incomplete (Web)
- Toggle task completion status
- Update completion timestamp when marked complete
- Only authenticated user can modify their own task
- Visual state updates immediately in UI

## Data Model
```
Task:
  id: int (auto-incrementing primary key)
  user_id: string (foreign key to users table)
  title: string (1-200 characters, not null)
  description: string (optional, max 1000 characters)
  completed: boolean (default false)
  created_at: datetime (auto-generated)
  updated_at: datetime (nullable, updated on modification)
  completed_at: datetime (nullable, set when completed)
```

## API Requirements
- All CRUD operations require authentication
- User ID in URL path must match authenticated user
- Proper HTTP status codes returned
- JSON request/response format
- Error handling with appropriate messages