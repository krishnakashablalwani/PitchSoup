"use server";

import { getPitchById } from '@/lib/mockPitch';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

export async function chatWithCoach(pitchId: string, history: { role: string, text: string }[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const pitch = await getPitchById(pitchId);
    if (!pitch) throw new Error("Pitch not found.");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    let systemPrompt = `You are a skeptical Tier-1 Venture Capitalist grilling a founder.
The startup is "${pitch.startupName}".
Problem: "${pitch.problem}"
Solution: "${pitch.solution}"
Traction: "${pitch.traction || 'N/A'}"
Deck Data: ${pitch.deckData ? JSON.stringify(pitch.deckData) : 'N/A'}

Your Goal:
1. If the founder asks to start or asks for a question, look at the Deck Data and Ask ONE highly specific, difficult question challenging their weakest assumption, revenue projection, or competitive moat.
2. When the founder answers, you must first SCORE their answer. Output your feedback in this format:
   [Score: X/10]
   [Relevance: X/10, Clarity: X/10, Evidence: X/10]
   Feedback: <Identify which part of the deck supports them and what evidence is completely missing from their answer.>
   Next Question: <Increase the difficulty based on their answer and ask another highly specific question about the deck>

Do not break character. Do not be overly nice. Demand evidence. Never ask generic questions. Always reference their specific numbers, market, or claims from the Deck Data.`;

    let text = "";

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const formattedHistory = history.map(msg => ({
        role: msg.role === 'coach' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I will act as a skeptical VC, score answers rigorously, demand evidence based on the deck, and ask increasingly difficult questions." }] },
          ...formattedHistory.slice(0, -1) 
        ]
      });

      const latestUserMessage = history[history.length - 1].text;
      const result = await chat.sendMessage(latestUserMessage);
      const response = await result.response;
      text = response.text().trim();
    } catch (aiError: any) {
      const errorStr = String(aiError).toLowerCase();
      if (
        aiError.status === 503 ||
        aiError.status === 429 ||
        errorStr.includes("503") ||
        errorStr.includes("429") ||
        errorStr.includes("overloaded") ||
        errorStr.includes("unavailable") ||
        errorStr.includes("too many requests") ||
        errorStr.includes("quota exceeded")
      ) {
        console.log("Gemini error (503/429/Quota), falling back to Groq...");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        const groqHistory = history.map(msg => ({
          role: msg.role === 'coach' ? 'assistant' as const : 'user' as const,
          content: msg.text
        }));

        const messages = [
          { role: "system" as const, content: systemPrompt },
          { role: "assistant" as const, content: "Understood. I will act as a skeptical VC, score answers rigorously, demand evidence based on the deck, and ask increasingly difficult questions." },
          ...groqHistory
        ];

        const chatCompletion = await groq.chat.completions.create({
          messages: messages,
          model: "openai/gpt-oss-120b",
          max_tokens: 8192,
        });

        text = chatCompletion.choices[0]?.message?.content?.trim() || "";
      } else {
        throw aiError;
      }
    }

    return text;
  } catch (error: any) {
    console.error("Simulator Error:", error);
    return `[SERVER_ERROR]: ${error.message || String(error)}`;
  }
}
