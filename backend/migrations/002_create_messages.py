"""Migration: Create messages table.

This migration creates the messages table for Phase 3.
"""


def create_messages_table(connection):
    """Create messages table."""
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS message (
            id VARCHAR(36) PRIMARY KEY,
            conversation_id VARCHAR(36) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL,
            content LONGTEXT NOT NULL,
            tool_used VARCHAR(50),
            action_taken LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE
        )
        """
    )
    # Create indexes
    connection.execute(
        "CREATE INDEX IF NOT EXISTS idx_message_conversation_id ON message(conversation_id)"
    )
    connection.execute(
        "CREATE INDEX IF NOT EXISTS idx_message_user_id ON message(user_id)"
    )
    connection.execute(
        "CREATE INDEX IF NOT EXISTS idx_message_created_at ON message(created_at)"
    )
    connection.execute(
        "CREATE INDEX IF NOT EXISTS idx_message_role ON message(role)"
    )


def drop_messages_table(connection):
    """Drop messages table."""
    connection.execute("DROP TABLE IF EXISTS message")


def run(connection):
    """Run migration."""
    create_messages_table(connection)


def rollback(connection):
    """Rollback migration."""
    drop_messages_table(connection)
