"""Migration: Create conversations table.

This migration creates the conversations table for Phase 3.
"""

from sqlalchemy import Column, String, DateTime, Index
from sqlalchemy.sql import func


def create_conversations_table(connection):
    """Create conversations table."""
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS conversation (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Create indexes
    connection.execute(
        "CREATE INDEX IF NOT EXISTS idx_conversation_user_id ON conversation(user_id)"
    )
    connection.execute(
        "CREATE INDEX IF NOT EXISTS idx_conversation_created_at ON conversation(created_at)"
    )


def drop_conversations_table(connection):
    """Drop conversations table."""
    connection.execute("DROP TABLE IF EXISTS conversation")


def run(connection):
    """Run migration."""
    create_conversations_table(connection)


def rollback(connection):
    """Rollback migration."""
    drop_conversations_table(connection)
