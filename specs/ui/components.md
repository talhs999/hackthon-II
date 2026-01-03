# Web UI Specifications for Todo Application

## Page Structure

### Main Dashboard (/)
- Navigation bar with user profile and logout
- Task list view with filtering options
- Add task form at the top
- Task cards with title, description, status, and actions

### Task List View
Each task card displays:
- Checkbox to toggle completion status
- Title (prominent)
- Description (subtle)
- Creation date
- Action buttons: Edit, Delete

## Components

### Task Card Component
```
[✓] Buy groceries
    Milk, bread, eggs
    Created: 2025-01-01
    [Edit] [Delete]
```

### Add/Edit Task Form
- Title input field (required)
- Description textarea (optional)
- Submit/Save button
- Cancel button

### Filter Controls
- Show: All Tasks | Pending | Completed
- Sort by: Created Date | Title

## User Interaction Flow

### View Tasks
1. User logs in and lands on dashboard
2. System fetches tasks for authenticated user via API
3. Tasks are displayed as cards in a responsive grid

### Add Task
1. User fills out title and description in the form
2. System sends POST request to `/api/{user_id}/tasks`
3. On success, the new task appears in the list

### Update Task
1. User clicks "Edit" on a task card
2. Edit form appears pre-filled with current values
3. User updates fields and saves
4. System sends PUT request to `/api/{user_id}/tasks/{id}`
5. Task card updates with new values

### Delete Task
1. User clicks "Delete" on a task card
2. Confirmation dialog appears
3. On confirmation, system sends DELETE request to `/api/{user_id}/tasks/{id}`
4. Task card is removed from the list

### Mark Complete
1. User toggles the checkbox on a task card
2. System sends PATCH request to `/api/{user_id}/tasks/{id}/complete`
3. Task card visual state updates (strikethrough, etc.)

## Responsive Design
- Mobile: Single column, touch-friendly controls
- Tablet: Two columns
- Desktop: Three or more columns

## Authentication Views
- Login page with Better Auth integration
- Registration page (if needed)
- Profile page to view account details