"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Target,
  DollarSign,
  PieChart as PieChartIcon,
  Mic,
  Database,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";

export interface SlideVisualProps {
  slide: {
    title: string;
    content: string[];
    speakerNotes?: string;
    graphicsSuggestion?: string;
    imageUrl?: string;
    visualType?: string;
  };
  slideIndex: number;
  startupName?: string;
  isPresentationMode?: boolean;
  onAttachImage?: (imageUrl: string) => void;
  onRemoveImage?: () => void;
}

export function SlideVisual({
  slide,
  slideIndex,
  startupName = "Startup",
  isPresentationMode = false,
  onAttachImage,
  onRemoveImage,
}: SlideVisualProps) {
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");

  const suggestion = (slide.graphicsSuggestion || "").toLowerCase();
  const title = (slide.title || "").toLowerCase();

  // Handle local file upload (converts to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && onAttachImage) {
        onAttachImage(dataUrl);
        setShowAttachModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customUrlInput.trim() && onAttachImage) {
      onAttachImage(customUrlInput.trim());
      setCustomUrlInput("");
      setShowAttachModal(false);
    }
  };

  // If slide has a custom or uploaded image
  if (slide.imageUrl) {
    return (
      <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden group border border-border-subtle bg-bg-card shadow-sm">
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!isPresentationMode && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => setShowAttachModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-neutral-100 shadow transition-all flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            {onRemoveImage && (
              <button
                onClick={onRemoveImage}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 shadow transition-all flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Visual Type Detection
  const isHeroOrAmbient =
    slideIndex === 0 ||
    suggestion.includes("hero") ||
    suggestion.includes("ambient") ||
    title.includes("ambient") ||
    title.includes("intelligence");

  const isProblemOrSplit =
    suggestion.includes("split") ||
    suggestion.includes("burnout") ||
    suggestion.includes("crisis") ||
    title.includes("burnout") ||
    title.includes("problem");

  const isFlowOrSystem =
    suggestion.includes("flow") ||
    suggestion.includes("pipeline") ||
    suggestion.includes("system") ||
    suggestion.includes("diagram") ||
    title.includes("scribe") ||
    title.includes("solution");

  const isFeatures =
    suggestion.includes("feature") ||
    suggestion.includes("cards") ||
    title.includes("features") ||
    title.includes("capabilities");

  const isMarketSize =
    suggestion.includes("concentric") ||
    suggestion.includes("tam") ||
    suggestion.includes("market") ||
    title.includes("market");

  const isGTMOrFunnel =
    suggestion.includes("funnel") ||
    suggestion.includes("gtm") ||
    suggestion.includes("trial") ||
    title.includes("market") && title.includes("growth");

  const isArchitectureOrMoat =
    suggestion.includes("architectural") ||
    suggestion.includes("proprietary") ||
    suggestion.includes("moat") ||
    title.includes("models") ||
    title.includes("advantage");

  const isBusinessOrPricing =
    suggestion.includes("pricing") ||
    suggestion.includes("gross margin") ||
    suggestion.includes("payback") ||
    title.includes("saas") ||
    title.includes("pricing") ||
    title.includes("business model");

  const isCompetitionOrMatrix =
    suggestion.includes("2x2") ||
    suggestion.includes("matrix") ||
    suggestion.includes("quadrant") ||
    title.includes("wins") ||
    title.includes("compet");

  const isFinancialsOrGrowth =
    suggestion.includes("bar chart") ||
    suggestion.includes("arr") ||
    suggestion.includes("projections") ||
    title.includes("projections") ||
    title.includes("financial");

  const isTractionOrTimeline =
    suggestion.includes("timeline") ||
    suggestion.includes("traction") ||
    suggestion.includes("milestone") ||
    title.includes("traction") ||
    title.includes("roadmap");

  const isTheAskOrAllocation =
    suggestion.includes("donut") ||
    suggestion.includes("allocation") ||
    suggestion.includes("fund") ||
    title.includes("ask") ||
    title.includes("seed") ||
    title.includes("funding");

  return (
    <div className="relative w-full h-full min-h-[190px] max-h-[280px] rounded-xl border border-border-subtle/80 bg-gradient-to-br from-bg-secondary/90 via-bg-card/70 to-bg-secondary/90 p-3 flex flex-col justify-between shadow-subtle overflow-hidden select-none group">
      
      {/* Top Graphic Bar */}
      <div className="flex items-center justify-between border-b border-border-subtle/60 pb-1.5 mb-1.5 text-[10.5px]">
        <div className="flex items-center gap-1.5 font-medium text-sienna-brown dark:text-blush-peach">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="uppercase tracking-wider font-mono text-[10px]">
            {isHeroOrAmbient
              ? "Live Ambient Scribe"
              : isProblemOrSplit
              ? "Overhead vs Care Split"
              : isFlowOrSystem
              ? "Clinical Pipeline"
              : isMarketSize
              ? "TAM / SAM / SOM Rings"
              : isGTMOrFunnel
              ? "GTM Conversion Funnel"
              : isCompetitionOrMatrix
              ? "2x2 Competitive Quadrant"
              : isFinancialsOrGrowth
              ? "3-Year ARR Projections"
              : isTheAskOrAllocation
              ? "Fund Allocation Breakdown"
              : isTractionOrTimeline
              ? "Milestone Roadmap"
              : "Pitch Visual Graphic"}
          </span>
        </div>

        {!isPresentationMode && onAttachImage && (
          <button
            onClick={() => setShowAttachModal(true)}
            className="opacity-60 group-hover:opacity-100 hover:text-text-primary transition-opacity text-[11px] text-text-secondary flex items-center gap-1 bg-bg-floating px-2 py-0.5 rounded-full border border-border-subtle shadow-xs"
            title="Attach custom image or diagram"
          >
            <ImageIcon className="w-3 h-3 text-sienna-brown" />
            <span>Attach Visual</span>
          </button>
        )}
      </div>

      {/* Main Graphic Rendering Body */}
      <div className="flex-1 flex flex-col justify-center items-center py-2 relative w-full overflow-hidden">
        
        {/* 1. HERO / AMBIENT CLINICAL INTELLIGENCE */}
        {isHeroOrAmbient && (
          <div className="w-full flex flex-col gap-2.5 max-w-sm">
            {/* Live Audio Waveform Simulation */}
            <div className="bg-bg-floating/90 border border-border-subtle rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Ambient Listening Active
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted">99.2% Acc.</span>
              </div>

              {/* Pulsing Waveform Bars */}
              <div className="flex items-center justify-center gap-1 h-8 px-2">
                {[40, 75, 30, 90, 60, 100, 45, 80, 25, 95, 70, 35, 85, 50, 90, 65, 30].map(
                  (h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1 rounded-full bg-sienna-brown/60 dark:bg-blush-peach/80 transition-all duration-300"
                    />
                  ),
                )}
              </div>
            </div>

            {/* Generated Real-time SOAP Note Card */}
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-3 shadow-xs font-mono text-[10.5px] leading-tight space-y-1.5">
              <div className="flex justify-between text-text-muted text-[9.5px] border-b border-border-subtle/50 pb-1">
                <span>PATIENT ENCOUNTER #4928</span>
                <span className="text-emerald-500 font-semibold">● SYNCED EPIC EHR</span>
              </div>
              <div>
                <span className="text-sienna-brown dark:text-blush-peach font-bold">[S]</span>{" "}
                <span className="text-text-secondary">Patient reports persistent migraine x 3d...</span>
              </div>
              <div>
                <span className="text-sienna-brown dark:text-blush-peach font-bold">[O]</span>{" "}
                <span className="text-text-secondary">BP 124/82 mmHg, HR 74 bpm, Normal neuro exam</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="bg-blush-peach/40 text-sienna-brown px-1.5 py-0.5 rounded text-[9px] font-sans font-medium">
                  ICD-10: G43.909
                </span>
                <span className="bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-sans font-medium">
                  CPT: 99214
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. BURNOUT / SPLIT RATIO GRAPHIC */}
        {isProblemOrSplit && !isHeroOrAmbient && (
          <div className="w-full flex flex-col gap-3 max-w-sm">
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-3.5 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-[12px] font-medium">
                <span className="text-emerald-600 dark:text-emerald-400">28% Patient Care</span>
                <span className="text-rose-600 dark:text-rose-400">72% EHR Admin Burden</span>
              </div>

              {/* Progress Split Bar */}
              <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-border-subtle p-0.5">
                <div
                  style={{ width: "28%" }}
                  className="bg-emerald-500 rounded-l-full h-full flex items-center justify-center"
                />
                <div
                  style={{ width: "72%" }}
                  className="bg-rose-500/85 rounded-r-full h-full flex items-center justify-center"
                />
              </div>

              <div className="text-[10px] text-text-muted text-center italic">
                For every 1 hour with a patient, 2.5 hours are spent typing into EHR screens.
              </div>
            </div>

            {/* Quick Stat Pill Cards */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 shadow-xs">
                <div className="text-rose-600 font-bold text-base leading-tight">63%</div>
                <div className="text-[10px] text-text-muted">Physician Burnout</div>
              </div>
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 shadow-xs">
                <div className="text-sienna-brown dark:text-blush-peach font-bold text-base leading-tight">$140,000</div>
                <div className="text-[10px] text-text-muted">Annual Overhead / MD</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. SYSTEM FLOW / CLINICAL PIPELINE */}
        {isFlowOrSystem && !isHeroOrAmbient && !isProblemOrSplit && (
          <div className="w-full flex flex-col gap-2 max-w-md">
            <div className="grid grid-cols-4 gap-1.5 items-center">
              {/* Step 1 */}
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 text-center shadow-xs flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blush-peach/40 text-sienna-brown flex items-center justify-center mb-1">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-semibold text-text-primary leading-tight">1. Ambient</span>
                <span className="text-[9px] text-text-muted">Mobile / Desk</span>
              </div>

              {/* Step 2 */}
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 text-center shadow-xs flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-sienna-brown text-paper-white flex items-center justify-center mb-1">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-semibold text-text-primary leading-tight">2. AI NLP</span>
                <span className="text-[9px] text-text-muted">Medical Model</span>
              </div>

              {/* Step 3 */}
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 text-center shadow-xs flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-semibold text-text-primary leading-tight">3. SOAP Note</span>
                <span className="text-[9px] text-text-muted">Auto-Coded</span>
              </div>

              {/* Step 4 */}
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 text-center shadow-xs flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-600 flex items-center justify-center mb-1">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-semibold text-text-primary leading-tight">4. EHR Sync</span>
                <span className="text-[9px] text-text-muted">Epic / Athena</span>
              </div>
            </div>

            <div className="bg-bg-floating/90 border border-border-subtle rounded-lg px-3 py-1.5 flex items-center justify-between text-[10.5px]">
              <span className="text-text-secondary">Latency Benchmark:</span>
              <span className="font-mono font-medium text-emerald-600">Sub-second (&lt; 850ms)</span>
            </div>
          </div>
        )}

        {/* 4. FEATURES GRID */}
        {isFeatures && !isHeroOrAmbient && !isProblemOrSplit && !isFlowOrSystem && (
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs">
              <div className="text-sienna-brown font-semibold text-[13px] flex items-center gap-1.5 mb-0.5">
                <Activity className="w-3.5 h-3.5" /> 99.2% Accurate
              </div>
              <p className="text-[10px] text-text-secondary leading-tight">Trained on complex clinical pharmacology & diagnostics.</p>
            </div>
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs">
              <div className="text-sienna-brown font-semibold text-[13px] flex items-center gap-1.5 mb-0.5">
                <Zap className="w-3.5 h-3.5" /> Auto-Coding
              </div>
              <p className="text-[10px] text-text-secondary leading-tight">Automated ICD-10 & CPT medical billing codes.</p>
            </div>
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs">
              <div className="text-sienna-brown font-semibold text-[13px] flex items-center gap-1.5 mb-0.5">
                <Layers className="w-3.5 h-3.5" /> 12+ Languages
              </div>
              <p className="text-[10px] text-text-secondary leading-tight">Multi-speaker diarization for bilingual patient rooms.</p>
            </div>
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs">
              <div className="text-sienna-brown font-semibold text-[13px] flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> HIPAA & SOC-2
              </div>
              <p className="text-[10px] text-text-secondary leading-tight">End-to-end encrypted zero-retention architecture.</p>
            </div>
          </div>
        )}

        {/* 5. MARKET SIZE CONCENTRIC RINGS */}
        {isMarketSize && !isHeroOrAmbient && !isProblemOrSplit && (
          <div className="w-full flex items-center justify-center gap-6 max-w-md">
            {/* Concentric SVG Rings */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              {/* TAM Outer Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-sienna-brown/25 bg-sienna-brown/5 flex items-start justify-center pt-1">
                <span className="text-[9px] font-mono text-sienna-brown font-bold uppercase tracking-wider">TAM</span>
              </div>
              {/* SAM Middle Ring */}
              <div className="absolute inset-4 rounded-full border-2 border-sienna-brown/50 bg-sienna-brown/10 flex items-start justify-center pt-1">
                <span className="text-[9px] font-mono text-sienna-brown font-bold uppercase tracking-wider">SAM</span>
              </div>
              {/* SOM Center Core */}
              <div className="absolute inset-9 rounded-full bg-sienna-brown text-paper-white flex flex-col items-center justify-center shadow-md">
                <span className="text-[8px] font-mono uppercase tracking-wider">SOM</span>
                <span className="text-[12px] font-bold leading-tight">$420M</span>
              </div>
            </div>

            {/* Market Legend Callouts */}
            <div className="flex flex-col gap-2 text-left">
              <div>
                <div className="text-[10px] text-text-muted font-mono uppercase">TAM ($18.4 Billion)</div>
                <div className="text-[12px] font-medium text-text-primary">230k US Outpatient Clinics</div>
              </div>
              <div>
                <div className="text-[10px] text-text-muted font-mono uppercase">SAM ($5.2 Billion)</div>
                <div className="text-[12px] font-medium text-text-primary">Mid-Sized Groups (5-50 MDs)</div>
              </div>
              <div>
                <div className="text-[10px] text-sienna-brown font-mono font-bold uppercase">SOM ($420 Million)</div>
                <div className="text-[12px] font-semibold text-text-primary">Initial Focus: CA, TX, NY</div>
              </div>
            </div>
          </div>
        )}

        {/* 6. GTM / FUNNEL */}
        {isGTMOrFunnel && !isMarketSize && (
          <div className="w-full max-w-sm flex flex-col gap-2">
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] text-text-muted font-mono uppercase">Stage 1: Inbound Pilot</div>
                <div className="text-[12.5px] font-semibold text-text-primary">14-Day Free Doctor Trial</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-mono text-[10px]">100% Free</span>
            </div>

            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs flex items-center justify-between ml-4">
              <div>
                <div className="text-[10px] text-text-muted font-mono uppercase">Stage 2: Practice Expansion</div>
                <div className="text-[12.5px] font-semibold text-text-primary">Multi-seat Clinic Contracts</div>
              </div>
              <span className="px-2 py-0.5 bg-blush-peach text-sienna-brown rounded-full font-mono text-[10px]">82% Buy-in</span>
            </div>

            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs flex items-center justify-between ml-8">
              <div>
                <div className="text-[10px] text-text-muted font-mono uppercase">Stage 3: Enterprise Rollout</div>
                <div className="text-[12.5px] font-semibold text-text-primary">Regional IPA Partnerships</div>
              </div>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full font-mono text-[10px]">Scale Channel</span>
            </div>
          </div>
        )}

        {/* 7. ARCHITECTURE / TECH MOAT */}
        {isArchitectureOrMoat && !isFlowOrSystem && (
          <div className="w-full max-w-sm flex flex-col gap-1.5">
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 flex items-center gap-2.5 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-sienna-brown/20 text-sienna-brown text-[10px] font-mono flex items-center justify-center font-bold">L1</span>
              <div>
                <div className="text-[11px] font-semibold text-text-primary leading-tight">Acoustic De-noising Layer</div>
                <div className="text-[9.5px] text-text-muted">Isolates doctor & patient voices from noisy exam rooms</div>
              </div>
            </div>

            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 flex items-center gap-2.5 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-sienna-brown text-paper-white text-[10px] font-mono flex items-center justify-center font-bold">L2</span>
              <div>
                <div className="text-[11px] font-semibold text-text-primary leading-tight">Fine-Tuned Clinical LLM</div>
                <div className="text-[9.5px] text-text-muted">100k+ hours of vetted outpatient clinical dialogue</div>
              </div>
            </div>

            <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 flex items-center gap-2.5 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 text-[10px] font-mono flex items-center justify-center font-bold">L3</span>
              <div>
                <div className="text-[11px] font-semibold text-text-primary leading-tight">Universal Lightweight EHR Bridge</div>
                <div className="text-[9.5px] text-text-muted">Plug-and-play connector for Epic, Athena, & Cerner</div>
              </div>
            </div>

            <div className="bg-blush-peach/40 border border-sienna-brown/20 rounded-lg p-1.5 text-center text-[10px] text-sienna-brown font-medium">
              Data Flywheel: Continuous reinforcement from 50k+ daily doctor note edits
            </div>
          </div>
        )}

        {/* 8. BUSINESS MODEL & UNIT ECONOMICS */}
        {isBusinessOrPricing && (
          <div className="w-full max-w-sm flex flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 shadow-xs">
                <span className="text-[9px] text-text-muted font-mono uppercase block">Gross Margin</span>
                <span className="text-[15px] font-bold text-emerald-600">85%</span>
              </div>
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 shadow-xs">
                <span className="text-[9px] text-text-muted font-mono uppercase block">Payback</span>
                <span className="text-[15px] font-bold text-sienna-brown dark:text-blush-peach">3.8 Mo</span>
              </div>
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2 shadow-xs">
                <span className="text-[9px] text-text-muted font-mono uppercase block">LTV:CAC</span>
                <span className="text-[15px] font-bold text-indigo-600">10.1x</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-bg-floating border border-border-subtle rounded-xl p-2.5 shadow-xs">
                <div className="text-[10px] text-text-muted font-mono uppercase">Standard Tier</div>
                <div className="text-sm font-bold text-text-primary">$299<span className="text-[10px] font-normal text-text-muted">/mo/MD</span></div>
                <div className="text-[9.5px] text-text-secondary mt-1">Full Ambient Scribe + SOAP generation</div>
              </div>
              <div className="bg-bg-floating border border-sienna-brown/40 rounded-xl p-2.5 shadow-xs relative">
                <span className="absolute -top-2 right-2 bg-sienna-brown text-paper-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Popular</span>
                <div className="text-[10px] text-text-muted font-mono uppercase">Pro Tier</div>
                <div className="text-sm font-bold text-sienna-brown dark:text-blush-peach">$499<span className="text-[10px] font-normal text-text-muted">/mo/MD</span></div>
                <div className="text-[9.5px] text-text-secondary mt-1">Automated Coding & Audit Defense</div>
              </div>
            </div>
          </div>
        )}

        {/* 9. COMPETITION 2x2 QUADRANT */}
        {isCompetitionOrMatrix && (
          <div className="relative w-56 h-48 border border-border-subtle/80 bg-bg-floating rounded-xl p-2 shadow-xs">
            {/* Axes */}
            <div className="absolute top-2 bottom-2 left-1/2 w-[1px] bg-border-subtle/80 -translate-x-1/2" />
            <div className="absolute left-2 right-2 top-1/2 h-[1px] bg-border-subtle/80 -translate-y-1/2" />

            {/* Labels */}
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-text-muted uppercase">Ambient AI ↑</span>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-text-muted uppercase">Manual ↓</span>
            <span className="absolute top-1/2 -left-1 -translate-y-1/2 text-[8px] font-mono text-text-muted uppercase -rotate-90">Expensive</span>
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 text-[8px] font-mono text-text-muted uppercase rotate-90">Affordable</span>

            {/* Top-Right: HealthAI (Winner) */}
            <div className="absolute top-3 right-3 bg-sienna-brown text-paper-white px-2 py-1 rounded-md text-[10px] font-bold shadow-md flex items-center gap-1">
              <span>★ {startupName.split(" ")[0]}</span>
            </div>

            {/* Top-Left: Human Scribes */}
            <div className="absolute top-6 left-3 bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded text-[8.5px] border border-border-subtle">
              Virtual Scribes ($2k)
            </div>

            {/* Bottom-Left: Nuance / Dragon */}
            <div className="absolute bottom-4 left-3 bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded text-[8.5px] border border-border-subtle">
              Legacy Nuance ($8k)
            </div>

            {/* Bottom-Right: Generic LLM Wrappers */}
            <div className="absolute bottom-4 right-3 bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded text-[8.5px] border border-border-subtle">
              Generic LLM Wrappers
            </div>
          </div>
        )}

        {/* 10. FINANCIAL PROJECTIONS (BAR CHART) */}
        {isFinancialsOrGrowth && (
          <div className="w-full max-w-sm flex flex-col gap-2">
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-3 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-mono uppercase text-text-muted">3-Year ARR Projection</span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Cash Flow + at Mo. 26
                </span>
              </div>

              {/* Bar Columns */}
              <div className="flex items-end justify-between gap-4 h-24 px-4 pt-2">
                {/* Year 1 */}
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-text-secondary">$1.2M</span>
                  <div className="w-full bg-sienna-brown/40 rounded-t-md h-8 transition-all" />
                  <span className="text-[9px] font-mono text-text-muted">Y1 (2026)</span>
                </div>

                {/* Year 2 */}
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-sienna-brown dark:text-blush-peach">$4.8M</span>
                  <div className="w-full bg-sienna-brown/70 rounded-t-md h-16 transition-all" />
                  <span className="text-[9px] font-mono text-text-muted">Y2 (2027)</span>
                </div>

                {/* Year 3 */}
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-extrabold text-sienna-brown dark:text-blush-peach">$14.2M</span>
                  <div className="w-full bg-sienna-brown rounded-t-md h-24 transition-all" />
                  <span className="text-[9px] font-mono text-sienna-brown font-bold">Y3 (2028)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-text-muted px-2">
              <span>Y1: 280 MDs</span>
              <span>Y2: 1,150 MDs</span>
              <span>Y3: 3,400 MDs (125% NRR)</span>
            </div>
          </div>
        )}

        {/* 11. TRACTION / ROADMAP TIMELINE */}
        {isTractionOrTimeline && !isFinancialsOrGrowth && (
          <div className="w-full max-w-sm flex flex-col gap-2">
            <div className="bg-bg-floating border border-border-subtle rounded-xl p-3 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                <div className="flex-1">
                  <div className="text-[11.5px] font-semibold text-text-primary">MVP Clinical Engine Launch</div>
                  <div className="text-[9.5px] text-text-muted">Acoustic diarization calibrated</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                <div className="flex-1">
                  <div className="text-[11.5px] font-semibold text-text-primary">First 5 Clinic Pilots</div>
                  <div className="text-[9.5px] text-text-muted">Zero churn across pilot cohorts</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sienna-brown text-paper-white flex items-center justify-center text-[10px] font-bold shrink-0">●</span>
                <div className="flex-1">
                  <div className="text-[11.5px] font-bold text-sienna-brown dark:text-blush-peach">$42,000 MRR Milestone (Current)</div>
                  <div className="text-[9.5px] text-text-muted">18 paying clinics & 140 daily doctors</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-border-subtle text-text-muted flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
                <div className="flex-1">
                  <div className="text-[11.5px] font-medium text-text-primary">Epic App Orchard Certified (Q4 Target)</div>
                  <div className="text-[9.5px] text-text-muted">$310,000 in signed LOIs onboarding</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 12. THE ASK / FUND ALLOCATION */}
        {isTheAskOrAllocation && (
          <div className="w-full max-w-sm flex items-center justify-center gap-5">
            {/* Donut Simulation */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* 15% Ops (Gray) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#a3a6af" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="0" />
                {/* 30% GTM (Peach) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f6c4aa" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="-15" />
                {/* 55% R&D (Sienna) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#5d2a1a" strokeWidth="4" strokeDasharray="55 45" strokeDashoffset="-45" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[8px] font-mono text-text-muted uppercase">Seed Ask</span>
                <span className="text-[13px] font-extrabold text-sienna-brown dark:text-blush-peach">$1.5M</span>
              </div>
            </div>

            {/* Allocation Breakdown */}
            <div className="flex flex-col gap-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sienna-brown shrink-0" />
                <span className="font-semibold text-text-primary">55% R&D ($825k)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sienna-brown/60 dark:bg-blush-peach shrink-0" />
                <span className="text-text-secondary">30% Sales / GTM ($450k)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-text-muted shrink-0" />
                <span className="text-text-secondary">15% Compliance & Ops ($225k)</span>
              </div>
              <div className="mt-1 bg-blush-peach/40 text-sienna-brown px-2 py-0.5 rounded text-[9.5px] font-medium font-mono">
                Target: $2.5M ARR & 600 Clinics
              </div>
            </div>
          </div>
        )}

        {/* 13. FALLBACK GENERAL VISUAL */}
        {!isHeroOrAmbient &&
          !isProblemOrSplit &&
          !isFlowOrSystem &&
          !isFeatures &&
          !isMarketSize &&
          !isGTMOrFunnel &&
          !isArchitectureOrMoat &&
          !isBusinessOrPricing &&
          !isCompetitionOrMatrix &&
          !isFinancialsOrGrowth &&
          !isTractionOrTimeline &&
          !isTheAskOrAllocation && (
            <div className="w-full max-w-sm bg-bg-floating border border-border-subtle rounded-xl p-4 shadow-xs text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blush-peach/50 text-sienna-brown flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-[13px] font-serif font-medium text-text-primary">
                {slide.title}
              </div>
              <p className="text-[11px] text-text-secondary line-clamp-2">
                {slide.graphicsSuggestion || "Custom visual graphic tailored for this pitch slide."}
              </p>
              <div className="pt-1">
                <span className="text-[10px] text-sienna-brown font-mono bg-blush-peach/30 px-2 py-0.5 rounded-full">
                  PitchSoup Visual Studio
                </span>
              </div>
            </div>
          )}
      </div>

      {/* Bottom Subtitle Caption */}
      <div className="border-t border-border-subtle/50 pt-2 text-[10px] text-text-muted truncate">
        {slide.graphicsSuggestion ? (
          <span className="truncate block" title={slide.graphicsSuggestion}>
            💡 {slide.graphicsSuggestion}
          </span>
        ) : (
          <span>PitchSoup Interactive Visual</span>
        )}
      </div>

      {/* Attach Visual Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sienna-brown" />
                <h3 className="font-serif text-base font-medium text-text-primary">
                  Attach Visual to Slide
                </h3>
              </div>
              <button
                onClick={() => setShowAttachModal(false)}
                className="text-text-muted hover:text-text-primary text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Option 1: File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Upload Image File
              </label>
              <label className="border-2 border-dashed border-border-subtle hover:border-sienna-brown/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-bg-secondary/40">
                <Upload className="w-6 h-6 text-text-muted mb-1" />
                <span className="text-xs font-medium text-text-primary">
                  Click to choose image file
                </span>
                <span className="text-[10px] text-text-muted mt-0.5">
                  PNG, JPG, SVG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Option 2: Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Or Paste Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/slide-graphic.png"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-bg-secondary border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-ink-black"
                />
                <button
                  onClick={handleApplyUrl}
                  disabled={!customUrlInput.trim()}
                  className="px-3 py-1.5 bg-ink-black text-paper-white rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Option 3: Curated Quick Templates */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Or Pick Stock Graphic
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onAttachImage?.("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80");
                    setShowAttachModal(false);
                  }}
                  className="group relative rounded-lg overflow-hidden border border-border-subtle aspect-video hover:border-sienna-brown transition-all"
                >
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80"
                    alt="Clinical AI"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/40 text-[9px] text-white flex items-center justify-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Clinical AI
                  </span>
                </button>

                <button
                  onClick={() => {
                    onAttachImage?.("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80");
                    setShowAttachModal(false);
                  }}
                  className="group relative rounded-lg overflow-hidden border border-border-subtle aspect-video hover:border-sienna-brown transition-all"
                >
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80"
                    alt="Analytics"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/40 text-[9px] text-white flex items-center justify-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Analytics
                  </span>
                </button>

                <button
                  onClick={() => {
                    onAttachImage?.("https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80");
                    setShowAttachModal(false);
                  }}
                  className="group relative rounded-lg overflow-hidden border border-border-subtle aspect-video hover:border-sienna-brown transition-all"
                >
                  <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80"
                    alt="Pitch"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/40 text-[9px] text-white flex items-center justify-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Pitch Deck
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAttachModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs hover:bg-bg-secondary text-text-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
