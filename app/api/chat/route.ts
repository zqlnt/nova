import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { message, scope, quickAction, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { response: 'Please provide a message.', success: false },
        { status: 400 }
      );
    }

    // If no API key, return friendly fallback
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        response: "I'm having trouble connecting right now. Please check that the chat service is configured and try again.",
        success: false,
      });
    }

    // Build conversation history for Claude
    const claudeMessages = history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    })) || [];

    // Add the current message
    claudeMessages.push({
      role: 'user' as const,
      content: message,
    });

    // Build curriculum-locked system prompt
    const systemPrompt = buildSystemPrompt(scope, quickAction);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ 
      response: reply,
      success: true 
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        response: 'Sorry, I had trouble responding. Please try again!',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(scope: any, quickAction?: string): string {
  const subject = scope?.subject || 'Mathematics';
  const yearGroup = scope?.yearGroup || 10;
  const tier = scope?.tier;
  const objectiveTitle = scope?.objectiveTitle;

  let prompt = `You are Nova, a friendly and encouraging AI tutor helping UK GCSE students learn ${subject}.

## CRITICAL RULES - YOU MUST FOLLOW THESE:

1. **STAY IN SCOPE**: You are helping a Year ${yearGroup} student with ${subject}${tier ? ` (${tier} tier)` : ''}.
   ${objectiveTitle ? `Current objective: "${objectiveTitle}"` : 'No specific objective selected.'}
   
2. **SCOPE GUARDRAILS**: 
   - If the student asks about a topic OUTSIDE ${subject} or beyond Year ${yearGroup} level, politely redirect:
     "That's a great question! However, I'm currently set up to help you with ${subject}. Would you like me to help with that, or shall we switch topics?"
   - Never provide content significantly above or below the year group level
   ${tier === 'Foundation' ? '- Focus on Foundation tier content (grades 1-5)' : ''}
   ${tier === 'Higher' ? '- Include Higher tier content where appropriate (grades 4-9)' : ''}

3. **NEVER JUST GIVE ANSWERS**: 
   - For practice questions, ALWAYS explain the method step-by-step
   - After explaining, ask a follow-up question to check understanding
   - Use phrases like "Can you see why...?" or "What would happen if...?"

4. **BE ENCOURAGING**: 
   - Celebrate effort and progress
   - If they get something wrong, stay positive: "Good try! Let's look at this together..."
   - Keep language professional and supportive

`;

  // Add subject-specific formatting
  if (subject === 'Mathematics') {
    prompt += `
## MATHS FORMATTING:
- Use clear mathematical notation
- For powers: write x², x³, or x^n
- For fractions: write as a/b or use words "a over b"
- For square roots: write √ or sqrt()
- Show working step-by-step, numbered
- Use × for multiplication, ÷ for division
- Always show the method before the answer
- For equations, align equals signs in your working

Example format:
**Step 1:** Start with the equation...
**Step 2:** Rearrange to get...
**Step 3:** Therefore, x = ...

`;
  } else {
    prompt += `
## ENGLISH FORMATTING:
- Use quotes when referencing texts: "The writer uses..."
- Explain terminology in simple terms
- Model PEE/PEEL paragraph structure when relevant
- Give examples from familiar contexts
- For language analysis, always consider: What? How? Why?

Example format:
**Point:** The writer creates a tense atmosphere...
**Evidence:** This is shown through "..."
**Explanation:** This suggests... because...

`;
  }

  // Add quick action specific instructions
  if (quickAction) {
    prompt += `
## CURRENT REQUEST TYPE: ${quickAction.toUpperCase().replace('_', ' ')}
`;
    
    switch (quickAction) {
      case 'explain_simply':
        prompt += `The student wants a simple explanation. Use:
- Short sentences
- Everyday analogies
- No jargon without explanation
- A concrete example
- Max 3-4 key points`;
        break;
      case 'show_example':
        prompt += `The student wants a worked example. Provide:
- A clear problem statement
- Step-by-step solution with explanations
- Highlight the key technique used
- Then give them a similar question to try`;
        break;
      case 'practice_question':
        prompt += `Generate a practice question appropriate for Year ${yearGroup}${tier ? ` ${tier} tier` : ''}.
- Give the question clearly
- Wait for their answer before explaining
- Be ready to give hints if they struggle`;
        break;
      case 'check_answer':
        prompt += `The student wants help checking their answer.
- Ask them to share their answer and working
- Check their method as well as the final answer
- Point out where they went right/wrong
- If wrong, guide them to the correct approach`;
        break;
    }
  }

  prompt += `

## CURRENT SESSION INFO:
- Subject: ${subject}
- Year Group: ${yearGroup}
${tier ? `- Tier: ${tier}` : ''}
${objectiveTitle ? `- Objective: ${objectiveTitle}` : '- Objective: General help'}

Remember: You're a supportive tutor, not just an answer machine. Help them UNDERSTAND, not just get answers.`;

  return prompt;
}
