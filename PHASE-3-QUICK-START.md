# Phase 3 - Quick Start Guide

## 🎯 You Have

A **complete Phase 3 specification suite** with everything needed to build an AI-powered conversational todo system.

## 📁 Read These Specs (In Order)

### 1. Architecture & Vision
```bash
cat specs/overview-phase3.md
```
**What you'll learn:** High-level architecture, design principles, tech stack

### 2. AI Chatbot Behavior
```bash
cat specs/features/ai-chatbot.md
```
**What you'll learn:** How AI understands user intent, maps to tools, responds

### 3. MCP Tool Definitions
```bash
cat specs/api/mcp-tools.md
```
**What you'll learn:** 5 tools (add_task, list_tasks, complete_task, update_task, delete_task) with complete schemas

### 4. Chat API Endpoint
```bash
cat specs/api/chat.md
```
**What you'll learn:** Stateless endpoint, 10-step flow, request/response models

### 5. Database Schema
```bash
cat specs/database/schema-phase3.md
```
**What you'll learn:** New tables (conversations, messages), migrations, relationships

### 6. UI Design
```bash
cat specs/ui/chat-interface.md
```
**What you'll learn:** Vault-style animations, message components, micro-interactions

### 7. Implementation Roadmap
```bash
cat PHASE-3-ROADMAP.md
```
**What you'll learn:** 8-phase plan (36-48 hours), success criteria, commands

## 🚀 Start Building

### Phase 3.1: Database (3-4 hours)

```bash
cd backend

# 1. Create migration files
touch migrations/001_create_conversations.py
touch migrations/002_create_messages.py

# 2. Create SQLModel models
touch models/conversation.py
touch models/message.py

# 3. Create Pydantic schemas
touch schemas/chat.py

# 4. Run migrations
alembic upgrade head

# 5. Test with sample data
python -c "
from database import SessionLocal
from models import Conversation, Message
# Test queries
"
```

**Checklist:**
- [ ] Tables created in database
- [ ] Models defined with relationships
- [ ] Schemas created for API
- [ ] Migrations reversible
- [ ] Sample data loads correctly

### Phase 3.2: Chat API (4-5 hours)

```bash
# 1. Create chat endpoint
touch backend/routes/chat.py

# 2. Implement in main.py
# Add to main.py:
# from routes import chat
# app.include_router(chat.router)

# 3. Test endpoint
curl -X POST http://localhost:8001/api/test-user/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{"message": "hello", "conversation_id": null}'
```

**Checklist:**
- [ ] Endpoint responds with 200
- [ ] Conversations created in DB
- [ ] Messages saved correctly
- [ ] JWT validation works
- [ ] Error handling functional

### Phase 3.3: MCP Server (6-8 hours)

```bash
# 1. Create MCP server structure
mkdir -p backend/mcp_server/tools
touch backend/mcp_server/__init__.py
touch backend/mcp_server/server.py
touch backend/mcp_server/tools/__init__.py

# 2. Create each tool
touch backend/mcp_server/tools/{add_task,list_tasks,complete_task,update_task,delete_task}.py

# 3. Start MCP server
python -m backend.mcp_server.server
```

**Test Each Tool:**
```bash
# In another terminal, use Claude to call the tool
# or write a simple test script
python backend/tests/test_mcp_tools.py
```

**Checklist:**
- [ ] MCP server starts without errors
- [ ] All 5 tools available
- [ ] Tools return correct schemas
- [ ] User isolation works
- [ ] Error handling robust

### Phase 3.4: OpenAI Integration (5-6 hours)

```bash
# 1. Set OpenAI API key
export OPENAI_API_KEY="sk-..."

# 2. Create agent
touch backend/agent.py

# 3. Wire MCP client to FastAPI
# In routes/chat.py:
# - Create MCP client
# - Initialize agent with tools
# - Call agent.invoke()

# 4. Test integration
python backend/tests/test_agent.py
```

**Checklist:**
- [ ] Agent connects to MCP
- [ ] Agent makes tool calls
- [ ] Tool results used in response
- [ ] Responses are natural
- [ ] Logging works

### Phase 3.5: Frontend Components (6-8 hours)

```bash
cd frontend

# 1. Create chat page
mkdir -p app/chat
touch app/chat/page.tsx

# 2. Create components
touch components/{ChatContainer,ChatHeader,MessageList,UserMessage,AssistantMessage,InputArea}.tsx

# 3. Test components
npm run dev
# Navigate to http://localhost:3000/chat
```

