import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { teacherAgentService } from '@/lib/teacherAgentService';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildSystemPrompt(context: any) {
  return `You are Nova Teacher Copilot (Student Nova Agent).\n\nYou are assisting a teacher about ONE student.\n\nCRITICAL RULES:\n- Be operational and evidence-based.\n- Use the provided Student Context Packet JSON as the source of truth.\n- If data is missing, say what's missing and give best-effort guidance.\n- Provide recommended next actions with specific objectives.\n- Be concise: headings + bullets.\n\nOutput format:\n## Summary\n## Weakest areas right now\n## What changed (7d vs 30d)\n## Likely cause (knowledge gap vs confidence vs low activity)\n## Recommended next actions (3)\n## Suggested assignment\n## Parent/guardian summary\n## Evidence\n\nStudent Context Packet JSON:\n${JSON.stringify(context, null, 2)}\n`;
}

function fallbackResponse(context: any, teacherMessage: string) {
  const studentName = context?.student?.name || 'the student';
  const weakest = (context?.mastery?.weakestObjectives || []).slice(0, 3).map((o: any) => `${o.subject}: ${o.title}`);
  const evidence = (context?.evidence || []).map((e: any) => `- ${e.label}: ${e.value}`).join('\n');
  return `## Summary\n${studentName} has a mix of developing and not-started objectives. Current data is mocked; connect real logs for accuracy.\n\n## Weakest areas right now\n${weakest.length ? weakest.map((w: string) => `- ${w}`).join('\n') : '- No weakest objectives available yet.'}\n\n## What changed (7d vs 30d)\n- Trend: ${context?.performance?.trend || 'unknown'} (no accuracy rollups yet)\n\n## Likely cause (knowledge gap vs confidence vs low activity)\n- Most likely: low evidence available. Recommend short diagnostic + consistent practice routine.\n\n## Recommended next actions (3)\n- Assign a 10-minute practice set on the weakest objective.\n- Ask for working steps on 2–3 questions to identify misconception vs careless errors.\n- Set a routine: 3 short sessions/week.\n\n## Suggested assignment\n- Next objective: ${context?.mastery?.byStrand?.[0]?.nextObjectiveTitle || 'Choose the next objective in the weakest strand'}\n\n## Parent/guardian summary\n${studentName} is making progress but needs more consistent practice on a small set of core skills. We will focus on one objective at a time, check understanding with short quizzes, and build confidence through worked examples and targeted practice.\n\n## Evidence\n${evidence || '- No evidence yet.'}\n`;
}

export async function POST(request: NextRequest) {
  try {
    const { scope, message, history } = await request.json();
    const context = teacherAgentService.buildStudentContextPacket(scope);

    // If no API key, return deterministic fallback.
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ response: fallbackResponse(context, message) });
    }

    const system = buildSystemPrompt(context);
    const claudeMessages =
      (history || []).map((m: any) => ({
        role: m.role === 'teacher' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })) || [];

    claudeMessages.push({ role: 'user' as const, content: message });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1200,
      system,
      messages: claudeMessages,
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ response: reply });
  } catch (error: any) {
    return NextResponse.json(
      {
        response: 'Student Nova Agent is unavailable right now.',
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

