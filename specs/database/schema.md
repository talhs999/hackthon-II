# Database Schema for Web Application

## Database
Neon Serverless PostgreSQL

## Tables

### users (managed by Better Auth)
- id: string (primary key)
- email: string (unique)
- name: string
- created_at: timestamp

### tasks
- id: integer (primary key, auto-increment)
- user_id: string (foreign key -> users.id, required)
- title: string (not null, 1-200 characters)
- description: text (nullable, max 1000 characters)
- completed: boolean (default false)
- created_at: timestamp (default now)
- updated_at: timestamp (nullable)
- completed_at: timestamp (nullable)

## Indexes
- tasks.user_id (for filtering by user)
- tasks.completed (for status filtering)
- tasks.created_at (for sorting)

## Relationships
- One user to many tasks (one-to-many)

## SQLModel Definitions
```python
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)

class TaskRead(SQLModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime]
    completed_at: Optional[datetime]
```