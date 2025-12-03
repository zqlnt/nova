'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const mockMessages = [
  {
    id: '1',
    sender: 'nova' as const,
    content: 'Hello! I\'m Nova, your AI learning assistant. How can I help you today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export default function ChatSidebar({ collapsed, onToggle }: ChatSidebarProps) {
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = async (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    try {
      // Call Nova API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          context: {
            role: 'student',
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        const novaResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'nova' as const,
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, novaResponse]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'nova' as const,
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="absolute -left-10 top-4 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 shadow-sm"
        aria-label="Open chat"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1">
            <Image 
              src="https://i.imghippo.com/files/tyq3865Jxs.png" 
              alt="Nova" 
              width={24} 
              height={24}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Chat with Nova</h2>
            <p className="text-xs text-gray-500">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Collapse chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <ChatMessageList messages={messages} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0">
        <ChatInput 
          onSend={handleSendMessage}
          placeholder="Ask Nova..."
          compact={true}
        />
      </div>
    </div>
  );
}

