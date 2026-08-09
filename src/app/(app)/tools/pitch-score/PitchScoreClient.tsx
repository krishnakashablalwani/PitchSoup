"use client";

import { useState } from "react";
import { scorePitch } from "@/app/actions/score";

type Pitch = { id: string; startupName: string; problem: string; solution: string; targetMarket: string };
type Dimension = { name: string; score: number; justification: string; tip: string };
type ScoreResult = { overallScore: number; dimensions: Dimension[]; summary: string };

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
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-destructive";
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <div className="space-y-8">
      {/* Pitch Selector */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Select a pitch to score</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pitches.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPitch(p)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selectedPitch?.id === p.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/30 bg-foreground/5"
              }`}
            >
              <p className="font-bold truncate">{p.startupName}</p>
              <p className="text-xs text-muted-foreground truncate mt-1">{p.problem}</p>
            </button>
          ))}
        </div>
        {pitches.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No pitches yet. Create one first!</p>
        )}
        <button
          onClick={handleScore}
          disabled={!selectedPitch || loading}
          className="mt-4 w-full bg-primary text-black font-bold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              Score This Pitch
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6" id="score-results">
          {/* Overall Score */}
          <div className="glass-panel rounded-3xl p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Overall Score</p>
            <div className={`text-7xl font-headline-xl font-bold ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}<span className="text-2xl text-muted-foreground">/10</span>
            </div>
            <p className="text-foreground/80 font-body-md mt-4 max-w-lg mx-auto">{result.summary}</p>
          </div>

          {/* Dimension Breakdown */}
          <div className="glass-panel rounded-3xl p-8">
            <h3 className="text-xl font-headline-md font-semibold mb-6">Dimension Breakdown</h3>
            <div className="space-y-6">
              {result.dimensions.map((dim, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold font-body-md">{dim.name}</span>
                    <span className={`font-mono-data font-bold text-lg ${getScoreColor(dim.score)}`}>{dim.score}/10</span>
                  </div>
                  <div className="w-full bg-foreground/10 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all ${getBarColor(dim.score)}`} style={{ width: `${dim.score * 10}%` }} />
                  </div>
                  <p className="text-sm text-foreground/70">{dim.justification}</p>
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">lightbulb</span>
                    <p className="text-sm font-body-md text-foreground/80">{dim.tip}</p>
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
