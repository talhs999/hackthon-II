'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { chatAPI } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool_used?: string;
  action_taken?: string;
  timestamp: string;
}

interface SidebarChatProps {
  onClose: () => void;
  setUnreadCount: (count: number) => void;
}

export default function SidebarChat({ onClose, setUnreadCount }: SidebarChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('demo-user');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user ID from session
  useEffect(() => {
    const session = localStorage.getItem('auth-session');
    if (session) {
      try {
        const authSession = JSON.parse(session);
        const currentUserId = authSession.user?.id || 'demo-user';
        setUserId(currentUserId);

        // Load last conversation
        const lastConvId = localStorage.getItem('sidebar-chat-conversation-id');
        if (lastConvId) {
          setConversationId(lastConvId);
          loadMessages(lastConvId, currentUserId);
        }
      } catch (error) {
        console.error('Error parsing session:', error);
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (convId: string, currentUserId: string) => {
    try {
      const loadedMessages = await chatAPI.getConversationMessages(currentUserId, convId);
      const transformed = loadedMessages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        tool_used: msg.tool_used,
        action_taken: msg.action_taken,
        timestamp: msg.created_at,
      }));
      setMessages(transformed);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      // Add user message to UI
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: input,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      // Send to API
      const response = await chatAPI.sendMessage(userId, input, conversationId);

      // Update conversation ID if new
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
        localStorage.setItem('sidebar-chat-conversation-id', response.conversation_id);
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: response.assistant_message_id,
        role: 'assistant',
        content: response.response,
        tool_used: response.tool_used,
        action_taken: response.action_taken,
        timestamp: response.timestamp,
      };

      // Replace temp message and add assistant message
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== userMessage.id),
        {
          ...userMessage,
          id: response.user_message_id,
        },
        assistantMessage,
      ]);

      setUnreadCount(0);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((m) => !m.id.startsWith('temp-')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            🤖
          </motion.span>
          <div>
            <h3 className="font-bold">AI Assistant</h3>
            <p className="text-xs text-purple-200">Always here to help</p>
          </div>
        </div>
        <motion.button
          onClick={onClose}
          className="text-white hover:bg-purple-600 p-2 rounded-lg transition"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </motion.div>

      {/* Messages Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-800/50"
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center text-slate-400"
          >
            <motion.span
              className="text-4xl mb-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👋
            </motion.span>
            <p className="text-sm">Start chatting with your AI assistant!</p>
            <p className="text-xs mt-2 text-slate-500">Try: "add buy milk" or "show tasks"</p>
          </motion.div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ x: msg.role === 'user' ? 20 : -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-slate-700 text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="text-xs whitespace-pre-wrap">{msg.content}</p>
                {msg.tool_used && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1 text-xs bg-slate-600 px-2 py-1 rounded mt-1 inline-block"
                  >
                    🔧 {msg.tool_used}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input Area */}
      <motion.form
        onSubmit={handleSendMessage}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-700 p-3 border-t border-slate-600 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Type a message..."
          className="flex-1 bg-slate-600 text-white placeholder-slate-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded px-3 py-2 text-sm font-semibold disabled:opacity-50 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              ⏳
            </motion.span>
          ) : (
            '➤'
          )}
        </motion.button>
      </motion.form>
    </div>
  );
}
