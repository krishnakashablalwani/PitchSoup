"use client";

import { useState } from "react";
import { scorePitch } from "@/app/actions/score";
import { Award, Sparkles, Loader2, Lightbulb, CheckCircle2 } from "lucide-react";

type Pitch = {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
};
type Dimension = {
  name: string;
  score: number;
  justification: string;
  tip: string;
};
type ScoreResult = {
  overallScore: number;
  dimensions: Dimension[];
  summary: string;
};

export default function PitchScoreClient({ pitches }: { pitches: Pitch[] }) {
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScore = async () => {
    if (!selectedPitch) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await scorePitch(selectedPitch);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 6) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return "bg-emerald-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-6">
      {/* Pitch Selector */}
      <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-base font-medium text-text-primary">
              1. Select Pitch Deck to Score
            </h3>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            10-Point VC Rubric
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {pitches.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPitch(p);
                setResult(null);
              }}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedPitch?.id === p.id
                  ? "border-sienna-brown/60 bg-blush-peach/25 shadow-xs"
                  : "border-border-subtle bg-bg-secondary hover:bg-bg-card"
              }`}
            >
              <p className="font-serif text-sm font-medium text-text-primary truncate">
                {p.startupName}
              </p>
              <p className="text-xs text-text-secondary truncate mt-1">
                {p.problem}
              </p>
            </button>
          ))}
        </div>

        {pitches.length === 0 && (
          <p className="text-xs text-text-secondary text-center py-6">
            No pitches found. Create your first deck to generate a scorecard!
          </p>
        )}

        <button
          onClick={handleScore}
          disabled={!selectedPitch || loading}
          className="w-full bg-ink-black text-paper-white rounded-buttons text-sm font-medium py-3.5 px-6 shadow-subtle hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blush-peach" />
              <span>Analyzing Pitch Metrics with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blush-peach" />
              <span>Score This Pitch</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6" id="score-results">
          {/* Overall Score Card */}
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 md:p-8 shadow-subtle text-center space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted block">
              Composite VC Score
            </span>
            <div
              className={`text-6xl md:text-7xl font-mono font-black ${getScoreColor(
                result.overallScore
              )}`}
            >
              {result.overallScore}
              <span className="text-2xl text-text-muted font-normal font-sans">
                /10
              </span>
            </div>
            <p className="text-xs md:text-sm text-text-secondary max-w-lg mx-auto font-sans leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Dimension Breakdown */}
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 md:p-8 shadow-subtle space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
              <CheckCircle2 className="w-4 h-4 text-sienna-brown" />
              <h3 className="font-serif text-base font-medium text-text-primary">
                Dimension Breakdown
              </h3>
            </div>

            <div className="space-y-6">
              {result.dimensions.map((dim, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">
                      {dim.name}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${getScoreColor(
                        dim.score
                      )}`}
                    >
                      {dim.score}/10
                    </span>
                  </div>

                  <div className="w-full bg-bg-secondary rounded-full h-2 overflow-hidden border border-border-subtle">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getBarColor(
                        dim.score
                      )}`}
                      style={{ width: `${dim.score * 10}%` }}
                    />
                  </div>

                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    {dim.justification}
                  </p>

                  <div className="flex items-start gap-2 bg-blush-peach/20 border border-sienna-brown/20 rounded-xl p-3">
                    <Lightbulb className="w-3.5 h-3.5 text-sienna-brown shrink-0 mt-0.5" />
                    <p className="text-xs text-text-primary font-sans leading-relaxed">
                      {dim.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
