import { getPitchesForUser } from "@/lib/mockPitch";
import { auth } from "@clerk/nextjs/server";
import { MessageSquare } from "lucide-react";
import SimulatorClient from "./SimulatorClient";

export const dynamic = "force-dynamic";

export default async function SimulatorIndexPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const pitches = await getPitchesForUser(userId);

  return (
    <div className="flex-1 min-h-screen bg-bg-primary text-text-primary p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* Editorial Header */}
        <header className="border-b border-border-subtle pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-peach/40 text-sienna-brown flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-text-primary font-medium tracking-tight">
                Pitch Q&amp;A Simulator
              </h1>
              <p className="text-text-secondary text-sm mt-0.5 font-sans">
                Select a pitch deck to practice investor questions and pressure-test your responses with an AI VC coach.
              </p>
            </div>
          </div>
        </header>

        <SimulatorClient pitches={pitches} />
      </div>
    </div>
  );
}
