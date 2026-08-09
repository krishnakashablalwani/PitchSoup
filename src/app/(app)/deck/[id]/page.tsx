import { supabase } from '@/lib/supabase';
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import DeckClient from "./DeckClient";

export const dynamic = 'force-dynamic';


export default async function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const { data: pitch, error } = await supabase.from('Pitch')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !pitch) {
    notFound();
  }

  let parsedDeck = [];
  try {
    if (pitch.deckData) {
      parsedDeck = JSON.parse(pitch.deckData);
    }
  } catch (e) {
    console.error("Failed to parse deck data", e);
  }

  return (
    <DeckClient pitch={pitch} deckData={parsedDeck} />
  );
}
