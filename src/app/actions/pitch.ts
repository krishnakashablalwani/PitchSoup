"use server";
import { getSupabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function createPitch(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const startupName = formData.get('startupName') as string;
  const problem = formData.get('problem') as string;
  const solution = formData.get('solution') as string;
  const targetMarket = formData.get('targetMarket') as string;
  const businessModel = formData.get('businessModel') as string;
  const traction = formData.get('traction') as string;

  let generatedDeckJson = null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      You are an expert Silicon Valley Venture Capitalist and pitch deck designer.
      I need you to generate a 10-slide pitch deck outline for my startup.
      
      Startup Name: ${startupName}
      Problem: ${problem}
      Solution: ${solution}
      Target Market: ${targetMarket}
      Business Model: ${businessModel}
      Traction/Validation: ${traction || "None yet"}

      
      Return ONLY a raw, valid JSON array (no markdown blocks, no text outside the JSON).
      The array should contain exactly 10 objects. Each object represents a slide and must have the following keys:
      - "title": The title of the slide (e.g. "The Problem", "The Solution", "Market Size")
      - "content": An array of 3-5 concise bullet points (strings) to display on the slide.
      - "speakerNotes": A paragraph of what the founder should actually say while presenting this slide.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const deckArray = JSON.parse(cleanText);
    generatedDeckJson = JSON.stringify(deckArray);
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    
  }

  const { data, error } = await (await getSupabase()).from('Pitch')
    .insert([{
      userId,
      startupName,
      problem,
      solution,
      targetMarket,
      businessModel,
      traction,
      deckData: generatedDeckJson
    }])
    .select()
    .single();

  if (error || !data) {
    console.error("Supabase Error: ", error);
    redirect(`/pitch/new?error=${encodeURIComponent(error?.message || 'Unknown Supabase error')}`);
  }

  redirect(`/deck/${data.id}`);
}
