"use server";

import { generateContentWithFallback } from "@/lib/aiFallback";

export async function generateBattlecard(pitch: {
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
}, competitors: string) {

  const prompt = `You are a competitive intelligence analyst for a startup.

Our Startup: ${pitch.startupName}
Our Problem: ${pitch.problem}
Our Solution: ${pitch.solution}
Our Market: ${pitch.targetMarket}
Competitors: ${competitors}

Generate a competitive battlecard. Return ONLY a raw JSON object (no markdown):
{
  "competitors": [
    {
      "name": "<competitor name>",
      "strengths": ["<string>", "<string>"],
      "weaknesses": ["<string>", "<string>"],
      "pricing": "<estimated pricing model>",
      "marketShare": "<short percentage or 1-2 words estimate>"
    }
  ],
  "ourAdvantages": ["<string>", "<string>", "<string>"],
  "positioning": "<2-3 sentence positioning statement>",
  "talkingPoints": ["<objection handling point>", "<objection handling point>", "<objection handling point>"]
}`;

  try {
    const text = await generateContentWithFallback(prompt);
    const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Battlecard Error:", error);
    return null;
  }
}
