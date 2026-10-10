"use server";
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { generateContentWithFallback } from '@/lib/aiFallback';


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

  const features = formData.get('features') as string;

  let generatedDeckJson = null;

  try {
    const prompt = `
      You are an expert Silicon Valley Venture Capitalist and pitch deck designer.
      I need you to generate a comprehensive 12-slide pitch deck for my startup.
      
      Startup Name: ${startupName}
      Problem: ${problem}
      Solution: ${solution}
      Features & Capabilities: ${features || "Not explicitly specified, deduce from solution"}
      Target Market: ${targetMarket}
      Business Model (Pricing): ${businessModel}
      Traction/Validation: ${traction || "None yet"}

      Return ONLY a raw, valid JSON array (no markdown blocks, no text outside the JSON).
      The array should contain exactly 12 objects. Each object represents a slide and must have the following keys:
      - "title": The title of the slide.
      - "content": An array of 3-5 concise bullet points (strings) to display on the slide.
      - "speakerNotes": A paragraph of what the founder should actually say while presenting this slide.
      - "graphicsSuggestion": A short description of a chart, graph, diagram, or image that should accompany this slide.

      Ensure the slides cover ALL of the following topics comprehensively in a logical order:
      1. Title & One-Liner
      2. The Problem
      3. The Solution
      4. Key Features & Capabilities
      5. Market Size & Demographics (TAM/SAM/SOM)
      6. Go-To-Market (GTM) & Sales Strategy
      7. Research, Feasibility & Technical Viability (Why now? Is it possible?)
      8. Business Model & Pricing
      9. Competitive Analysis (Competitors vs Us)
      10. 3-Year Financial Projections (ARR, CAC, LTV)
      11. Traction & Roadmap
      12. Unfair Advantage / Moat & The Ask (Funding needed)
    `;

    const text = await generateContentWithFallback(prompt);
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const deckArray = JSON.parse(cleanText);
    generatedDeckJson = JSON.stringify(deckArray);
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    
  }

  const { data, error } = await supabase.from('Pitch')
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

export async function createPitchFromBrainDump(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const braindump = formData.get('braindump') as string;
  let generatedDeckJson = null;
  let redirectUrl: string | null = null;

  try {
    const prompt = `
      You are an expert Silicon Valley Venture Capitalist and pitch deck designer.
      I have a rough "brain dump" from a founder. I need you to generate a comprehensive 12-slide pitch deck from it.
      If any information is missing (like pricing or target market), infer it logically based on the idea.
      
      Founder's Brain Dump:
      "${braindump}"

      Return ONLY a raw, valid JSON array (no markdown blocks, no text outside the JSON).
      The array should contain exactly 12 objects. Each object represents a slide and must have the following keys:
      - "title": The title of the slide.
      - "content": An array of 3-5 concise bullet points (strings) to display on the slide.
      - "speakerNotes": A paragraph of what the founder should actually say while presenting this slide.
      - "graphicsSuggestion": A short description of a chart, graph, diagram, or image that should accompany this slide.

      Ensure the slides cover ALL of the following topics comprehensively in a logical order:
      1. Title & One-Liner (Make up a catchy name if they didn't provide one)
      2. The Problem
      3. The Solution
      4. Key Features & Capabilities
      5. Market Size & Demographics (TAM/SAM/SOM)
      6. Go-To-Market (GTM) & Sales Strategy
      7. Research, Feasibility & Technical Viability
      8. Business Model & Pricing
      9. Competitive Analysis
      10. 3-Year Financial Projections
      11. Traction & Roadmap
      12. Unfair Advantage & The Ask
    `;

    const text = await generateContentWithFallback(prompt);
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const deckArray = JSON.parse(cleanText);
    generatedDeckJson = JSON.stringify(deckArray);
    
    const startupName = deckArray[0].title.replace("Pitch Deck", "").trim() || "My Startup";
    const problem = deckArray[1].content.join(" ");
    const solution = deckArray[2].content.join(" ");

    const { data, error } = await supabase.from('Pitch')
      .insert([{
        userId,
        startupName,
        problem,
        solution,
        targetMarket: "Extracted from braindump",
        businessModel: "Extracted from braindump",
        traction: "Extracted from braindump",
        deckData: generatedDeckJson
      }])
      .select()
      .single();

    if (error || !data) {
      console.error("Supabase Error: ", error);
      redirectUrl = `/pitch/new?error=${encodeURIComponent(error?.message || 'Unknown Supabase error')}`;
    } else {
      redirectUrl = `/deck/${data.id}`;
    }

  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    redirectUrl = `/pitch/new?error=${encodeURIComponent(err?.message || 'Failed to generate deck from braindump')}`;
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}

