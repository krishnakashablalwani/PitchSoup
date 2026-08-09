"use server";

import { getSupabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function chatWithCoach(pitchId: string, history: { role: string, text: string }[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  
  const { data: pitch, error } = await (await getSupabase()).from('Pitch')
    .select('*')
    .eq('id', pitchId)
    .eq('userId', userId)
    .single();

  if (error || !pitch) throw new Error("Pitch not found");

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'coach' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  let systemPrompt = `You are an expert startup pitch coach.
The founder is preparing to pitch their startup called "${pitch.startupName}".
Problem: "${pitch.problem}"
Solution: "${pitch.solution}"
Target Market: "${pitch.targetMarket}"
Business Model: "${pitch.businessModel || 'N/A'}"
Traction: "${pitch.traction || 'N/A'}"
Ask: "${pitch.fundraisingAsk || 'N/A'}"

Your job is to answer their questions, provide advice, and help them prepare for investor meetings.
If they ask for potential questions investors might ask, give them realistic, tough questions based on their pitch details.
If they ask for feedback on an answer, provide constructive criticism.
Keep your responses concise, actionable, and encouraging.`;

  
  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am ready to coach the founder." }] },
      ...formattedHistory.slice(0, -1) 
    ]
  });

  const latestUserMessage = history[history.length - 1].text;
  const result = await chat.sendMessage(latestUserMessage);
  const response = await result.response;
  const text = response.text().trim();

  return text;
}
