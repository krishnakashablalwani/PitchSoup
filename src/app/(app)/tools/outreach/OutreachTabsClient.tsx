"use client";

import { useState } from "react";
import InvestorMatchClient from "../investor-match/InvestorMatchClient";
import ElevatorPitchClient from "../elevator-pitch/ElevatorPitchClient";
import { Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function OutreachTabsClient({ pitches }: { pitches: any[] }) {
  const [activeTab, setActiveTab] = useState<"investors" | "elevator">("investors");

  const tabs = [
    { id: "investors" as const, label: "Investor Match", icon: Users },
    { id: "elevator" as const, label: "Elevator Pitch", icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      {/* Premium Animated Pill Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-bg-secondary/50 backdrop-blur-xl border border-border-subtle rounded-2xl w-fit mx-auto sm:mx-0 shadow-subtle">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "text-ink-black dark:text-paper-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-paper-white dark:bg-ink-black rounded-xl shadow-xs border border-border-subtle"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? "text-sienna-brown" : "opacity-70"}`} />
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents with Fade In */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={activeTab === "investors" ? "block" : "hidden"}>
          <InvestorMatchClient pitches={pitches} />
        </div>
        <div className={activeTab === "elevator" ? "block" : "hidden"}>
          <ElevatorPitchClient pitches={pitches} />
        </div>
      </motion.div>
    </div>
  );
}
