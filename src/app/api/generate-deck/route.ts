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
      .in('userId', [userId, 'all-users'])
      .single();

    if (fetchError || !pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 });
    }

    if (pitch.deckData) {
      return NextResponse.json(JSON.parse(pitch.deckData));
    }

    // Call Gemini with Google Search Grounding for live data
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', 
      tools: [{ googleSearchRetrieval: {} }],
      generationConfig: { responseMimeType: "application/json" } 
    });
    
    const prompt = `You are an expert Silicon Valley VC and pitch deck consultant.
Given a startup idea, output a JSON object representing exactly 12 pitch deck slides.
Return ONLY valid raw JSON without markdown formatting, code blocks, or triple backticks.

IMPORTANT FOR LIVE DATA: You MUST use your Google Search tool to look up real-time, accurate market sizing data (US Census, Statista, World Bank, SEC filings) for this specific industry. Do not guess the TAM/SAM/SOM. Use real dollar amounts and cite the specific source/year in the speakerNotes for the market size slide.

Input Idea:
Startup Name: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Target Market: ${pitch.targetMarket}

Schema:
[
  {
    "title": "string",
    "content": ["string"],
    "speakerNotes": "string",
    "visualType": "image | chart",
    "unsplashKeywords": "string (1-2 highly relevant keywords for searching Unsplash stock photos, e.g., 'business,growth' or 'laptop,office'. ONLY if visualType is image)",
    "chartData": [{"name": "string", "value": 100}] // ONLY if visualType is chart (use for TAM/SAM/SOM, financials, etc.)
  }
]

Ensure the array contains exactly 12 slide objects, covering ALL of the following topics comprehensively in a logical order:
1. Title & One-Liner
2. The Problem
3. The Solution
4. Key Features & Capabilities
5. Market Size & Demographics (TAM/SAM/SOM)
6. Go-To-Market (GTM) & Sales Strategy
7. Research, Feasibility & Technical Viability (Why now? Is it possible?)
8. Business Model & Pricing
9. Competitive Analysis (Competitors vs Us)
10. 3-Year Financial Projections (ARR, CAC, LTV)
11. Traction & Roadmap
12. Unfair Advantage / Moat & The Ask (Funding needed)
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
