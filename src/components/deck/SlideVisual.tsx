"use client";

import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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
    imagePrompt?: string;
    unsplashKeywords?: string;
    chartData?: { name: string; value: number }[];
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

  const isChart = slide.visualType === "chart" || (slide.chartData && slide.chartData.length > 0);
  // Flickr returns irrelevant amateur photos, and Unsplash's public API is dead.
  // Using Pollinations with a strict "stock photo" prompt guarantees highly relevant images based on Gemini's exact context.
  const context = slide.imagePrompt || slide.unsplashKeywords || slide.graphicsSuggestion || slide.title || startupName;
  const prompt = `Highly detailed professional corporate stock photo of ${context}, realistic photography, 8k resolution`;
  const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;

  const chartColors = ['#5d2a1a', '#f6c4aa', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="relative w-full h-full min-h-[190px] max-h-[280px] rounded-xl border border-border-subtle/80 bg-bg-card p-3 flex flex-col justify-between shadow-subtle overflow-hidden select-none group">
      
      {/* Top Graphic Bar */}
      <div className="flex items-center justify-between border-b border-border-subtle/60 pb-1.5 mb-1.5 text-[10.5px]">
        <div className="flex items-center gap-1.5 font-medium text-sienna-brown dark:text-blush-peach">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="uppercase tracking-wider font-mono text-[10px]">
            {isChart ? "Dynamic Data Visualization" : "AI Stock Visual"}
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
      <div className="flex-1 flex flex-col justify-center items-center relative w-full overflow-hidden rounded-lg">
        {isChart && slide.chartData ? (
          <div className="w-full h-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              {slide.chartData.length <= 3 ? (
                 <PieChart>
                    <Pie data={slide.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={40}>
                      {slide.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                 </PieChart>
              ) : (
                <BarChart data={slide.chartData} margin={{ top: 15, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#5d2a1a" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-lg overflow-hidden relative">
            {/* Loading placeholder skeleton */}
            <div className="absolute inset-0 bg-border-subtle/20 animate-pulse" />
            <img 
               src={generatedImageUrl} 
               alt={slide.title}
               className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 relative z-10"
               onError={(e) => { 
                 // Fallback to a placeholder if the AI image fails to load
                 e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(slide.title || 'startup')}/800/600`;
               }}
            />
          </div>
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
