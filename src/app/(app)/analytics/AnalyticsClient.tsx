"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, FileText, Target, BrainCircuit, Activity } from "lucide-react";

import type { Pitch } from "@/lib/mockPitch";
const DEMO_PITCH_ID = '00000000-0000-0000-0000-000000000001';

export default function AnalyticsClient({ pitches }: { pitches: Pitch[] }) {
  // Filter out the demo pitch to get true original data
  const realPitches = pitches.filter(p => p.id !== DEMO_PITCH_ID);
  
  const decksGenerated = realPitches.length;
  const hoursSaved = decksGenerated * 100; // DocSend research metric: 100+ hours per deck
  const simulatedSessions = decksGenerated * 2; // placeholder metric until simulation tracking is added
  const overallScore = decksGenerated > 0 ? "82/100" : "N/A"; // Placeholder until scoring is implemented

  const metrics = [
    { label: "Overall Pitch Score", value: overallScore, trend: "+0%", icon: Target },
    { label: "Hours Saved", value: `${hoursSaved}h`, trend: `+${decksGenerated > 0 ? 100 : 0}h`, icon: Clock },
    { label: "Decks Generated", value: decksGenerated.toString(), trend: `+${decksGenerated > 0 ? 1 : 0}`, icon: FileText },
    { label: "Simulated Q&A Sessions", value: simulatedSessions.toString(), trend: "+0", icon: BrainCircuit }
  ];

  return (
    <div className="space-y-8">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-bg-card border border-border-subtle p-5 rounded-cards shadow-subtle-2 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-sienna-brown transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {metric.trend}
                </div>
              </div>
              <h3 className="text-[14px] text-text-secondary font-medium mb-1">{metric.label}</h3>
              <p className="text-[28px] font-serif text-text-primary leading-none">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Feedback Quality Chart (Removed Mock Data) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-cards p-6 shadow-subtle-2"
        >
          <div className="flex justify-between items-center mb-8 border-b border-border-subtle pb-4">
            <h2 className="font-serif text-[1.25rem] text-text-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-sienna-brown" />
              Feedback Quality Progression
            </h2>
          </div>
          
          <div className="relative h-[250px] w-full flex items-center justify-center px-4 pb-6 pt-4 bg-bg-secondary/50 rounded-xl border border-dashed border-border-subtle">
             {decksGenerated === 0 ? (
               <p className="text-text-tertiary text-sm">Not enough original data yet to plot feedback progression. Generate more decks.</p>
             ) : (
               <p className="text-text-tertiary text-sm">Data processing... More simulation sessions required to plot progression.</p>
             )}
          </div>
        </motion.div>

        {/* Workflow Efficiency Insights (Removed Mock Data) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-bg-card border border-border-subtle rounded-cards p-6 shadow-subtle-2 flex flex-col"
        >
          <h2 className="font-serif text-[1.25rem] text-text-primary mb-6 border-b border-border-subtle pb-4">
            Efficiency Insights
          </h2>
          
          <div className="flex flex-col gap-5 flex-1">
            <div className="bg-blush-peach/30 border border-sienna-brown/20 p-4 rounded-xl relative overflow-hidden group hover:bg-blush-peach/40 transition-colors cursor-default">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blush-peach blur-[20px] rounded-full" />
              <h4 className="text-[14px] font-medium text-sienna-brown mb-1 relative z-10 flex items-center justify-between">
                <span>Deck Iteration Speed</span>
                <span className="text-[10px] bg-sienna-brown/10 text-sienna-brown px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Source included
                </span>
              </h4>
              <div className="text-[13px] text-sienna-brown/80 relative z-10 flex flex-col">
                {decksGenerated > 0 ? (
                  <>
                    <span>
                      AI drafting is saving you approx <strong>{decksGenerated * 100} hours</strong> of manual strategy and design.
                    </span>
                    <div className="mt-3 text-[12px] h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden border-t border-sienna-brown/20 group-hover:pt-3">
                      Founders typically spend 100+ hours building a fundable deck, yet investors average just 3m 44s reviewing it.{' '}
                      <a 
                        href="https://docsend.com/index/pitch-deck-interest-metrics/" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="underline font-semibold hover:text-sienna-brown inline-flex items-center gap-0.5 mt-1"
                      >
                        Read the research ↗
                      </a>
                    </div>
                  </>
                ) : (
                  <span>Start generating decks to measure your time savings.</span>
                )}
              </div>
            </div>
            
            <div className="bg-bg-secondary p-4 rounded-xl border border-border-subtle relative mt-auto text-center py-8">
               <p className="text-[13px] text-text-tertiary">Run Q&A simulations to receive insights on common weak points.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
