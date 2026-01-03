# Database Schema: Phase III

## Overview
Extended schema for Phase III includes conversation and message tracking for the AI chatbot system.

## Existing Tables (Phase II)

### tasks
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## New Tables (Phase III)

### conversations
**Purpose:** Track individual conversations per user

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
```

**Fields:**
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `created_at`: Conversation start time
- `updated_at`: Last message time

**Why:**
- One conversation per interaction session
- User can have multiple conversations
- Full history preserved per conversation
- Updated timestamp tracks activity

### messages
**Purpose:** Store all messages in conversations

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    tool_used VARCHAR(50),
    action_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_role ON messages(role);
```

**Fields:**
- `id`: UUID primary key
- `conversation_id`: Foreign key to conversations
- `user_id`: Foreign key to users
- `role`: 'user' or 'assistant'
- `content`: Message text
- `tool_used`: Name of MCP tool if executed (null if no tool)
- `action_taken`: Description of action if tool executed (null if no tool)
- `created_at`: Message timestamp

**Why:**
- Full message history preserved
- Track which messages used tools
- Record what actions were taken
- Enable conversation reconstruction
- Support analytics

### conversation_metadata (Optional)
**Purpose:** Track conversation-level metadata

```sql
CREATE TABLE conversation_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL UNIQUE,
    topic VARCHAR(200),
    task_count_created INT DEFAULT 0,
    task_count_completed INT DEFAULT 0,
    message_count INT DEFAULT 0,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_conversation_metadata_conversation_id ON conversation_metadata(conversation_id);
```

**Why (Optional):**
- Quick conversation statistics
- Analytics and reporting
- Reduce expensive aggregation queries
- Future features

## Migration Strategy

### Phase 2 → Phase 3 Migration
```sql
-- Create new tables
CREATE TABLE conversations (...);
CREATE TABLE messages (...);
CREATE TABLE conversation_metadata (...);

-- Add indexes
CREATE INDEX ...

-- No data migration needed (new feature)
-- Existing tasks remain unchanged
```

### Schema Evolution
- Use database migrations
- Version control all changes
- Test on development database first
- Plan zero-downtime deployments

## Data Relationships

```
users (existing)
  ├─→ tasks (existing)
  │    └─ one user, many tasks
  │
  └─→ conversations (new)
       └─ one user, many conversations
            └─→ messages (new)
                 └─ one conversation, many messages
```

## Typical Queries

### Load Conversation History
```sql
SELECT * FROM messages
WHERE conversation_id = ?
ORDER BY created_at ASC
LIMIT 20;
```

### Get User's Conversations
```sql
SELECT * FROM conversations
WHERE user_id = ?
ORDER BY updated_at DESC;
```

### Count User's Tasks Created This Session
```sql
SELECT COUNT(*) FROM messages
WHERE conversation_id = ?
  AND user_id = ?
  AND role = 'assistant'
  AND tool_used = 'add_task';
```

### Get Recent Activity
```sql
SELECT m.created_at, m.role, m.content, m.tool_used
FROM messages m
WHERE m.user_id = ?
ORDER BY m.created_at DESC
LIMIT 50;
```

## Performance Considerations

### Indexes
- `conversations(user_id)` - Fast user lookup
- `messages(conversation_id)` - Fast conversation history
- `messages(user_id)` - Fast user message lookup
- `messages(created_at)` - Fast recent message queries

### Query Performance
- Load 20 messages: < 50ms
- Get user conversations: < 100ms
- Insert message: < 10ms
- Update conversation: < 10ms

### Storage
- 1 million messages ≈ 500 MB (with indexes)
- Scalable to 100+ million messages
- Archival strategy for old conversations (future)

## Backup & Recovery

### Backup Strategy
- Daily backups (automated by Neon)
- Point-in-time recovery
- Test restore procedures

### Data Retention
- Keep all messages indefinitely (for audit)
- Optional archival of old conversations
- GDPR compliance for user data deletion

## Security

### Row-Level Security (Future)
```sql
CREATE POLICY user_messages_policy ON messages
  USING (auth.uid()::text = user_id);
```

### Access Control
- Users can only query their own messages
- No cross-user data access
- All queries filtered by user_id

## Monitoring

### Metrics to Track
- Message insertion rate
- Conversation creation rate
- Average messages per conversation
- Storage growth rate
- Query performance

### Alerts
- Disk space usage > 80%
- Query execution time > 1s
- Failed message inserts
- Connection pool exhausted

## Future Enhancements

### Advanced Features
- Conversation search (full-text)
- Message reactions
- Conversation sharing
- Message editing/deletion
- Conversation export
- Analytics dashboard

### Schema Changes
- Message embedding vectors (for search)
- Conversation topics/tags
- Message rating/feedback
- Tool execution details (separate table)
- Conversation snapshots

## Migration Scripts

### Python SQLAlchemy
```python
from sqlalchemy import create_engine
from alembic import command
from alembic.config import Config

# Run migrations
alembic_cfg = Config("alembic.ini")
command.upgrade(alembic_cfg, "head")
```

### Direct SQL
```sql
-- Run all migration files in order
-- migration_001_create_conversations.sql
-- migration_002_create_messages.sql
-- migration_003_create_indexes.sql
```

## Testing

### Unit Tests
- Schema creation validation
- Index creation
- Foreign key constraints
- Default values

### Integration Tests
- Message insertion
- Conversation creation
- Query performance
- Data consistency

## Rollback Plan

### If Issues Occur
```sql
-- Drop new tables
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversation_metadata;
DROP TABLE IF EXISTS conversations;

-- Existing data intact
SELECT * FROM tasks;
SELECT * FROM users;
```
