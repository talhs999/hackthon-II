"""Run database migrations for Phase 3."""

import os
import sys
from sqlalchemy import create_engine, text

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import DATABASE_URL


def run_migrations():
    """Run all migrations."""
    engine = create_engine(DATABASE_URL)

    migrations = [
        ("001_create_conversations", "migrations.001_create_conversations"),
        ("002_create_messages", "migrations.002_create_messages"),
    ]

    print("🔄 Running database migrations...")
    print(f"Database: {DATABASE_URL}")
    print()

    with engine.connect() as connection:
        for migration_name, module_path in migrations:
            try:
                # Import the migration module
                module = __import__(module_path, fromlist=["run"])

                print(f"⏳ Running {migration_name}...")
                module.run(connection)
                connection.commit()
                print(f"✅ {migration_name} completed")

            except Exception as e:
                connection.rollback()
                print(f"❌ {migration_name} failed: {e}")
                return False

    print()
    print("✅ All migrations completed successfully!")
    return True


if __name__ == "__main__":
    success = run_migrations()
    sys.exit(0 if success else 1)
