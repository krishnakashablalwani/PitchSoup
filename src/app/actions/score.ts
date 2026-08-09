"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function scorePitch(pitch: {
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a top-tier Silicon Valley VC evaluating a startup pitch.

Startup: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Target Market: ${pitch.targetMarket}

Score this pitch across these 6 dimensions on a scale of 1-10. Also provide a short 1-2 sentence justification and an actionable improvement tip for each dimension.

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "overallScore": <number>,
  "dimensions": [
    { "name": "Problem Clarity", "score": <number>, "justification": "<string>", "tip": "<string>" },
    { "name": "Solution Fit", "score": <number>, "justification": "<string>", "tip": "<string>" },
    { "name": "Market Size", "score": <number>, "justification": "<string>", "tip": "<string>" },
    { "name": "Differentiation", "score": <number>, "justification": "<string>", "tip": "<string>" },
    { "name": "Scalability", "score": <number>, "justification": "<string>", "tip": "<string>" },
    { "name": "Pitch Quality", "score": <number>, "justification": "<string>", "tip": "<string>" }
  ],
  "summary": "<2-3 sentence overall assessment>"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleanText);
}
