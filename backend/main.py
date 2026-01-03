from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

try:
    # Try relative imports (when running as module)
    from .database import engine
    from .routes import tasks, chat
    from .auth import jwt_middleware
except ImportError:
    # Fall back to absolute imports (when running directly)
    from database import engine
    from routes import tasks, chat
    from auth import jwt_middleware

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    SQLModel.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Todo API",
    description="API for managing user tasks",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware MUST come first (added in reverse order due to middleware stack)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    max_age=3600,
)

# Add JWT middleware
app.middleware("http")(jwt_middleware)

# Include routers
app.include_router(tasks.router, prefix="/api")
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Todo API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}