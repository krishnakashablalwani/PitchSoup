"use client";

import { useState } from "react";
import CapTableClient from "../cap-table/CapTableClient";
import RunwayClient from "../runway/RunwayClient";
import { PieChart, TrendingUp } from "lucide-react";

export default function FinancialsTabsClient({ pitches }: { pitches: any[] }) {
  const [activeTab, setActiveTab] = useState<"cap" | "runway">("cap");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1 bg-bg-secondary border border-border-subtle rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab("cap")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "cap"
              ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <PieChart className="w-3.5 h-3.5 text-sienna-brown" />
          <span>Cap Table & Dilution</span>
        </button>
        <button 
          onClick={() => setActiveTab("runway")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "runway"
              ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-sienna-brown" />
          <span>Runway & Burn Modeler</span>
        </button>
      </div>

      <div className={activeTab === "cap" ? "block" : "hidden"}>
        <CapTableClient />
      </div>
      <div className={activeTab === "runway" ? "block" : "hidden"}>
        <RunwayClient />
      </div>
    </div>
  );
}

