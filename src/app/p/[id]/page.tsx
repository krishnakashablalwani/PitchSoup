import { getPitchById, DEMO_PITCH_SLIDES } from "@/lib/mockPitch";
import { notFound } from "next/navigation";
import PublicPitchViewer from "./PublicPitchViewer";

export const dynamic = "force-dynamic";

export default async function PublicPitchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pitch = await getPitchById(id);

  if (!pitch) {
    notFound();
  }

  let parsedDeck = [];
  try {
    if (pitch.deckData) {
      parsedDeck =
        typeof pitch.deckData === "string"
          ? JSON.parse(pitch.deckData)
          : pitch.deckData;
    }
  } catch (e) {
    console.error("Failed to parse deckData", e);
  }

  if (!parsedDeck || parsedDeck.length === 0) {
    parsedDeck = DEMO_PITCH_SLIDES;
  }

  return <PublicPitchViewer pitch={pitch} slides={parsedDeck} />;
}
