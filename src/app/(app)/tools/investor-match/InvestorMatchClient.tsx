"use client";

import { useState } from "react";
import { findInvestors } from "@/app/actions/match";

type Pitch = {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
};

type Investor = {
  name: string;
  type: string;
  thesis: string;
  whyMatch: string;
  typicalCheck: string;
};

export default function InvestorMatchClient({ pitches }: { pitches: Pitch[] }) {
  const [selectedPitch, setSelectedPitch] = useState<string>("");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!selectedPitch) return;
    const pitch = pitches.find(p => p.id === selectedPitch);
    if (!pitch) return;

    setLoading(true);
    setError("");
    setInvestors([]);

    try {
      const results = await findInvestors(pitch);
      setInvestors(results);
    } catch (err) {
      console.error(err);
      setError("Failed to find investors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Select Your Startup
        </label>
        <div className="flex gap-4">
          <select 
            value={selectedPitch}
            onChange={(e) => setSelectedPitch(e.target.value)}
            className="flex-1 bg-card border border-border p-4 rounded-xl focus:outline-none focus:border-primary font-body-md"
          >
            <option value="" disabled>Choose a pitch...</option>
            {pitches.map(p => (
              <option key={p.id} value={p.id}>{p.startupName}</option>
            ))}
          </select>
          <button 
            onClick={handleMatch}
            disabled={!selectedPitch || loading}
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">search</span>
            )}
            Find Matches
          </button>
        </div>
        {error && <p className="text-destructive mt-4 font-bold">{error}</p>}
      </div>

      {investors.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-headline-md font-bold mb-6">Top Matches</h2>
          <div className="grid grid-cols-1 gap-6">
            {investors.map((inv, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl shadow-sm border border-border relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold font-headline-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">account_balance</span>
                      {inv.name}
                    </h3>
                    <span className="inline-block mt-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {inv.type}
                    </span>
                  </div>
                  <div className="bg-card px-4 py-2 rounded-lg border border-border text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Check Size</p>
                    <p className="font-mono-data font-bold">{inv.typicalCheck}</p>
                  </div>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Thesis</h4>
                    <p className="font-body-md text-foreground/90">{inv.thesis}</p>
                  </div>
                  <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                      Why it's a match
                    </h4>
                    <p className="font-body-md">{inv.whyMatch}</p>
                  </div>
                </div>
                
                {/* Subtle highlight gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}

      {pitches.length === 0 && (
        <div className="text-center p-12 glass-panel rounded-2xl">
          <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">folder_off</span>
          <h3 className="text-xl font-bold mb-2">No Pitches Found</h3>
          <p className="text-muted-foreground font-body-md">You need to create a pitch deck first before we can find investors.</p>
        </div>
      )}
    </div>
  );
}
