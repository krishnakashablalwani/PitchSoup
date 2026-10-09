"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateElevatorPitch(pitch: {
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel?: string;
  traction?: string;
  fundraisingAsk?: string;
  deckData?: any;
}) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a world-class startup communications coach (having coached founders for Y Combinator Demo Days, TechCrunch Disrupt Battlefield, and major seed fundraises).

Generate a comprehensive set of verbal pitch scripts for this startup:
- Startup Name: ${pitch.startupName}
- The Problem: ${pitch.problem}
- The Solution: ${pitch.solution}
- Target Market: ${pitch.targetMarket}
- Business Model: ${pitch.businessModel || "B2B / SaaS"}
- Traction: ${pitch.traction || "Early customer validation"}
- Ask: ${pitch.fundraisingAsk || "Raising seed funding"}

Here is the exact pitch deck they created (use this for deeper context, facts, and figures):
${typeof pitch.deckData === 'string' ? pitch.deckData : JSON.stringify(pitch.deckData || {})}

Craft 4 verbal delivery scripts tailored for different real-world situations:
1. "cocktailHook" (~10 seconds / 1-2 punchy sentences): The conversational hook when someone asks "What are you working on?" at a mixer. Zero buzzwords, clear metaphor.
2. "elevator30s" (~30 seconds / ~70 words): Tight elevator ride pitch covering the massive pain point, your secret insight, and who pays.
3. "speedPitch60s" (~60 seconds / ~140 words): Speed dating / angel investor pitch covering Problem, Solution, Traction, Market, and The Ask.
4. "demoDayScript2Min" (~2 minutes / ~280 words): Full theatrical stage presentation with embedded bracketed performance directions such as [Pause for effect], [Advance to slide 2], [Deliver punchline], [Point to traction].
5. "keyTalkingPoints": 4 bullet points that are essential to memorize.

Return ONLY a raw JSON object (no markdown formatting, no code fences):
{
  "cocktailHook": "<10-second script>",
  "elevator30s": "<30-second script>",
  "speedPitch60s": "<60-second script>",
  "demoDayScript2Min": "<2-minute stage script with bracketed stage directions>",
  "keyTalkingPoints": [
    "<point 1>",
    "<point 2>",
    "<point 3>",
    "<point 4>"
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Elevator Pitch Generation Error:", error);
    return null;
  }
}
