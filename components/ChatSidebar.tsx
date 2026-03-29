'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import MathSymbolAnimation from './MathSymbolAnimation';

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'nova';
  content: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  'Explain quadratic equations simply',
  'Help me with a practice question',
  'What topics should I revise?',
  'Summarise my progress',
  'Show me a worked example',
];

const QUICK_ACTIONS = [
  { label: 'Explain', icon: '📖' },
  { label: 'Practice', icon: '✏️' },
  { label: 'Summarise', icon: '📋' },
  { label: 'Examples', icon: '💡' },
];

export default function ChatSidebar({ collapsed, onToggle }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const isFirstMessage = messages.length === 0;
    const updatedMessages = isFirstMessage
      ? [
          {
            id: 'welcome',
            sender: 'nova' as const,
            content: "Hello! I'm Nova, your AI learning assistant. How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          newMessage,
        ]
      : [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          message: content,
          context: { role: 'student' },
        }),
      });

      const data = await response.json();

      if (data.success || data.response) {
        const novaContent = data.message ?? data.response ?? "I'm here to help! What would you like to know?";
        const novaResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'nova',
          content: novaContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, novaResponse]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'nova',
        content: "I'm having trouble connecting. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
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
      <div className="p-4 border-b border-gray-200/80 bg-gradient-to-b from-white to-gray-50/30 flex items-center justify-between flex-shrink-0">
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
        {messages.length === 0 ? (
          <div className="flex flex-col h-full min-h-[200px] justify-center">
            <div className="flex items-center gap-2 mb-4">
              <MathSymbolAnimation size="sm" colorIndex={0} />
              <span className="text-sm text-gray-500">AI learning assistant</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Ask Nova anything about maths or English. Try a suggestion below:</p>
            <div className="space-y-2 mb-6">
              {PROMPT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent text-sm text-gray-700 hover:text-blue-700 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => handleSuggestionClick(a.label + ' a topic')}
                  className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs text-gray-600 hover:text-blue-600 transition-all"
                >
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ChatMessageList messages={messages} />
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200/80 bg-gradient-to-t from-gray-50/50 to-transparent flex-shrink-0">
        <ChatInput 
          onSend={handleSendMessage}
          placeholder="Ask Nova anything..."
          compact={true}
        />
      </div>
    </div>
  );
}

