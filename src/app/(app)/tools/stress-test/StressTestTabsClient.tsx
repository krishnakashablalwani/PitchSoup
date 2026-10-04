"use client";

import { useState } from "react";
import PitchScoreClient from "../pitch-score/PitchScoreClient";
import BattlecardClient from "../battlecard/BattlecardClient";
import { Award, Shield } from "lucide-react";

export default function StressTestTabsClient({
  pitches,
  initialPitchId,
}: {
  pitches: any[];
  initialPitchId?: string;
}) {
  const [activeTab, setActiveTab] = useState<"score" | "battlecard">(
    "score"
  );

  return (
    <div className="space-y-6">
      {/* Editorial Pill Tabs */}
      <div className="flex items-center gap-2 p-1 bg-bg-secondary border border-border-subtle rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("score")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "score"
              ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Pitch Scorecard</span>
        </button>

        <button
          onClick={() => setActiveTab("battlecard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "battlecard"
              ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-sienna-brown" />
          <span>Competitor Battlecard</span>
        </button>
      </div>

      <div className={activeTab === "score" ? "block" : "hidden"}>
        <PitchScoreClient pitches={pitches} />
      </div>
      <div className={activeTab === "battlecard" ? "block" : "hidden"}>
        <BattlecardClient pitches={pitches} />
      </div>
    </div>
  );
}
