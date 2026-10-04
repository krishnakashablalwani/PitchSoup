import PitchForm from "./PitchForm";
import { Sparkles } from "lucide-react";

export const maxDuration = 60;

export default async function NewPitchPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex-1 min-h-screen bg-bg-primary text-text-primary p-6 md:p-10 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Editorial Header */}
        <header className="border-b border-border-subtle pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-peach/40 text-sienna-brown flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-text-primary font-medium tracking-tight">
                Cook New Pitch
              </h1>
              <p className="text-text-secondary text-sm mt-0.5 font-sans">
                Provide your core startup details, and we will generate a compelling 10-slide VC deck.
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-medium">
            Database Error: {error}
          </div>
        )}

        <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 md:p-8 shadow-subtle">
          <PitchForm />
        </div>
      </div>
    </div>
  );
}
