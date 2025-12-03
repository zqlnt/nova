'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ChatMessageList from '@/components/ChatMessageList';
import ChatInput from '@/components/ChatInput';
import { mockChatMessages, subjects } from '@/lib/mockData';

export default function StudentChat() {
  const [messages, setMessages] = useState(mockChatMessages);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

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
            subject: selectedSubject,
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

  return (
    <Layout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Chat with Nova
          </h1>
          <p className="text-gray-600">Your AI learning companion is here to help you understand any topic</p>
        </div>

        {/* Subject Selector */}
        <Card>
          <h3 className="font-semibold mb-3">Select a subject (optional)</h3>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedSubject === null ? 'info' : 'default'}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedSubject(null)}
            >
              All Subjects
            </Badge>
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant={selectedSubject === subject ? 'info' : 'default'}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="min-h-[500px] flex flex-col relative overflow-hidden">
          {/* Background chat bubble decoration */}
          <div className="absolute right-0 bottom-0 opacity-[0.02]">
            <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
              <path d="M50 80C50 58.9 67.9 42 89 42H161C182.1 42 200 58.9 200 80V140C200 161.1 182.1 178 161 178H120L80 208V178H89C67.9 178 50 161.1 50 140V80Z" fill="currentColor" className="text-gray-900"/>
            </svg>
          </div>
          <div className="flex-1 overflow-y-auto mb-4 pr-2 relative z-10" style={{ maxHeight: '500px' }}>
            <ChatMessageList messages={messages} />
          </div>
          
          <div className="border-t border-white/30 pt-4 mt-4">
            <ChatInput 
              onSend={handleSendMessage}
              placeholder={selectedSubject ? `Ask about ${selectedSubject}...` : "Ask Nova anything..."}
            />
          </div>
        </Card>

        {/* Quick Tips */}
        <Card decorative className="bg-gradient-to-br from-blue-50/30 to-transparent border border-ios-blue/20">
          <h3 className="font-semibold mb-3 text-gray-900">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Ask Nova to explain concepts in simpler terms</li>
            <li>• Request step-by-step solutions to problems</li>
            <li>• Ask for practice questions on specific topics</li>
            <li>• Get help with homework or exam preparation</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
}

