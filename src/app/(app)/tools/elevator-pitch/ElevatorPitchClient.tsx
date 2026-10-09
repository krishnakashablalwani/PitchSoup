"use client";

import { useState, useEffect } from "react";
import { generateElevatorPitch } from "@/app/actions/elevatorPitch";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Mic,
  Clock,
  Zap,
  Gauge,
  Presentation,
  Volume2,
  Square,
  Copy,
  Check,
  Sparkles,
  Loader2,
  Lightbulb,
} from "lucide-react";

type Pitch = {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel?: string;
  traction?: string;
  fundraisingAsk?: string;
};

type PitchScripts = {
  cocktailHook: string;
  elevator30s: string;
  speedPitch60s: string;
  demoDayScript2Min: string;
  keyTalkingPoints: string[];
};

type TabType = "10s" | "30s" | "60s" | "2min";

export default function ElevatorPitchClient({ pitches }: { pitches: Pitch[] }) {
  const searchParams = useSearchParams();
  const initialPitchId = searchParams.get("pitchId");

  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [result, setResult] = useState<PitchScripts | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("30s");
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (initialPitchId && pitches.length > 0) {
      const match = pitches.find((p) => p.id === initialPitchId);
      if (match) setSelectedPitch(match);
    } else if (!selectedPitch && pitches.length > 0) {
      setSelectedPitch(pitches[0]);
    }
  }, [initialPitchId, pitches]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [activeTab, result]);

  const handleGenerate = async () => {
    if (!selectedPitch) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateElevatorPitch(selectedPitch);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getActiveText = () => {
    if (!result) return "";
    switch (activeTab) {
      case "10s":
        return result.cocktailHook;
      case "30s":
        return result.elevator30s;
      case "60s":
        return result.speedPitch60s;
      case "2min":
        return result.demoDayScript2Min;
    }
  };

  const handleCopy = () => {
    const text = getActiveText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = getActiveText().replace(/\[.*?\]/g, "");
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Online (Natural)") || 
        v.name.includes("Google UK English") || 
        v.name.includes("Daniel") || 
        v.name.includes("Karen") || 
        v.name.includes("Serena")
    ) || voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en-AU'));
    
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 0.95; // Slower for better emphasis
    utterance.pitch = 1.05; // Slightly higher for more energy/emotion

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const words = getActiveText().trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((words / 140) * 60);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return (
      <div className="font-serif text-lg md:text-xl leading-relaxed text-text-primary">
        {parts.map((part, index) => {
          if (part.startsWith("[") && part.endsWith("]")) {
            return (
              <span
                key={index}
                className="inline-block mx-1.5 px-2.5 py-0.5 bg-blush-peach/40 border border-sienna-brown/20 text-sienna-brown dark:text-blush-peach font-mono text-xs rounded-full uppercase tracking-wider font-semibold align-middle not-italic shadow-xs"
              >
                {part.slice(1, -1)}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-sienna-brown" />
            <h3 className="font-serif text-base font-medium text-text-primary">
              1. Select Pitch for Speaking Scripts
            </h3>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Stage-Ready Formats
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
                {p.targetMarket || "General Market"}
              </p>
            </button>
          ))}
        </div>

        {pitches.length === 0 && (
          <p className="text-xs text-text-secondary text-center py-6">
            No pitches found. Create your first pitch deck to generate scripts!
          </p>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedPitch || loading}
          className="w-full bg-ink-black text-paper-white rounded-buttons text-sm font-medium py-3.5 px-6 shadow-subtle hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blush-peach" />
              <span>Drafting Speaking Scripts with AI Coach...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blush-peach" />
              <span>Generate Scripts (10s, 30s, 60s, 2-Min)</span>
            </>
          )}
        </button>
      </div>

      {/* Script Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            {/* Format Tabs Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-bg-floating border border-border-subtle rounded-2xl shadow-subtle">
              <div className="flex items-center gap-1.5 p-1 bg-bg-secondary border border-border-subtle rounded-xl">
                {[
                  { key: "10s", label: "10s Hook", icon: Zap },
                  { key: "30s", label: "30s Elevator", icon: Clock },
                  { key: "60s", label: "60s Speed", icon: Gauge },
                  { key: "2min", label: "2-Min Demo Day", icon: Presentation },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as TabType)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-bg-floating text-text-primary shadow-xs font-semibold"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-sienna-brown" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Stats & Controls */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-text-muted bg-bg-secondary px-3 py-1.5 rounded-xl border border-border-subtle">
                  <span>~{words} words</span>
                  <span>•</span>
                  <span>~{estimatedSeconds}s spoken</span>
                </div>

                <button
                  onClick={handleSpeak}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSpeaking
                      ? "bg-rose-500/15 text-rose-600 border-rose-500/30 animate-pulse"
                      : "bg-bg-secondary hover:bg-bg-card border-border-subtle text-text-primary"
                  }`}
                  title={isSpeaking ? "Stop Voice" : "Rehearse with Voice Audio"}
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-sienna-brown" />
                      <span>Audio</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-card border border-border-subtle text-xs font-medium text-text-primary transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sienna-brown" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Teleprompter Card */}
            <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 md:p-10 shadow-subtle relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-text-muted font-mono mb-4 pb-2 border-b border-border-subtle">
                <span className="w-2 h-2 rounded-full bg-sienna-brown animate-pulse" />
                <span>Teleprompter Reading View</span>
              </div>

              <div className="max-w-3xl mx-auto py-2">
                {renderFormattedText(getActiveText())}
              </div>
            </div>

            {/* Key Talking Points */}
            <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
                <Lightbulb className="w-4 h-4 text-sienna-brown" />
                <h3 className="font-serif text-base font-medium text-text-primary">
                  Key Points to Internalize (Do Not Memorize Word-for-Word)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.keyTalkingPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-bg-secondary border border-border-subtle flex items-start gap-2.5 text-xs text-text-primary font-sans leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-lg bg-blush-peach/40 text-sienna-brown text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
