# Phase 3 Implementation Roadmap

## 📋 Project Overview

Transform the Phase 2 Todo App into an AI-powered conversational system with:
- **AI Chatbot**: Natural language task management
- **Stateless Backend**: All context from database
- **MCP Tools**: Structured task operations
- **Premium UI**: Vault-style animations

## 📁 Specification Files Created

All Phase 3 requirements are documented:

### Backend Specs
- ✅ `specs/overview-phase3.md` - Architecture & principles
- ✅ `specs/features/ai-chatbot.md` - AI behavior & intents
- ✅ `specs/api/mcp-tools.md` - Tool definitions
- ✅ `specs/api/chat.md` - Chat endpoint spec
- ✅ `specs/database/schema-phase3.md` - Database additions

### Frontend Specs
- ✅ `specs/ui/chat-interface.md` - UI design & animations

## 🏗️ Implementation Plan

### Phase 3.1: Database & Models (Week 1)

#### Backend Tasks
- [ ] Create database migrations for `conversations` table
- [ ] Create database migrations for `messages` table
- [ ] Create SQLModel models for Conversation and Message
- [ ] Create Pydantic schemas for API request/response

**Files to Create/Modify:**
```
backend/
├── migrations/
│   ├── 001_create_conversations.py
│   └── 002_create_messages.py
├── models/
│   ├── __init__.py
│   ├── conversation.py
│   └── message.py
└── schemas/
    └── chat.py
```

**Estimated Time:** 3-4 hours

---

### Phase 3.2: Chat API Endpoint (Week 1-2)

#### Backend Tasks
- [ ] Create `routes/chat.py` endpoint
- [ ] Implement JWT authentication check
- [ ] Implement conversation loading logic
- [ ] Implement message saving logic
- [ ] Add request/response validation
- [ ] Add error handling

**Files to Create/Modify:**
```
backend/
├── main.py (add router)
├── routes/
│   └── chat.py (new)
└── schemas/
    └── chat.py (create)
```

**Endpoint:**
```
POST /api/{user_id}/chat
```

**Estimated Time:** 4-5 hours

---

### Phase 3.3: MCP Server (Week 2)

#### Backend Tasks
- [ ] Create MCP server project structure
- [ ] Implement `add_task` tool
- [ ] Implement `list_tasks` tool
- [ ] Implement `complete_task` tool
- [ ] Implement `update_task` tool
- [ ] Implement `delete_task` tool
- [ ] Add tool schemas and validation
- [ ] Add error handling per tool

**Files to Create:**
```
backend/
├── mcp_server/
│   ├── __init__.py
│   ├── server.py (MCP server entry)
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── add_task.py
│   │   ├── list_tasks.py
│   │   ├── complete_task.py
│   │   ├── update_task.py
│   │   └── delete_task.py
│   └── schemas/
│       └── tool_schemas.py
```

**MCP Server Startup:**
```bash
python -m backend.mcp_server.server
```

**Estimated Time:** 6-8 hours

---

### Phase 3.4: OpenAI Agent Integration (Week 2-3)

#### Backend Tasks
- [ ] Install OpenAI Agents SDK
- [ ] Create agent configuration
- [ ] Wire MCP client to FastAPI
- [ ] Implement agent invocation in chat endpoint
- [ ] Handle tool execution results
- [ ] Implement response generation
- [ ] Add agent logging and monitoring

**Files to Create/Modify:**
```
backend/
├── requirements.txt (add openai, mcp libs)
├── agent.py (new)
└── routes/
    └── chat.py (integrate agent)
```

**Key Function:**
```python
async def invoke_agent(
    user_id: str,
    message: str,
    conversation_history: List[Message]
) -> str:
    # Call OpenAI agent with MCP tools
    # Return AI response
```

**Estimated Time:** 5-6 hours

---

### Phase 3.5: Frontend - Chat Components (Week 3)

#### Frontend Tasks
- [ ] Create `app/chat/page.tsx` (main chat page)
- [ ] Create `components/ChatContainer.tsx` wrapper
- [ ] Create `components/MessageList.tsx` (scroll & history)
- [ ] Create `components/UserMessage.tsx` component
- [ ] Create `components/AssistantMessage.tsx` component
- [ ] Create `components/InputArea.tsx` (input + send)
- [ ] Create `components/ChatHeader.tsx` (header)

