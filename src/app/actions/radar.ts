"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
export async function analyzeConsistency(pitch: any) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const deckContent = typeof pitch.deckData === "string" ? pitch.deckData : JSON.stringify(pitch.deckData);

    const prompt = `You are a world-class venture capital analyst known for tearing apart pitch decks and finding logical inconsistencies.
    
Analyze this startup's pitch deck for consistency and business logic flaws.

Look for two things:
1. Inconsistencies: Mismatches between market size, pricing, revenue projections, and customer targets. Unsupported claims or completely unrealistic assumptions.
2. Logic Stress Tests: Identify the weakest assumptions in their business model and explain the cause-and-effect of why an investor would care.

Provide a strict JSON output matching this schema:
{
  "score": <number 0-100, representing overall consistency and realism>,
  "summary": "<2 sentence brutal summary of the main problem>",
  "issues": [
    {
      "id": "<unique string>",
      "title": "<Short title of the inconsistency>",
      "description": "<Detailed explanation of the contradiction or unrealistic claim>",
      "severity": "<high | medium | low>",
      "slideRef": "<Name of the slide where this is most apparent, e.g. 'Business Model'>",
      "suggestedFix": "<Actionable advice to fix the issue>"
    }
  ],
  "stressTests": [
    {
      "id": "<unique string>",
      "assumption": "<The weak assumption they are making>",
      "businessImpact": "<What happens if this assumption is wrong>",
      "investorConcern": "<Why an investor would reject them because of this>",
      "severity": "<high | medium | low>",
      "recommendedCorrection": "<Actionable concrete correction>"
    }
  ]
}

Startup Info:
Name: ${pitch.startupName}
Problem: ${pitch.problem}
Business Model: ${pitch.businessModel}
Traction: ${pitch.traction}

Deck Slides JSON:
${deckContent}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Consistency Radar Error:", error);
    return null;
  }
}
