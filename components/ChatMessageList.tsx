interface Message {
  id: string;
  sender: 'user' | 'nova';
  content: string;
  timestamp: string;
}

interface ChatMessageListProps {
  messages: Message[];
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'nova-frost-bubble text-gray-800'
            }`}
          >
            {message.sender === 'nova' && (
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Nova</span>
              </div>
            )}
            <p className="text-sm leading-relaxed">{message.content}</p>
            <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
              {message.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

