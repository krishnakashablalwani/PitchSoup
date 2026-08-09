import { supabase } from '@/lib/supabase';
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

    const { pitchId } = await req.json();
    if (!pitchId) {
      return NextResponse.json({ error: 'Pitch ID required' }, { status: 400 });
    }

    const { data: pitch, error: fetchError } = await supabase.from('Pitch')
      .select('*')
      .eq('id', pitchId)
      .eq('userId', userId)
      .single();

    if (fetchError || !pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 });
    }

    if (pitch.deckData) {
      return NextResponse.json(JSON.parse(pitch.deckData));
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest', generationConfig: { responseMimeType: "application/json" } });
    
    const prompt = `You are an expert Silicon Valley VC and pitch deck consultant.
Given a startup idea, output a JSON object representing exactly 8 pitch deck slides.
Return ONLY valid raw JSON without markdown formatting, code blocks, or triple backticks.

IMPORTANT: Do not use placeholders like "Gemini generating breakdown...". You MUST generate realistic, thoughtful content, numbers, and actionable insights based on the provided inputs. If estimating a market size (TAM/SAM/SOM) or financial projections, provide actual estimated dollar amounts and demographics.

Input Idea:
Startup Name: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Target Market: ${pitch.targetMarket}

Schema:
{
  "startupName": "string",
  "oneLiner": "string",
  "slides": [
    {
      "slideNumber": number,
      "title": "string",
      "headline": "string",
      "bulletPoints": ["string"],
      "keyMetricOrTip": "string"
    }
  ]
}

Slide structure:
1. Title & One-Liner
2. The Problem
3. The Solution
4. Market Opportunity (TAM/SAM/SOM)
5. Competitor Matrix (Identify 3 real/hypothetical competitors and explain your unfair advantage)
6. Business Model & Traction Strategy
7. 3-Year Financial Projections (ARR, CAC, LTV estimates)
8. Unfair Advantage / Moat & The Ask
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse to ensure it's valid JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Cleanup backticks if any
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Save to DB
    const { error: updateError } = await supabase.from('Pitch')
      .update({ deckData: JSON.stringify(parsedData) })
      .eq('id', pitch.id);

    if (updateError) {
      console.error('Error saving deck to DB:', updateError);
    }

    return NextResponse.json(parsedData);
  } catch (error: unknown) {
    console.error('Error generating deck:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
