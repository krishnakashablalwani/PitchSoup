import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AnalyticsClient from "./AnalyticsClient";
import { LineChart } from "lucide-react";

import { getPitchesForUser } from "@/lib/mockPitch";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const pitches = await getPitchesForUser(userId);

  return (
    <div className="flex-1 min-h-screen bg-bg-primary text-text-primary p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-border-subtle pb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sienna-brown/10 text-sienna-brown flex items-center justify-center shrink-0">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl text-text-primary font-medium tracking-tight">
              Feedback & Efficiency Analysis
            </h1>
            <p className="text-text-secondary text-sm mt-1 font-sans">
              Track your pitch preparation velocity, AI VC feedback scores, and workflow efficiency.
            </p>
          </div>
        </header>

        <AnalyticsClient pitches={pitches} />
      </div>
    </div>
  );
}
