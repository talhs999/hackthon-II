# Feature: AI Chatbot - Conversational Task Management

## Overview
Users interact with an AI agent through natural conversation to manage their tasks. The AI understands intent, selects appropriate MCP tools, and executes task operations.

## User Stories

### Story 1: Create Task via Conversation
**As a** user
**I want** to say something like "Remember to buy groceries"
**So that** a new task is created without clicking forms

**Acceptance Criteria:**
- User types natural language message
- AI recognizes "add task" intent
- MCP tool executes task creation
- AI confirms action with friendly message
- Task appears in task list

### Story 2: List Tasks Conversationally
**As a** user
**I want** to ask "What do I need to do?"
**So that** AI shows me my pending tasks

**Acceptance Criteria:**
- User asks for task list (variations: "show tasks", "list", "what's pending")
- AI invokes list_tasks MCP tool
- AI formats response naturally
- Task count and details shown

### Story 3: Complete Task via Chat
**As a** user
**I want** to say "Mark groceries as done"
**So that** the system understands which task and marks it complete

**Acceptance Criteria:**
- User mentions task and completion intent
- AI identifies which task
- AI invokes complete_task tool
- Task status updates
- AI confirms completion

### Story 4: Delete Task Conversationally
**As a** user
**I want** to say "Remove the old task about X"
**So that** system removes it and confirms

**Acceptance Criteria:**
- User expresses delete intent with task reference
- AI identifies correct task
- AI invokes delete_task tool
- Task removed from database
- AI confirms deletion

### Story 5: Resume Conversation
**As a** user
**I want** to close the app and return later
**So that** the AI remembers what we discussed

**Acceptance Criteria:**
- User returns to same conversation
- Previous messages visible
- AI can reference previous context
- Can continue from where left off

## Intent Mapping

| Intent | Keywords | MCP Tool | Parameters |
|--------|----------|----------|------------|
| Add Task | add, create, remember, note, save | add_task | title, description |
| List Tasks | show, list, what, pending, upcoming | list_tasks | filter (optional) |
| Complete Task | done, complete, finish, check | complete_task | task_id |
| Update Task | change, update, edit, modify | update_task | task_id, title, description |
| Delete Task | remove, delete, cancel, forget | delete_task | task_id |

## AI Agent Behavior

### Processing Flow
1. Receive user message
2. Load conversation history from DB
3. Pass to OpenAI Agents SDK with MCP tools
4. Agent analyzes intent
5. Agent selects appropriate tool(s)
6. Execute MCP tool(s)
7. Generate natural language response
8. Save message and response to DB
9. Return to frontend

### Response Patterns

#### Successful Task Creation
```
User: "Remember to call mom tomorrow"
AI: "✅ Got it! I've created a task: 'call mom tomorrow'.
     You now have 5 pending tasks."
```

#### Task List Response
```
User: "What do I need to do?"
AI: "You have 3 pending tasks:
     1. Buy groceries
     2. Call mom
     3. Finish report

     Ready to mark any as done?"
```

#### Completion Confirmation
```
User: "Done with groceries"
AI: "✅ Great! 'Buy groceries' is marked as complete.
     You have 2 tasks remaining."
```

#### Deletion Confirmation
```
User: "Delete the old task"
AI: "✅ Removed 'Old task name'.
     You now have 2 tasks."
```

#### Clarification Request
```
User: "Mark it as done"
AI: "Which task would you like to complete?
     You have:
     - Buy groceries
     - Call mom
     - Finish report"
```

## Context Awareness

### Session Context
- Current user ID (from JWT)
- Current conversation ID
- Previous 10 messages
- User's current task list

### Smart Responses
- Reference previous messages
- Use task names from context
- Adapt tone based on conversation
- Provide relevant summaries

## Error Handling

### Invalid Intent
```
User: "What's the weather?"
AI: "I can help with your tasks!
     I can add, list, complete, update, or delete tasks.
     What would you like to do?"
```

### Ambiguous Task Reference
```
User: "Mark the first one done"
AI: "I found 2 tasks starting with 'the'.
     Did you mean:
     1. Buy groceries
     2. Call mom"
```

### Database Errors
```
User: "Create a task"
AI: "I'm having trouble saving that right now.
     Please try again in a moment."
```

## Message Format

### User Message
```
{
  "role": "user",
  "content": "Remember to call mom",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

### Assistant Message
```
{
  "role": "assistant",
  "content": "✅ Got it! I've created a task: 'call mom'.",
  "tool_used": "add_task",
  "action_taken": "Created task with title='call mom'",
  "timestamp": "2025-01-01T12:00:05Z"
}
```

## Validation Rules

### User Message
- Non-empty text
- Max 1000 characters
- Valid conversation_id or null

### AI Response
- Always acknowledge user
- Provide context when relevant
- Suggest next action when appropriate
- Keep responses concise

## Performance Requirements
- Response time < 3 seconds for UI feedback
- Message save < 100ms
- Tool execution < 2 seconds
- History load < 500ms

## Security Requirements
- JWT token required
- User can only access own messages
- MCP tools validate user_id
- No system prompts in frontend
- Rate limiting on chat endpoint

## Future Enhancements
- Multi-turn conversations
- Task dependencies
- Smart scheduling
- Natural date parsing
- Voice input support
- Conversation export
