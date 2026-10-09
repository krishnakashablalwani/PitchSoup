"use client";

import { useState } from "react";
import InvestorMatchClient from "../investor-match/InvestorMatchClient";
import ElevatorPitchClient from "../elevator-pitch/ElevatorPitchClient";
import CRMTrackerClient from "./CRMTrackerClient";
import { Users, Sparkles, LayoutList } from "lucide-react";

export default function OutreachTabsClient({ pitches }: { pitches: any[] }) {
  const [activeTab, setActiveTab] = useState<"investors" | "elevator" | "crm">("crm");

  return (
    <div className="space-y-6">
      {/* Editorial Pill Tabs */}
      <div className="flex items-center gap-2 p-1 bg-bg-secondary border border-border-subtle rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("crm")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "crm"
              ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <LayoutList className="w-3.5 h-3.5 text-sienna-brown" />
          <span>Pipeline CRM</span>
        </button>

        <button
          onClick={() => setActiveTab("investors")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "investors"
              ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-sienna-brown" />
          <span>Investor Match</span>
        </button>

        <button
          onClick={() => setActiveTab("elevator")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "elevator"
              ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sienna-brown" />
          <span>Elevator Pitch Generator</span>
        </button>
      </div>

      <div className={activeTab === "crm" ? "block" : "hidden"}>
        <CRMTrackerClient />
      </div>
      <div className={activeTab === "investors" ? "block" : "hidden"}>
        <InvestorMatchClient pitches={pitches} />
      </div>
      <div className={activeTab === "elevator" ? "block" : "hidden"}>
        <ElevatorPitchClient pitches={pitches} />
      </div>
    </div>
  );
}

