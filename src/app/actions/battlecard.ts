"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateBattlecard(pitch: {
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
}, competitors: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
      "marketShare": "<rough estimate>"
    }
  ],
  "ourAdvantages": ["<string>", "<string>", "<string>"],
  "positioning": "<2-3 sentence positioning statement>",
  "talkingPoints": ["<objection handling point>", "<objection handling point>", "<objection handling point>"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Battlecard Error:", error);
    return null;
  }
}
