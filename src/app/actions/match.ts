"use server";

import { generateContentWithFallback } from "@/lib/aiFallback";

export async function findInvestors(pitch: any) {
  try {
    const prompt = `
You are an expert VC matchmaker. 
Analyze the following startup pitch:
Name: ${pitch.startupName}
Problem: ${pitch.problem}
Solution: ${pitch.solution}
Market: ${pitch.targetMarket}
Business Model: ${pitch.businessModel}

Based on this, recommend exactly 3 REAL, world-famous Venture Capital firms (e.g. Sequoia, a16z, YC, Founders Fund) or prominent Angel Investors that would be a perfect match for this startup's thesis.
Act like a Crunchbase pro search. Provide accurate thesis information for these real firms.

Format the output strictly as a JSON array of objects with the following keys:
- name: (String) Name of the firm or investor
- type: (String, e.g., "Seed VC", "Angel", "Growth Equity")
- thesis: (String) A 1-sentence description of what they invest in
- whyMatch: (String) A 1-2 sentence explanation of why they specifically would love this startup
- typicalCheck: (String, e.g., "$500k - $2M")

Return ONLY the raw JSON array. Do not include markdown formatting like \`\`\`json.
`;

    const text = await generateContentWithFallback(prompt);
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Investor Match Error:", error);
    return [];
  }
}
