# Backend Guidelines - Phase II

## Stack
- FastAPI
- SQLModel (ORM)
- Neon PostgreSQL
- Better Auth JWT integration

## Project Structure
- `main.py` - FastAPI app entry point
- `models.py` - SQLModel database models
- `routes/` - API route handlers
- `database.py` - Database connection
- `auth.py` - Authentication middleware
- `schemas.py` - Pydantic models for request/response

## API Conventions
- All routes under `/api/{user_id}/`
- Return JSON responses
- Use Pydantic models for request/response
- Handle errors with HTTPException
- Implement JWT token verification
- Enforce user isolation on all operations

## Database
- Use SQLModel for all database operations
- Connection string from environment variable: DATABASE_URL
- Implement proper relationships between users and tasks

## Authentication
- Verify JWT tokens from Better Auth
- Extract user ID from tokens
- Validate user permissions for each request
- Implement middleware for authentication

## Running
uvicorn main:app --reload --port 8000