'use client';

import { useState } from 'react';
import Button from './Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export default function ChatInput({ onSend, placeholder = 'Type your message...', compact = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };
  
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
          style={{ backgroundColor: '#007AFF' }}
          aria-label="Send message"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
        />
        <Button type="submit" disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
}

