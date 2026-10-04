import { getPitchById, DEMO_PITCH_SLIDES } from '@/lib/mockPitch';
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

  const pitch = await getPitchById(id);

  if (!pitch) {
    notFound();
  }

  let parsedDeck = [];
  try {
    if (pitch.deckData) {
      parsedDeck = typeof pitch.deckData === 'string' ? JSON.parse(pitch.deckData) : pitch.deckData;
    }
  } catch (e) {
    console.error("Failed to parse deck data", e);
  }

  if (!parsedDeck || parsedDeck.length === 0) {
    parsedDeck = DEMO_PITCH_SLIDES;
  }

  return (
    <DeckClient pitch={pitch} deckData={parsedDeck} />
  );
}