**Files to Create:**
```
frontend/
├── app/
│   └── chat/
│       └── page.tsx
└── components/
    ├── ChatContainer.tsx
    ├── ChatHeader.tsx
    ├── MessageList.tsx
    ├── UserMessage.tsx
    ├── AssistantMessage.tsx
    └── InputArea.tsx
```

**Estimated Time:** 6-8 hours

---

### Phase 3.6: Frontend - Animations (Week 3-4)

#### Frontend Tasks
- [ ] Create vault opening animation
- [ ] Create message entrance animations
- [ ] Create tool execution animations
- [ ] Add typing indicator animation
- [ ] Add button hover/click effects
- [ ] Add scroll to bottom animation
- [ ] Optimize animation performance

**Files to Create:**
```
frontend/
├── lib/
│   └── animations/
│       ├── vault.ts
│       ├── messages.ts
│       └── interactions.ts
└── components/
    └── Animations/
        ├── VaultOpening.tsx
        └── AnimatedMessages.tsx
```

**Estimated Time:** 4-5 hours

---

### Phase 3.7: API Integration (Week 4)

#### Frontend Tasks
- [ ] Create `lib/api/chat.ts` API client
- [ ] Implement message sending function
- [ ] Implement conversation history loading
- [ ] Add loading states
- [ ] Add error handling & display
- [ ] Implement retry logic
- [ ] Add message timestamps

**Files to Create/Modify:**
```
frontend/
└── lib/
    ├── api.ts (existing - add chat methods)
    └── api/
        └── chat.ts (new)
```

**Estimated Time:** 3-4 hours

---

### Phase 3.8: Testing & Polish (Week 4)

#### Backend Testing
- [ ] Unit tests for MCP tools
- [ ] Integration tests for chat endpoint
- [ ] Test conversation history loading
- [ ] Test message persistence
- [ ] Test error handling
- [ ] Load test with concurrent users

#### Frontend Testing
- [ ] Test message sending and receiving
- [ ] Test conversation resumption
- [ ] Test animations on different browsers
- [ ] Test mobile responsiveness
- [ ] Test accessibility (WCAG 2.1)
- [ ] Test performance

**Files to Create:**
```
backend/
└── tests/
    ├── test_chat_api.py
    ├── test_mcp_tools.py
    └── test_database.py

frontend/
└── __tests__/
    ├── ChatContainer.test.tsx
    └── MessageList.test.tsx
```

**Estimated Time:** 5-6 hours

---

## 📅 Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| 3.1: Database | 3-4h | ⏳ Not Started |
| 3.2: Chat API | 4-5h | ⏳ Not Started |
| 3.3: MCP Server | 6-8h | ⏳ Not Started |
| 3.4: Agent Integration | 5-6h | ⏳ Not Started |
| 3.5: Frontend Components | 6-8h | ⏳ Not Started |
| 3.6: Animations | 4-5h | ⏳ Not Started |
| 3.7: API Integration | 3-4h | ⏳ Not Started |
| 3.8: Testing & Polish | 5-6h | ⏳ Not Started |
| **Total** | **36-48h** | **⏳ Planned** |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- OpenAI API key
- Neon PostgreSQL account

### Environment Setup

**Backend `.env`:**
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/todo_app

# OpenAI
OPENAI_API_KEY=sk-...

# Auth
JWT_SECRET=your-secret-key
BETTER_AUTH_SECRET=your-secret

# Server
BACKEND_PORT=8001
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Installation

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
npm install framer-motion  # New dependency
```

---

## 📊 Success Criteria

### Backend
- ✅ Chat endpoint responds in < 3 seconds
- ✅ Messages persist in database
- ✅ MCP tools execute correctly
- ✅ AI generates appropriate responses
- ✅ Full conversation history available
- ✅ User isolation enforced

### Frontend
- ✅ Vault animation plays smoothly
- ✅ Messages animate in/out
- ✅ Input field responsive
- ✅ Auto-scroll to latest message
- ✅ Works on mobile devices
- ✅ 60fps animation performance

### Integration
- ✅ User creates task via chat
- ✅ User views tasks via chat
- ✅ User completes task via chat
- ✅ Conversation can be resumed
- ✅ All changes persist
- ✅ No memory leaks

---

## 📝 Key Commands

### Run Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8001
```

### Run MCP Server (separate terminal)
```bash
cd backend
source venv/bin/activate
python -m mcp_server.server
```

