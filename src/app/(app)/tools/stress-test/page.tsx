import { getPitchesForUser } from "@/lib/mockPitch";
import { auth } from "@clerk/nextjs/server";
import StressTestTabsClient from "./StressTestTabsClient";
import { Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StressTestPage({
  searchParams,
}: {
  searchParams: Promise<{ pitchId?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [pitches, resolvedParams] = await Promise.all([
    getPitchesForUser(userId),
    searchParams,
  ]);

  return (
    <div className="flex-1 min-h-screen bg-bg-primary text-text-primary p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* Editorial Header */}
        <header className="border-b border-border-subtle pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-peach/40 text-sienna-brown flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-text-primary font-medium tracking-tight">
                VC Stress Test
              </h1>
              <p className="text-text-secondary text-sm mt-0.5 font-sans">
                Receive an objective scorecard and build competitive battlecards for your pitch.
              </p>
            </div>
          </div>
        </header>

        <StressTestTabsClient
          pitches={pitches || []}
          initialPitchId={resolvedParams.pitchId}
        />
      </div>
    </div>
  );
}
