"use server";

import { generateContentWithFallback } from "@/lib/aiFallback";

export async function estimateHoursSaved(pitches: any[]) {
  if (!pitches || pitches.length === 0) return 0;

  try {
    const pitchSummaries = pitches.map((p: any) => 
      `Startup: ${p.startupName}, Problem: ${p.problem}, Market: ${p.targetMarket}`
    ).join("\n\n");

    const prompt = `Based on the following startup pitches, estimate the total number of manual hours saved by using AI to generate their pitch decks, battlecards, and elevator pitches. 
    
    Pitches:
    ${pitchSummaries}
    
    Consider that a typical founder might spend anywhere from 40 to 120 hours on narrative discovery, market sizing, financial modeling, and slide formatting for a single deck. 
    Provide a realistic, dynamic estimate of total hours saved across all these projects combined.
    
    Return ONLY a single integer representing the total hours saved.`;

    const text = await generateContentWithFallback(prompt);
    
    const parsed = parseInt(text.replace(/[^0-9]/g, ""), 10);
    return isNaN(parsed) ? pitches.length * 85 : parsed; // fallback
  } catch (error) {
    console.error("Error estimating hours saved:", error);
    return pitches.length * 85; // fallback
  }
}
