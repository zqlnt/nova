import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    // Build conversation history for Claude
    const claudeMessages = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // System prompt for Nova
    const systemPrompt = `You are Nova, an AI learning assistant for students. You help students understand concepts, solve problems, and learn effectively. 
    
Your personality:
- Friendly, encouraging, and patient
- Break down complex topics into simple explanations
- Use examples and analogies
- Ask clarifying questions when needed
- Celebrate student progress

${context ? `Current context: The student is ${context.role} with interests in ${context.interests || 'various subjects'}.` : ''}

Always be supportive and make learning engaging!`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ 
      message: reply,
      success: true 
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from Nova',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

