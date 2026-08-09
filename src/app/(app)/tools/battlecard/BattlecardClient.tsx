"use client";

import { useState } from "react";
import { generateBattlecard } from "@/app/actions/battlecard";
import { motion } from "framer-motion";

type Pitch = { id: string; startupName: string; problem: string; solution: string; targetMarket: string };
type Competitor = { name: string; strengths: string[]; weaknesses: string[]; pricing: string; marketShare: string };
type BattlecardResult = { competitors: Competitor[]; ourAdvantages: string[]; positioning: string; talkingPoints: string[] };

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
    <div className="space-y-8">
      {/* Setup */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold mb-2">1. Select your pitch</h3>
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
              <p className="text-xs text-muted-foreground truncate mt-1">{p.targetMarket}</p>
            </button>
          ))}
        </div>
        {pitches.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No pitches yet. Create one first!</p>
        )}

        <h3 className="font-semibold mt-6 mb-2">2. Name your competitors</h3>
        <input
          value={competitorNames}
          onChange={(e) => setCompetitorNames(e.target.value)}
          className="w-full bg-foreground/5 border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary font-body-md"
          placeholder="e.g. Stripe, Square, PayPal"
        />

        <button
          onClick={handleGenerate}
          disabled={!selectedPitch || !competitorNames.trim() || loading}
          className="mt-4 w-full bg-primary text-black font-bold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
              Generating Battlecard...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">swords</span>
              Generate Battlecard
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 mt-12"
        >
          {/* VS Header */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-4xl font-headline-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-pulse">
              Battle Commences
            </h2>
            <div className="flex items-center gap-6">
              <div className="px-6 py-2 bg-primary/20 border-2 border-primary rounded-xl font-bold text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                {selectedPitch?.startupName}
              </div>
              <span className="text-2xl font-black italic text-muted-foreground">VS</span>
              <div className="px-6 py-2 bg-destructive/20 border-2 border-destructive rounded-xl font-bold text-destructive shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                The Incumbents
              </div>
            </div>
          </div>

          {/* Arena: You vs Competitors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 perspective-1000">
            {/* Player 1: Your Startup */}
            <motion.div 
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              whileHover={{ scale: 1.02, rotateY: -5, rotateX: 5 }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none z-10" />
              
              <div className="glass-panel rounded-3xl p-1 bg-gradient-to-br from-primary to-secondary h-full flex flex-col shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] relative z-0 overflow-hidden">
                <div className="bg-card/95 backdrop-blur-sm rounded-[22px] p-6 h-full flex flex-col relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4 relative z-10">
                    <h4 className="text-2xl font-black font-headline-lg uppercase tracking-tight text-primary drop-shadow-md">
                      {selectedPitch?.startupName}
                    </h4>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Player 1</span>
                      <span className="font-mono-data font-bold bg-primary/10 text-primary px-2 py-1 rounded text-sm mt-1">
                        YOU
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1 relative z-10">
                    <div>
                      <p className="text-xs font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">star</span>
                        Special Abilities
                      </p>
                      <ul className="space-y-2">
                        {result.ourAdvantages.map((adv, j) => (
                          <li key={j} className="text-sm font-medium flex items-start gap-3 bg-primary/10 p-3 rounded-xl border border-primary/20">
                            <span className="text-primary mt-0.5 material-symbols-outlined text-[16px]">military_tech</span> {adv}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-xs font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">map</span>
                        Battle Strategy
                      </p>
                      <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20 italic text-sm">
                        "{result.positioning}"
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider relative z-10">
                    <span>Target: <span className="text-foreground">{selectedPitch?.targetMarket}</span></span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified</span> Champion</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enemies: Competitors (can handle multiple, though 1 is common) */}
            <div className="flex flex-col gap-8">
              {result.competitors.map((comp, i) => (
                <motion.div 
                  key={i} 
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + (i * 0.2), type: "spring" }}
                  whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                  className="relative group flex-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-destructive/30 via-transparent to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none z-10" />
                  
                  <div className="glass-panel rounded-3xl p-1 bg-gradient-to-br from-border to-destructive/50 h-full flex flex-col shadow-2xl relative z-0 overflow-hidden">
                    <div className="bg-card/90 backdrop-blur-sm rounded-[22px] p-6 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4">
                        <h4 className="text-2xl font-black font-headline-lg uppercase tracking-tight text-destructive drop-shadow-md">
                          {comp.name}
                        </h4>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">HP / Share</span>
                          <span className="font-mono-data font-bold bg-foreground/10 px-2 py-1 rounded text-sm mt-1">
                            {comp.marketShare}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6 flex-1">
                        <div>
                          <p className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">bolt</span>
                            Strengths (Attacks)
                          </p>
                          <ul className="space-y-2">
                            {comp.strengths.map((s, j) => (
                              <li key={j} className="text-sm font-medium flex items-start gap-2 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                                <span className="text-yellow-500 mt-0.5">⚔️</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-xs font-black text-destructive uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">target</span>
                            Weaknesses (Vulnerabilities)
                          </p>
                          <ul className="space-y-2">
                            {comp.weaknesses.map((w, j) => (
                              <li key={j} className="text-sm font-medium flex items-start gap-2 bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                                <span className="text-destructive mt-0.5">🛡️</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Tier: <span className="text-foreground">{comp.pricing}</span></span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">info</span> Enemy Intel</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Counter-Attacks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="glass-panel rounded-3xl p-8 max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-headline-md font-black mb-6 flex items-center gap-2 uppercase tracking-wider text-techTeal justify-center">
              <span className="material-symbols-outlined">security</span>
              Counter-Attacks (Handling Objections)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.talkingPoints.map((tp, i) => (
                <div key={i} className="flex items-start gap-3 bg-foreground/5 border border-border rounded-xl p-4 transition-all hover:bg-foreground/10 hover:-translate-y-1">
                  <span className="material-symbols-outlined text-techTeal mt-0.5">reply</span>
                  <p className="font-body-md text-sm">{tp}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
