'use client';

import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import QuickActions from '@/components/QuickActions';
import MathDisplay from '@/components/MathDisplay';
import { useStudent } from '@/contexts/StudentContext';
import { chatService, curriculumService } from '@/lib/services';
import { ChatMessage, QuickAction, ChatScope, Objective } from '@/lib/types';

export default function StudentChat() {
  const { chatScope, setChatScope, profile, getMasteryForObjective } = useStudent();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get objectives for current scope
  const availableObjectives = curriculumService.getObjectivesByYearAndTier(
    chatScope.yearGroup,
    chatScope.subject,
    chatScope.tier
  );

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
        const greeting: ChatMessage = {
        id: 'greeting',
        role: 'assistant',
        content: `Hello! I'm Nova, your AI learning companion for GCSE ${chatScope.subject}.\n\nI'm here to help you with Year ${chatScope.yearGroup} ${chatScope.subject}${chatScope.tier ? ` (${chatScope.tier} tier)` : ''}.\n\n${chatScope.objectiveTitle ? `We're focusing on: **${chatScope.objectiveTitle}**` : 'Select an objective above, or ask me anything about ' + chatScope.subject + '!'}\n\nUse the quick action buttons below, or type your question!`,
        scope: chatScope,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScopeChange = (update: Partial<ChatScope>) => {
    setChatScope(update);
    
    // Add scope change message
    const newScope = { ...chatScope, ...update };
    if (update.objectiveId !== undefined) {
      const obj = update.objectiveId ? curriculumService.getObjectiveById(update.objectiveId) : null;
      const scopeMessage: ChatMessage = {
        id: `scope-${Date.now()}`,
        role: 'assistant',
        content: obj 
          ? `Great! Let's focus on **${obj.title}**.\n\n${obj.description}\n\nWhat would you like to know about this topic?`
          : `Scope cleared. Feel free to ask me anything about ${newScope.subject}!`,
        scope: newScope as ChatScope,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, scopeMessage]);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    if (!chatScope.objectiveTitle && action !== 'practice_question') {
      // Prompt to select objective
      const promptMessage: ChatMessage = {
        id: `prompt-${Date.now()}`,
        role: 'assistant',
        content: 'Please select an objective first using the dropdown above, so I can give you targeted help.',
        scope: chatScope,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, promptMessage]);
      return;
    }

    const actionMessages: Record<QuickAction, string> = {
      explain_simply: `Explain "${chatScope.objectiveTitle}" simply`,
      show_example: `Show me a worked example for "${chatScope.objectiveTitle}"`,
      practice_question: `Give me a practice question for ${chatScope.objectiveTitle || chatScope.subject}`,
      check_answer: 'Check my answer (I\'ll type it next)',
    };

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: actionMessages[action],
      scope: chatScope,
      timestamp: new Date(),
      quickAction: action,
    };

    setMessages(prev => [...prev, userMessage]);
    await sendToAssistant(actionMessages[action], action);
  };

  const sendToAssistant = async (content: string, quickAction?: QuickAction) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          scope: chatScope,
          quickAction,
          history: messages.slice(-10), // Last 10 messages for context
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
        scope: chatScope,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      chatService.saveMessage(assistantMessage);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I had trouble responding. Please try again!',
        scope: chatScope,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      scope: chatScope,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatService.saveMessage(userMessage);
    setInput('');

    await sendToAssistant(input.trim());
  };

  const selectObjective = (obj: Objective) => {
    handleScopeChange({ objectiveId: obj.id, objectiveTitle: obj.title });
  };

  return (
    <Layout role="student">
      <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
        {/* Compact Scope Bar with Objective Selector */}
        <div className="mb-4 bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject */}
            <select
              value={chatScope.subject}
              onChange={(e) => handleScopeChange({ 
                subject: e.target.value as 'Mathematics' | 'English', 
                objectiveId: null, 
                objectiveTitle: null 
              })}
              className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Mathematics">Maths</option>
              <option value="English">English</option>
            </select>

            {/* Year */}
            <select
              value={chatScope.yearGroup}
              onChange={(e) => handleScopeChange({ yearGroup: parseInt(e.target.value) as 7|8|9|10|11 })}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[7, 8, 9, 10, 11].map(y => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>

            {/* Tier (Maths only) */}
            {chatScope.subject === 'Mathematics' && (
              <select
                value={chatScope.tier || ''}
                onChange={(e) => handleScopeChange({ tier: e.target.value as 'Foundation' | 'Higher' | undefined || undefined })}
                className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-sm font-medium text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any tier</option>
                <option value="Foundation">Foundation</option>
                <option value="Higher">Higher</option>
              </select>
            )}

            {/* Objective Dropdown */}
            <select
              value={chatScope.objectiveId || ''}
              onChange={(e) => {
                if (e.target.value) {
                  const obj = availableObjectives.find(o => o.id === e.target.value);
                  if (obj) selectObjective(obj);
                } else {
                  handleScopeChange({ objectiveId: null, objectiveTitle: null });
                }
              }}
              className="flex-1 min-w-[180px] px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select objective...</option>
              {availableObjectives.map(obj => (
                <option key={obj.id} value={obj.id}>
                  {obj.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <MathDisplay content={message.content} />
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="mb-3">
          <QuickActions onAction={handleQuickAction} disabled={isLoading} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder={`Ask about ${chatScope.objectiveTitle || chatScope.subject}...`}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>

      </div>
    </Layout>
  );
}
