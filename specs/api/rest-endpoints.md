# REST API Endpoints for Phase II

## Base URL
- Development: http://localhost:8000/api
- Production: https://api.example.com/api

## Authentication
All endpoints require JWT token in header:
Authorization: Bearer <token>

## API Endpoints

### GET /{user_id}/tasks
List all tasks for authenticated user.

Query Parameters:
- status: "all" | "pending" | "completed"
- sort: "created" | "title" | "due_date"

Response: Array of Task objects

### POST /{user_id}/tasks
Create a new task.

Request Body:
- title: string (required, 1-200 characters)
- description: string (optional, max 1000 characters)

Response: Created Task object

### GET /{user_id}/tasks/{id}
Get task details.

Response: Task object

### PUT /{user_id}/tasks/{id}
Update a task.

Request Body:
- title: string (optional)
- description: string (optional)

Response: Updated Task object

### DELETE /{user_id}/tasks/{id}
Delete a task.

Response: Empty object with success message

### PATCH /{user_id}/tasks/{id}/complete
Toggle completion status.

Response: Updated Task object

## Task Object Schema
```json
{
  "id": integer,
  "user_id": string,
  "title": string,
  "description": string,
  "completed": boolean,
  "created_at": string (ISO date),
  "updated_at": string (ISO date) | null,
  "completed_at": string (ISO date) | null
}
```

## Error Responses
All error responses follow this format:
```json
{
  "detail": "Error message"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Internal server error