"""Chat API endpoint for Phase 3."""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import uuid4

try:
    from auth import get_current_user_id
    from database import get_session
    from models.conversation import Conversation
    from models.message import Message
    from schemas.chat import ChatRequest, ChatResponse, ErrorResponse
    from openai_agent import process_chat_message
except ImportError:
    from ..auth import get_current_user_id
    from ..database import get_session
    from ..models.conversation import Conversation
    from ..models.message import Message
    from ..schemas.chat import ChatRequest, ChatResponse, ErrorResponse
    from ..openai_agent import process_chat_message

router = APIRouter(tags=["chat"])


@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    """Handle chat messages and return AI responses.

    This is a stateless endpoint that:
    1. Loads conversation history from DB
    2. Invokes OpenAI Agent with context
    3. Saves messages to DB
    4. Returns response to frontend

    Args:
        user_id: User ID from URL path
        request: ChatRequest with message and optional conversation_id
        current_user_id: Authenticated user ID from JWT
        session: Database session

    Returns:
        ChatResponse with AI response and metadata
    """
    # Verify user_id matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access other users' conversations",
        )

    # Create or load conversation
    if request.conversation_id:
        # Load existing conversation
        conversation = session.exec(
            select(Conversation).where(
                (Conversation.id == request.conversation_id)
                & (Conversation.user_id == user_id)
            )
        ).first()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
    else:
        # Create new conversation
        conversation = Conversation(
            id=str(uuid4()),
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    # Load conversation history (last 10 messages)
    history = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at)
        .limit(10)
    ).all()

    # Format history for OpenAI agent
    conversation_history = [
        {
            "role": msg.role,
            "content": msg.content
        }
        for msg in history
    ]

    # Save user message
    user_message_id = str(uuid4())
    user_msg = Message(
        id=user_message_id,
        conversation_id=conversation.id,
        user_id=user_id,
        role="user",
        content=request.message,
        created_at=datetime.utcnow(),
    )
    session.add(user_msg)
    session.commit()

    # Call OpenAI Agent with message and history
    ai_response, tool_used, action_taken = process_chat_message(
        request.message, user_id, conversation_history
    )

    # Save assistant message
    assistant_message_id = str(uuid4())
    assistant_msg = Message(
        id=assistant_message_id,
        conversation_id=conversation.id,
        user_id=user_id,
        role="assistant",
        content=ai_response,
        tool_used=tool_used,
        action_taken=action_taken,
        created_at=datetime.utcnow(),
    )
    session.add(assistant_msg)
    session.commit()

    # Update conversation updated_at
    conversation.updated_at = datetime.utcnow()
    session.add(conversation)
    session.commit()

    return ChatResponse(
        success=True,
        conversation_id=conversation.id,
        user_message_id=user_message_id,
        assistant_message_id=assistant_message_id,
        response=ai_response,
        tool_used=tool_used,
        action_taken=action_taken,
        timestamp=datetime.utcnow(),
    )


@router.get("/api/{user_id}/chat/conversations")
async def get_conversations(
    user_id: str,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    """Get all conversations for a user."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access other users' conversations",
        )

    conversations = session.exec(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()

    return {"conversations": conversations}


@router.get("/api/{user_id}/chat/conversations/{conversation_id}")
async def get_conversation_messages(
    user_id: str,
    conversation_id: str,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    """Get all messages in a conversation."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access other users' conversations",
        )

    # Verify conversation exists and belongs to user
    conversation = session.exec(
        select(Conversation).where(
            (Conversation.id == conversation_id) & (Conversation.user_id == user_id)
        )
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    # Get all messages
    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()

    return {"conversation_id": conversation_id, "messages": messages}