### Run Frontend
```bash
cd frontend
npm run dev  # Development
npm run start  # Production build
```

### Database Migrations
```bash
cd backend
alembic upgrade head  # Apply migrations
alembic downgrade -1  # Revert last migration
```

---

## 🔍 Monitoring & Debugging

### Backend Logs
```bash
# Watch API logs
tail -f /tmp/backend.log

# Watch MCP server logs
tail -f /tmp/mcp_server.log
```

### Frontend Console
```javascript
// Enable chat debugging
localStorage.setItem('debug', 'chat:*');
// Then reload page
```

### Database Inspection
```bash
# Connect to database
psql $DATABASE_URL

# View conversations
SELECT * FROM conversations;

# View messages
SELECT * FROM messages ORDER BY created_at DESC LIMIT 20;
```

---

## 🎯 Checkpoint Checklist

### After Phase 3.1
- [ ] Migrations run without errors
- [ ] Models created and tested
- [ ] Database schema verified

### After Phase 3.2
- [ ] POST /api/{user_id}/chat endpoint works
- [ ] Conversations created in database
- [ ] Messages saved correctly

### After Phase 3.3
- [ ] MCP server starts without errors
- [ ] All 5 tools respond correctly
- [ ] Tool parameters validated

### After Phase 3.4
- [ ] Agent connects to MCP server
- [ ] Agent makes tool calls
- [ ] Chat endpoint returns AI response

### After Phase 3.5
- [ ] Chat page loads
- [ ] Messages display correctly
- [ ] Input field functional

### After Phase 3.6
- [ ] Animations smooth and performant
- [ ] No jank or stuttering
- [ ] Mobile animations optimized

### After Phase 3.7
- [ ] Chat works end-to-end
- [ ] Messages sent and received
- [ ] History loads correctly

### After Phase 3.8
- [ ] All tests passing
- [ ] No console errors
- [ ] Ready for demo

---

## 📚 References

### Specifications
- Read `specs/overview-phase3.md` for architecture
- Read `specs/features/ai-chatbot.md` for AI behavior
- Read `specs/api/chat.md` for endpoint details
- Read `specs/ui/chat-interface.md` for UI design

### Documentation
- OpenAI Agents SDK: https://platform.openai.com/docs/guides/agents
- MCP Protocol: https://spec.modelcontextprotocol.io/
- Framer Motion: https://www.framer.com/motion/
- FastAPI: https://fastapi.tiangolo.com/

### Libraries
```
Backend:
- openai>=1.3.0  # OpenAI Agents SDK
- mcp>=0.1.0    # MCP SDK
- sqlmodel>=0.0.14

Frontend:
- framer-motion>=11.0.0
- react-scroll-to-bottom>=4.11.0  # Auto scroll
```

---

## 🚨 Potential Challenges

### 1. MCP Communication
**Challenge:** Setting up stdio communication between FastAPI and MCP server
**Solution:** Use `asyncio.create_subprocess_exec()` with proper pipe handling

### 2. Token Management
**Challenge:** OpenAI API token limits
**Solution:** Implement message summarization for old conversations

### 3. Animation Performance
**Challenge:** Smooth 60fps animations on lower-end devices
**Solution:** Use CSS transforms, test on real devices, optimize bundle

### 4. Database Scaling
**Challenge:** Message table grows quickly
**Solution:** Implement archival, pagination, full-text search indexes

### 5. Concurrent Requests
**Challenge:** Multiple users chatting simultaneously
**Solution:** Connection pooling, stateless design, proper locking

---

## 🎓 Learning Resources

Before starting implementation, review:
- [ ] OpenAI Agents SDK documentation
- [ ] MCP Protocol specification
- [ ] Framer Motion animation best practices
- [ ] FastAPI async patterns
- [ ] SQLModel ORM examples

---

## ✅ Next Steps

1. **Start with Phase 3.1**: Create database schema
2. **Test migrations**: Ensure database tables created
3. **Build API foundation**: Chat endpoint
4. **Implement MCP server**: Test tools independently
5. **Integrate agent**: Wire everything together
6. **Build UI**: Components and interactions
7. **Add animations**: Polish and effects
8. **Test thoroughly**: End-to-end flows

---

**Generated:** 2025-01-01
**Status:** Ready for Implementation
**Next Review:** After Phase 3.1 Complete
