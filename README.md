# Hackathon Todo App - Phase I & II: Console to Web Application

A full-stack todo application that evolves from a command-line interface to a modern web application with authentication, persistence, and responsive design.

## Phase I: Console Application

A simple command-line todo application built with Python that stores tasks in memory with JSON persistence.

### Phase I Features

- **Add Tasks**: Create new tasks with titles and optional descriptions
- **List Tasks**: View all tasks with their status (pending/completed)
- **Update Tasks**: Modify existing task titles and descriptions
- **Delete Tasks**: Remove tasks with confirmation
- **Mark Complete/Incomplete**: Toggle task completion status

### Phase I Usage

The Phase I application can be run directly using Python:

```bash
# Add a new task
python -m hackathon_todo add "task title" ["task description"]

# List all tasks
python -m hackathon_todo list

# Update an existing task
python -m hackathon_todo update <task_id> "new title" ["new description"]

# Delete a task
python -m hackathon_todo delete <task_id>

# Mark a task as complete/incomplete
python -m hackathon_todo complete <task_id>
```

## Phase II: Full-Stack Web Application

A modern web application with Next.js frontend, FastAPI backend, PostgreSQL database, and Better Auth authentication.

### Phase II Features

- **Full-stack web application** with Next.js frontend and FastAPI backend
- **User authentication** with Better Auth and JWT tokens
- **Persistent storage** using Neon PostgreSQL database
- **Responsive design** with Tailwind CSS
- **RESTful API** with user isolation
- **Task CRUD operations** with proper authorization

### Phase II Requirements

- Node.js 18+ and npm
- Python 3.13+
- PostgreSQL (or use Docker to run locally)
- Better Auth compatible environment

### Phase II Installation

1. Install dependencies for both frontend and backend:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt

   # Frontend
   cd ../frontend
   npm install
   ```

2. Set up environment variables:
   - Copy the `.env` template and configure your database URL and auth secrets
   - Ensure `BETTER_AUTH_SECRET` and `JWT_SECRET` are set to strong, secure values

3. Create a PostgreSQL database (for development, you can use Docker):
   ```bash
   docker run --name todo-postgres -e POSTGRES_DB=todo_app -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
   ```

### Phase II Usage

1. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

### Environment Variables

The application requires the following environment variables:

```env
# Backend
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_app
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long
JWT_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### API Endpoints (Phase II)

All endpoints require authentication via JWT token in the Authorization header.

- `GET /api/{user_id}/tasks` - List user's tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status

### Project Structure

```
hackathon-2/
├── .spec-kit/                 # Spec-Kit configuration
│   └── config.yaml
├── specs/                     # Specification files
│   ├── overview.md
│   ├── features/
│   │   ├── task-crud.md
│   │   └── authentication.md
│   ├── api/
│   │   └── rest-endpoints.md
│   ├── database/
│   │   └── schema.md
│   └── ui/
│       └── components.md
├── frontend/                  # Next.js frontend
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and API client
│   ├── types/                 # TypeScript definitions
│   ├── package.json
│   └── ...
├── backend/                   # FastAPI backend
│   ├── models/                # SQLModel definitions
│   ├── routes/                # API route handlers
│   ├── main.py                # FastAPI app entry point
│   ├── database.py            # Database connection
│   ├── auth.py                # Authentication middleware
│   └── requirements.txt
├── pyproject.toml             # Python project configuration
├── requirements.txt           # Phase I dependencies
├── .python-version            # Python version specification
├── docker-compose.yml         # Docker configuration
├── README.md                  # This file
├── CLAUDE.md                  # Claude Code instructions
├── .env                       # Environment variables template
└── tasks.json                 # Phase I task data persistence (auto-generated)
```

## Architecture

### Phase I Architecture
- **CLI Interface**: Command-line interface for user interaction
- **Task Model**: Python class representing a task with ID, title, description, status, and timestamps
- **Data Persistence**: JSON file-based storage for task data
- **Spec-Driven**: Project specifications organized with Spec-Kit Plus

### Phase II Architecture
- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with SQLModel ORM for PostgreSQL
- **Authentication**: Better Auth with JWT token system
- **Data Persistence**: Neon PostgreSQL database with proper schema
- **API Layer**: RESTful endpoints with user isolation and authorization
- **Security**: JWT-based authentication and user-specific data access
- **Spec-Driven**: Project specifications organized with Spec-Kit Plus

## Phase III: AI-Powered Conversational Todo System

An intelligent chatbot interface for managing todos through natural language, powered by OpenAI Agents SDK with premium vault-style animations.

### Phase III Features

- **OpenAI Agents SDK Integration** - Natural language understanding and task management
- **MCP Tools** - add_task, list_tasks, complete_task, update_task, delete_task
- **Conversation History** - Multi-turn conversations with context awareness
- **Vault Animation** - Premium opening animation with sliding doors and locks
- **Dark Theme UI** - Professional dark mode with purple accents
- **Message Animations** - Slide-in, stagger, and hover effects
- **Stateless Architecture** - Database-backed conversation persistence
- **User Isolation** - JWT + user_id based access control

### Phase III Tech Stack

- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, OpenAI Agents SDK, SQLModel
- **AI**: OpenAI API (gpt-4o-mini recommended)
- **Tools**: MCP Protocol (embedded in FastAPI)
- **Database**: SQLite (dev) / Neon PostgreSQL (prod)
- **Auth**: Better Auth with JWT tokens

### Phase III Setup

1. **Backend Setup**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

2. **Configure Environment**:
```bash
# Add to .env file:
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

3. **Run Backend**:
```bash
uvicorn main:app --reload
# http://localhost:8000
```

4. **Frontend Setup**:
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000/chat
```

### Phase III Usage

1. Navigate to `/chat` page
2. Watch vault opening animation
3. Start chatting with natural language:
   - "Remember to buy groceries"
   - "What do I need to do?"
   - "Mark groceries as done"
   - "Delete that task"

### Phase III Architecture

```
User (Chat Interface)
    ↓
VaultContainer (Animation) → ChatContainer (State)
    ↓
OpenAI Agent (Intelligence) → MCP Tools (Execution)
    ↓
Database (Persistence)
```

### Phase III Success Criteria ✅

- ✅ OpenAI Agents SDK integrated
- ✅ 5 MCP tools work with natural language
- ✅ Conversation history maintained
- ✅ Vault opening animation smooth
- ✅ Dark theme with premium styling
- ✅ Message animations working
- ✅ User isolation preserved
- ✅ Stateless architecture maintained

### Phase III Files

See `PHASE-3-IMPLEMENTATION-COMPLETE.md` for detailed implementation notes.

**New Files**:
- `backend/openai_agent.py` - OpenAI integration
- `frontend/components/VaultContainer.tsx` - Vault animation
- `frontend/components/AnimatedMessage.tsx` - Message animations

**Modified Files**:
- `backend/requirements.txt` - Added openai, mcp
- `backend/.env` - Added OpenAI config
- `backend/mcp_tools.py` - Added tool schemas
- `backend/routes/chat.py` - OpenAI agent integration
- `frontend/package.json` - Added framer-motion
- `frontend/components/*` - Dark theme + animations
- `frontend/app/chat/page.tsx` - Vault wrapper

## Next Phase

This AI-powered chatbot application will evolve further with:
- Voice input integration
- Task export to calendar
- Smart suggestions with AI
- Collaboration features
- Mobile app with React Native