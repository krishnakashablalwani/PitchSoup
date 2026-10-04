import { getPitchesForUser } from "@/lib/mockPitch";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { MessageSquare, ArrowRight, Target, PlusCircle } from "lucide-react";

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

        {/* Pitches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pitches?.map((pitch) => (
            <Link
              href={`/simulator/${pitch.id}`}
              key={pitch.id}
              className="group bg-bg-floating border border-border-subtle rounded-2xl p-5 md:p-6 shadow-subtle hover:border-sienna-brown/40 hover:shadow-subtle-2 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-serif text-lg font-medium text-text-primary group-hover:text-sienna-brown dark:group-hover:text-blush-peach transition-colors line-clamp-1">
                    {pitch.startupName}
                  </h3>
                  <span className="bg-blush-peach/40 text-sienna-brown dark:text-blush-peach text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0">
                    Deck
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-3 mb-6 font-sans leading-relaxed">
                  {pitch.problem}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-border-subtle text-xs text-text-muted">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <Target className="w-3.5 h-3.5 text-sienna-brown shrink-0" />
                  <span className="truncate text-text-secondary text-[11px]">
                    {pitch.targetMarket || "General Market"}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-medium text-sienna-brown dark:text-blush-peach whitespace-nowrap group-hover:translate-x-0.5 transition-transform">
                  <span>Start Q&amp;A</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}

          {(!pitches || pitches.length === 0) && (
            <div className="col-span-full text-center py-16 px-6 bg-bg-floating border border-border-subtle rounded-2xl shadow-subtle flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-muted mb-3 border border-border-subtle">
                <MessageSquare className="w-6 h-6 text-sienna-brown" />
              </div>
              <h3 className="font-serif text-lg font-medium text-text-primary mb-1">
                No pitches cooked yet
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mb-4 font-sans">
                Create a pitch deck first, and then come back to simulate partner meetings with an AI coach.
              </p>
              <Link
                href="/pitch/new"
                className="px-4 py-2 bg-ink-black text-paper-white rounded-buttons text-xs font-medium flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blush-peach" />
                <span>Create Pitch Deck</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
