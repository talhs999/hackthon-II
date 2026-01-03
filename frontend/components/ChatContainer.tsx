'use client';

import { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';

interface ChatContainerProps {
  userId: string;
  initialConversationId?: string | null;
  onConversationChange?: (conversationId: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool_used?: string;
  action_taken?: string;
  timestamp: string;
}

export default function ChatContainer({
  userId,
  initialConversationId,
  onConversationChange,
}: ChatContainerProps) {
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history if conversation ID exists
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages();
    }
  }, [conversationId]);

  const loadConversationMessages = async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/${userId}/chat/conversations/${conversationId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Transform messages to our format
        const transformedMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          tool_used: msg.tool_used,
          action_taken: msg.action_taken,
          timestamp: msg.created_at,
        }));
        setMessages(transformedMessages);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    setError('');
    setIsLoading(true);

    try {
      // Add user message to UI immediately
      const userMessageId = `temp-${Date.now()}`;
      const userMessage: Message = {
        id: userMessageId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send to backend
      const response = await fetch(`/api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Update conversation ID if this is a new conversation
      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
        localStorage.setItem('last-conversation-id', data.conversation_id);
        onConversationChange?.(data.conversation_id);
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: data.assistant_message_id,
        role: 'assistant',
        content: data.response,
        tool_used: data.tool_used,
        action_taken: data.action_taken,
        timestamp: data.timestamp,
      };

      // Replace temp user message with real one
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== userMessageId),
        {
          ...userMessage,
          id: data.user_message_id,
        },
        assistantMessage,
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send message'
      );
      // Remove temp message on error
      setMessages((prev) =>
        prev.filter((m) => !m.id.startsWith('temp-'))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <ChatHeader userId={userId} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          error={error}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputArea
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </div>
  );
}
