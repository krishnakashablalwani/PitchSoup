import { getSupabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pitchId, targetVC } = await req.json();
    if (!pitchId || !targetVC) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { data: pitch, error: fetchError } = await (await getSupabase()).from('Pitch')
      .select('*')
      .eq('id', pitchId)
      .eq('userId', userId)
      .single();

    if (fetchError || !pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    
    const prompt = `You are an expert startup founder writing a highly effective, concise cold email to a VC.
Draft a cold email to ${targetVC} pitching this startup.

Startup Name: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Target Market: ${pitch.targetMarket}

Guidelines:
1. Subject line should be catchy and include the startup name.
2. Keep it under 150 words.
3. Be confident but not arrogant.
4. Include a clear call to action (Ask for a 15-minute chat).
5. Output ONLY the email text (Subject and Body).`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ email: responseText });
  } catch (error: unknown) {
    console.error('Error generating email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
