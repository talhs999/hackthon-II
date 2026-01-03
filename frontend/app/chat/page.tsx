'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatContainer from '@/components/ChatContainer';
import VaultContainer from '@/components/VaultContainer';

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const session = localStorage.getItem('auth-session');
    if (!session) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    try {
      const authSession = JSON.parse(session);
      const currentUserId = authSession.user?.id || 'demo-user';
      setUserId(currentUserId);
      setIsAuthenticated(true);

      // Load last conversation ID if available
      const lastConversationId = localStorage.getItem('last-conversation-id');
      if (lastConversationId) {
        setConversationId(lastConversationId);
      }
    } catch (error) {
      console.error('Error parsing session:', error);
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <p className="text-purple-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <VaultContainer>
      <ChatContainer
        userId={userId}
        initialConversationId={conversationId}
        onConversationChange={setConversationId}
      />
    </VaultContainer>
  );
}
