"use client";

import { useState } from "react";
import { generateBattlecard } from "@/app/actions/battlecard";
import { motion } from "framer-motion";
import {
  Shield,
  Swords,
  Target,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

type Pitch = {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
};
type Competitor = {
  name: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  marketShare: string;
};
type BattlecardResult = {
  competitors: Competitor[];
  ourAdvantages: string[];
  positioning: string;
  talkingPoints: string[];
};

export default function BattlecardClient({ pitches }: { pitches: Pitch[] }) {
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [competitorNames, setCompetitorNames] = useState("");
  const [result, setResult] = useState<BattlecardResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedPitch || !competitorNames.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateBattlecard(selectedPitch, competitorNames);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Setup Card */}
      <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sienna-brown" />
            <h3 className="font-serif text-base font-medium text-text-primary">
              1. Select Your Pitch Deck
            </h3>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Competitive Moat Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {pitches.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPitch(p)}
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
                {p.targetMarket || "Target Market"}
              </p>
            </button>
          ))}
        </div>

        {pitches.length === 0 && (
          <p className="text-xs text-text-secondary text-center py-6">
            No pitches found. Create your first deck to generate battlecards!
          </p>
        )}

        <div className="pt-2 space-y-1.5">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
            2. Name Your Main Competitors
          </label>
          <input
            value={competitorNames}
            onChange={(e) => setCompetitorNames(e.target.value)}
            className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans"
            placeholder="e.g. Stripe, Adyen, PayPal"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedPitch || !competitorNames.trim() || loading}
          className="w-full bg-ink-black text-paper-white rounded-buttons text-sm font-medium py-3.5 px-6 shadow-subtle hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blush-peach" />
              <span>Analyzing Competitor Moats &amp; Intel...</span>
            </>
          ) : (
            <>
              <Swords className="w-4 h-4 text-blush-peach" />
              <span>Generate Executive Battlecard</span>
            </>
          )}
        </button>
      </div>

      {/* Battlecard Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Banner */}
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block">
                Competitive Landscape
              </span>
              <h3 className="font-serif text-xl font-medium text-text-primary mt-0.5">
                {selectedPitch?.startupName} vs. Market Incumbents
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blush-peach/40 text-sienna-brown text-xs font-semibold rounded-lg border border-sienna-brown/20">
                {selectedPitch?.startupName} (You)
              </span>
              <span className="text-xs font-mono text-text-muted">VS</span>
              <span className="px-3 py-1 bg-bg-secondary text-text-secondary text-xs font-semibold rounded-lg border border-border-subtle">
                {competitorNames}
              </span>
            </div>
          </div>

          {/* 2-Column Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Our Startup Card */}
            <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sienna-brown" />
                  <h4 className="font-serif text-lg font-medium text-text-primary">
                    {selectedPitch?.startupName}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-sienna-brown dark:text-blush-peach font-semibold bg-blush-peach/30 px-2 py-0.5 rounded-full">
                  Our Wedge
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Moats &amp; Advantages
                  </p>
                  <ul className="space-y-2">
                    {result.ourAdvantages.map((adv, j) => (
                      <li
                        key={j}
                        className="text-xs text-text-primary font-sans leading-relaxed flex items-start gap-2 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20"
                      >
                        <span className="text-emerald-600 font-bold shrink-0">
                          •
                        </span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-sienna-brown" />
                    Market Positioning
                  </p>
                  <div className="bg-bg-secondary p-3.5 rounded-xl border border-border-subtle italic text-xs text-text-primary leading-relaxed">
                    &ldquo;{result.positioning}&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Competitors Card */}
            <div className="space-y-4">
              {result.competitors.map((comp, i) => (
                <div
                  key={i}
                  className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-4"
                >
                  <div className="flex justify-between items-start gap-2 pb-2 border-b border-border-subtle">
                    <h4 className="font-serif text-lg font-medium text-text-primary truncate">
                      {comp.name}
                    </h4>
                    <span 
                      title={`Share: ${comp.marketShare}`}
                      className="text-[11px] font-mono text-text-muted bg-bg-secondary px-2 py-0.5 rounded-md border border-border-subtle max-w-[50%] line-clamp-2 text-right shrink-0"
                    >
                      Share: {comp.marketShare}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Competitor Strengths
                      </p>
                      <ul className="space-y-1.5">
                        {comp.strengths.map((s, j) => (
                          <li
                            key={j}
                            className="text-xs text-text-secondary font-sans leading-relaxed flex items-start gap-2 bg-bg-secondary/60 p-2 rounded-lg border border-border-subtle"
                          >
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Vulnerabilities to Exploit
                      </p>
                      <ul className="space-y-1.5">
                        {comp.weaknesses.map((w, j) => (
                          <li
                            key={j}
                            className="text-xs text-rose-700 dark:text-rose-300 font-sans leading-relaxed flex items-start gap-2 bg-rose-500/5 p-2 rounded-lg border border-rose-500/20"
                          >
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Objection Handling */}
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 md:p-8 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
              <MessageSquare className="w-4 h-4 text-sienna-brown" />
              <h3 className="font-serif text-base font-medium text-text-primary">
                Handling Investor Objections (&ldquo;Why Can&apos;t Incumbents Build This?&rdquo;)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.talkingPoints.map((tp, i) => (
                <div
                  key={i}
                  className="bg-bg-secondary/70 border border-border-subtle rounded-xl p-4 text-xs font-sans text-text-primary leading-relaxed"
                >
                  <p className="font-semibold text-sienna-brown dark:text-blush-peach mb-1">
                    Talking Point #{i + 1}
                  </p>
                  <p>{tp}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
