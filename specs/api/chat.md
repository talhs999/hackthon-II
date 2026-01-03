# Chat API: Stateless Conversational Endpoint

## Overview
Single powerful endpoint for AI-powered task management via natural conversation. The backend is completely stateless - all context comes from the database.

## Architecture

```
POST /api/{user_id}/chat (Stateless)
    ↓
1. Verify JWT token
2. Load conversation history from DB
3. Invoke OpenAI Agent with MCP tools
4. Execute tool if needed
5. Save messages to DB
6. Return response
```

## Endpoint

### POST /api/{user_id}/chat

**Purpose:** Process user message and get AI response

**Authentication:** JWT Bearer token required

**Path Parameters:**
```
user_id: string (from URL path, must match JWT user_id)
```

**Request Body:**
```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000" | null,
  "message": "Remember to buy groceries"
}
```

**Request Validation:**
- `message`: non-empty, max 1000 chars
- `conversation_id`: valid UUID or null (creates new if null)
- JWT token: must be valid
- JWT user_id: must match URL path user_id

**Response (200 OK):**
```json
{
  "success": true,
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_message_id": "user-msg-123",
  "assistant_message_id": "assist-msg-456",
  "response": "✅ Got it! I've created a task: 'buy groceries'.",
  "tool_used": "add_task",
  "action_taken": "Created task: 'buy groceries'",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid request",
  "details": "Message cannot be empty"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid token",
  "details": "JWT token expired or invalid"
}
```

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Server error",
  "details": "Failed to process chat message"
}
```

## Processing Flow (Detailed)

### Step 1: Authentication
```python
# Extract JWT from Authorization header
# Verify signature and expiration
# Extract user_id from token
# Ensure user_id matches URL path
```

### Step 2: Validate Request
```python
# Check message is non-empty
# Check message length < 1000
# Check conversation_id is valid UUID or None
# Check user_id is valid
```

### Step 3: Load Conversation Context
```python
# If conversation_id is null, create new conversation
# Load last 10 messages from conversation
# Load user's task list
# Build context for agent
```

### Step 4: Prepare Agent Input
```python
# Format conversation history
# Prepare user_id for MCP tools
# Set up system context
# Create agent configuration
```

### Step 5: Save User Message
```python
# Save message to DB with role=user
# Timestamp with server time
# Link to conversation_id
# Ensure user_id consistency
```

### Step 6: Invoke OpenAI Agent
```python
# Pass conversation context to agent
# Provide MCP tools
# Let agent decide which tool to use
# Get agent response
```

### Step 7: Handle Tool Execution
```python
# If agent calls MCP tool, execute it
# Capture tool result
# Include in context for final response
# Log tool execution
```

### Step 8: Generate Response
```python
# Agent creates natural language response
# Include tool execution summary
# Add actionable suggestions
# Ensure tone is friendly
```

### Step 9: Save Assistant Message
```python
# Save message to DB with role=assistant
# Include tool_used field
# Include action_taken field
# Link to conversation
```

### Step 10: Return Response
```python
# Return successful response with all details
# Include conversation_id for frontend
# Include message IDs for references
# Include timestamps
```

## Data Models

### Chat Request
```python
class ChatRequest(BaseModel):
    conversation_id: Optional[UUID] = None
    message: str  # 1-1000 chars

    @validator('message')
    def message_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Message cannot be empty')
        return v.strip()
```

### Chat Response
```python
class ChatResponse(BaseModel):
    success: bool
    conversation_id: UUID
    user_message_id: UUID
    assistant_message_id: UUID
    response: str
    tool_used: Optional[str]
    action_taken: Optional[str]
    timestamp: datetime
```

### Error Response
```python
class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    details: Optional[str] = None
```

## Stateless Design

### Why Stateless?
- **Scalability**: Can run multiple instances
- **Reliability**: No session loss
- **Simplicity**: All state in database
- **Debuggability**: Full audit trail

### What's NOT Stored on Server
- Conversation state
- Message history
- User preferences
- Session tokens (beyond JWT)
- Temporary contexts

### What IS Stored in Database
- All messages
- All conversations
- All tool executions
- User data
- Timestamps

## Conversation Management

### New Conversation
```
Request with conversation_id: null
→ Server creates new conversation
→ Returns new conversation_id
→ Frontend stores for subsequent requests
```

### Continuing Conversation
```
Request with same conversation_id
→ Server loads history
→ Agent has full context
→ Continue naturally
```

### Multiple Conversations
```
User can have multiple active conversations
Each identified by unique conversation_id
Frontend manages switching between them
Full history preserved for each
```

## Error Handling

### Validation Errors
```json
{
  "success": false,
  "error": "Validation error",
  "details": "Message must be 1-1000 characters"
}
```

### Authentication Errors
```json
{
  "success": false,
  "error": "Authentication failed",
  "details": "Invalid or expired JWT token"
}
```

### Tool Execution Errors
```json
{
  "success": true,
  "response": "I encountered an issue while trying to update that task. Please try again.",
  "tool_used": "update_task",
  "action_taken": null
}
```

### Database Errors
```json
{
  "success": false,
  "error": "Server error",
  "details": "Failed to save message to database"
}
```

## Rate Limiting (Future)
- 100 requests per user per hour
- 10 requests per minute per user
- 1000 requests per day per server

## Logging

### Log Entries
- User message received
- Tool invoked (if any)
- Tool result
- AI response generated
- Messages saved
- Response sent

### Metrics Tracked
- Response time
- Tool execution time
- Message count per user
- Conversation count per user
- Error rates

## Performance Requirements
- Response time: < 3 seconds (user perceivable)
- Token to response: < 2 seconds (for good UX)
- Database operations: < 100ms
- Tool execution: < 1 second
- Total latency: < 3 seconds

## Security Considerations

### Authentication
- JWT token required in Authorization header
- Token validation on every request
- User_id from token must match URL path
- Token expiration enforced

### Data Isolation
- Users can only access their own messages
- Users can only access their own conversations
- MCP tools validate user_id
- Database queries filtered by user_id

### Input Validation
- Message length limits
- UUID format validation
- Whitespace trimming
- Injection prevention

### Audit Trail
- All messages logged with timestamps
- All tool executions logged
- All errors logged
- Full conversation history preserved

## Testing Strategy

### Unit Tests
- Request validation
- Database operations
- Error handling

### Integration Tests
- Full request/response cycle
- MCP tool execution
- Database persistence
- JWT validation

### Load Tests
- Concurrent conversations
- Message throughput
- Database connection pooling
- Memory usage

## Future Enhancements
- Message reactions
- Conversation search
- Bulk operations
- Streaming responses
- Real-time notifications
- Webhook integration
