# Todo App - Hackathon II

## Project Overview
This is a full-stack web application that evolves from a console app to a distributed cloud-native system. Phase II implements a Next.js frontend with FastAPI backend, Neon PostgreSQL database, and Better Auth authentication.

## Spec-Kit Structure
Specifications are organized in /specs:
- /specs/overview.md - Project overview
- /specs/features/ - Feature specs (what to build)
- /specs/api/ - API endpoint specifications
- /specs/database/ - Schema and model specs
- /specs/ui/ - Component and page specs

## How to Use Specs
1. Always read relevant spec before implementing
2. Reference specs with: @specs/features/task-crud.md
3. Update specs if requirements change

## Project Structure
- /frontend - Next.js 16+ app
- /backend - Python FastAPI server
- /specs - Specification files
- /docker-compose.yml - Container orchestration

## Development Workflow
1. Read spec: @specs/features/[feature].md
2. Implement backend: @backend/CLAUDE.md
3. Implement frontend: @frontend/CLAUDE.md
4. Test and iterate

## Commands
- Frontend: cd frontend && npm run dev
- Backend: cd backend && uvicorn main:app --reload
- Both: docker-compose up

## Phase II Features
- User authentication with Better Auth
- JWT token-based security
- RESTful API endpoints with user isolation
- Task CRUD operations with data persistence
- Responsive web interface