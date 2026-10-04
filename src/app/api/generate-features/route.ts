import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problem, solution, startupName } = await req.json();
    if (!problem) {
      return NextResponse.json({ error: 'Problem description required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `You are an expert product manager and startup consultant. 
The user is trying to build a pitch deck for their startup but needs help brainstorming features.
Startup Name: ${startupName || 'Unknown'}
Problem they are solving: ${problem}
Proposed Solution (if any): ${solution || 'None yet'}

Based on this, suggest 5-7 concrete, killer product features that would make this a winning startup.
Format the output as a simple, comma-separated list of features, or a numbered list. Keep it concise, actionable, and ready to be pasted into a pitch deck form. Do not include markdown formatting like bold text or headers, just plain text bullets.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return NextResponse.json({ features: text });
  } catch (error: unknown) {
    console.error('Error generating features:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