**Checklist:**
- [ ] Chat page loads
- [ ] Messages display
- [ ] Input field works
- [ ] Component hierarchy correct
- [ ] No console errors

### Phase 3.6: Animations (4-5 hours)

```bash
# 1. Install Framer Motion
npm install framer-motion

# 2. Create animation files
mkdir -p frontend/lib/animations
touch frontend/lib/animations/{vault,messages,interactions}.ts

# 3. Add to components
# - VaultOpening in ChatContainer
# - Animation in MessageList
# - Interactions in InputArea

# 4. Test animations
npm run dev
# Open DevTools, check 60fps
```

**Checklist:**
- [ ] Vault animation smooth
- [ ] Messages animate in
- [ ] 60fps performance
- [ ] Mobile smooth
- [ ] No jank

### Phase 3.7: API Integration (3-4 hours)

```bash
# 1. Create API client
touch frontend/lib/api/chat.ts

# 2. Add methods
# - sendMessage(userId, conversationId, message)
# - loadHistory(conversationId)
# - createConversation()

# 3. Wire to components
# In ChatContainer, InputArea
# - Call API on send
# - Load history on mount
# - Handle loading states

# 4. Test flow
# Send message → see AI response
```

**Checklist:**
- [ ] Messages sent to API
- [ ] Responses received
- [ ] UI updates correctly
- [ ] Loading states show
- [ ] Error handling works

### Phase 3.8: Testing (5-6 hours)

```bash
# 1. Backend tests
pytest backend/tests/test_chat_api.py
pytest backend/tests/test_mcp_tools.py

# 2. Frontend tests
npm run test

# 3. E2E test manually
# - Create task via chat ✅
# - Ask for list ✅
# - Complete task ✅
# - Close & reopen ✅
# - History loads ✅

# 4. Check quality
# - No console errors
# - No memory leaks
# - Performance good
# - Mobile works
```

**Checklist:**
- [ ] All tests passing
- [ ] E2E flows work
- [ ] No errors
- [ ] Performance good
- [ ] Ready to demo

## 🎯 Success Criteria

### Must Have ✅
- [ ] Chat endpoint works
- [ ] Messages persist
- [ ] AI responds to intents
- [ ] MCP tools execute
- [ ] Conversation history loads
- [ ] User isolation enforced

### Should Have 📍
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] Error messages clear
- [ ] Loading states visible
- [ ] Accessibility WCAG AA

### Nice to Have ✨
- [ ] Voice input
- [ ] Export conversations
- [ ] Message search
- [ ] Dark mode toggle
- [ ] Rate limiting

## 🧪 Testing Commands

```bash
# Backend health
curl http://localhost:8001/health

# Create test conversation
curl -X POST http://localhost:8001/api/test-user/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Remember to buy milk", "conversation_id": null}'

# Check database
psql $DATABASE_URL
SELECT * FROM conversations;
SELECT * FROM messages;

# Frontend
npm run dev
# Open http://localhost:3000/chat

# Run all tests
npm run test          # Frontend
pytest backend/tests  # Backend
```

## 🔍 Debugging

### Backend Logs
```bash
# Watch backend output
tail -f /tmp/backend.log | grep -i "chat\|error"
```

### Frontend Console
```javascript
// In browser DevTools
localStorage.setItem('debug', 'chat:*');
location.reload();
```

### Database
```bash
psql $DATABASE_URL
SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;
SELECT role, COUNT(*) FROM messages GROUP BY role;
```

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `specs/overview-phase3.md` | Architecture |
| `specs/features/ai-chatbot.md` | AI behavior |
| `specs/api/mcp-tools.md` | Tool definitions |
| `specs/api/chat.md` | API endpoint |
| `specs/database/schema-phase3.md` | Database |
| `specs/ui/chat-interface.md` | UI design |
| `PHASE-3-ROADMAP.md` | Implementation |

## 🚀 Next Action

**Read `specs/overview-phase3.md` first** to understand the complete architecture, then follow the 8-phase implementation plan in `PHASE-3-ROADMAP.md`.

Start with Phase 3.1 (Database) and work through each phase systematically.

**Estimated Total Time:** 36-48 hours

Good luck! You've got this! 🎯
