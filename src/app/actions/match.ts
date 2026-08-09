"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function findInvestors(pitch: any) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert VC matchmaker. 
Analyze the following startup pitch:
Name: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Market: ${pitch.targetMarket}
Business Model: ${pitch.businessModel}

Based on this, recommend exactly 3 highly relevant fictional or archetypal Venture Capital firms or Angel Investors that would be a perfect match for this startup.

Format the output strictly as a JSON array of objects with the following keys:
- name: (String) Name of the firm or investor
- type: (String, e.g., "Seed VC", "Angel", "Growth Equity")
- thesis: (String) A 1-sentence description of what they invest in
- whyMatch: (String) A 1-2 sentence explanation of why they specifically would love this startup
- typicalCheck: (String, e.g., "$500k - $2M")

Return ONLY the raw JSON array. Do not include markdown formatting like \`\`\`json.
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Investor Match Error:", error);
    throw new Error("Failed to generate investor matches.");
  }
}
