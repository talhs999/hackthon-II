# Phase III: AI-Powered Conversational Todo System

## Vision
Transform the todo app into an intelligent, conversational system where users interact with an AI agent through natural language. The system uses MCP tools for task management while maintaining a stateless backend with persistent conversation history.

## Architecture Overview

```
User Interface (Vault-Style Chat)
        ↓
Chat API (/api/{user_id}/chat)
        ↓
OpenAI Agents SDK
        ↓
MCP Server (Task Tools)
        ↓
PostgreSQL (Tasks + Conversations + Messages)
```

## Key Principles
- **Stateless Backend**: No session state on server, all context from DB
- **Tool-Driven AI**: AI only makes decisions, MCP tools execute
- **Full Conversation History**: Every message and action stored
- **User Isolation**: JWT-based auth ensures data privacy
- **Premium UX**: Vault-style animations and micro-interactions

## Tech Stack - Phase III

### Backend
- FastAPI (existing)
- OpenAI Agents SDK (new)
- MCP SDK for Python (new)
- Neon PostgreSQL (existing)
- Better Auth (existing)

### Frontend
- Next.js 16+ (existing)
- Framer Motion (new)
- TailwindCSS (existing)
- TypeScript (existing)

### Infrastructure
- MCP Server (stateless tool provider)
- OpenAI API (agent engine)

## Phase III Features

### 1. AI Conversational Interface
- Natural language task management
- Intent recognition and tool selection
- Friendly confirmation responses
- Context awareness from conversation history

### 2. Stateless Chat System
- Conversation tracking with DB
- Message history loading per request
- No in-memory state
- Scalable architecture

### 3. MCP Tools for Task Management
- add_task
- list_tasks
- complete_task
- update_task
- delete_task

### 4. Premium Chat UI
- Vault-style opening animation
- Smooth message transitions
- Tool execution animations
- Responsive design
- Auto-scroll and context awareness

### 5. Conversation Persistence
- Full conversation history
- Message threading
- Conversation resumption
- Analytics-ready data structure

## Database Schema Additions

### conversations
```
id (UUID, PK)
user_id (STRING, FK)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### messages
```
id (UUID, PK)
conversation_id (UUID, FK)
user_id (STRING, FK)
role (ENUM: user | assistant)
content (TEXT)
created_at (TIMESTAMP)
```

## API Endpoints - Phase III

### Chat Endpoint
```
POST /api/{user_id}/chat

Request:
{
  "conversation_id": "uuid" | null,
  "message": "user text"
}

Response:
{
  "conversation_id": "uuid",
  "message_id": "uuid",
  "response": "ai response text",
  "tool_used": "tool_name" | null,
  "action_taken": "description" | null,
  "timestamp": "ISO-8601"
}
```

## Implementation Phases

### Phase 3.1: Database & API Foundation
- [ ] Create conversation and message tables
- [ ] Implement chat endpoint
- [ ] Set up request/response models

### Phase 3.2: MCP Server
- [ ] Create MCP server with task tools
- [ ] Implement tool schemas
- [ ] Add error handling

### Phase 3.3: AI Agent Integration
- [ ] Connect OpenAI Agents SDK
- [ ] Create agent with MCP tools
- [ ] Implement intent mapping

### Phase 3.4: Frontend Chat UI
- [ ] Build vault-style opening animation
- [ ] Create chat message component
- [ ] Add animations and micro-interactions
- [ ] Implement conversation history loading

### Phase 3.5: Testing & Polish
- [ ] E2E conversation flows
- [ ] Animation performance
- [ ] Security validation
- [ ] Error recovery

## Success Metrics
- ✅ User can create task via natural language
- ✅ AI correctly identifies intent
- ✅ MCP tools execute successfully
- ✅ Conversation history persists
- ✅ UI feels premium and responsive
- ✅ No memory leaks or state issues
- ✅ System scales horizontally

## Next Steps
1. Create detailed specs for each component
2. Set up database migrations
3. Build MCP server
4. Integrate OpenAI agents
5. Build frontend UI
6. End-to-end testing
