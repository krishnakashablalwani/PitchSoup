"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deletePitch, updatePitch, updatePitchDeckData } from "@/app/actions/pitchCrud";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileDown,
  Share2,
  Volume2,
  Square,
  FileText,
  Flame,
  MessageSquare,
  ExternalLink,
  Edit3,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Check,
  Sparkles,
  MoreVertical,
  Layers,
  Image as ImageIcon,
  Globe,
  History,
  GitCommit,
  X
} from "lucide-react";
import { SlideVisual } from "@/components/deck/SlideVisual";
import { toast } from "react-hot-toast";

interface Slide {
  title: string;
  content: string[];
  speakerNotes: string;
  graphicsSuggestion?: string;
  imageUrl?: string;
  visualType?: string;
}

export default function DeckClient({
  pitch,
  deckData,
}: {
  pitch: any;
  deckData: Slide[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSlideList, setShowSlideList] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showNotesInPresent, setShowNotesInPresent] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      const storageKey = `pitchsoup_confetti_${pitch.id}`;
      if (!sessionStorage.getItem(storageKey)) {
        sessionStorage.setItem(storageKey, "true");
        
        // Fire confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#5d2a1a', '#fdfbf7', '#d946ef', '#10b981']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#5d2a1a', '#fdfbf7', '#d946ef', '#10b981']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }
    }
  }, [searchParams, pitch.id]);

  const [editForm, setEditForm] = useState({
    startupName: pitch.startupName || "",
    problem: pitch.problem || "",
    solution: pitch.solution || "",
    targetMarket: pitch.targetMarket || "",
  });

  const [slides, setSlides] = useState<Slide[]>(
    deckData && deckData.length > 0
      ? deckData
      : [
          {
            title: "The Problem",
            content: [pitch.problem],
            speakerNotes: "Start with a strong hook about the problem.",
          },
          {
            title: "The Solution",
            content: [pitch.solution, `Targeting: ${pitch.targetMarket}`],
            speakerNotes: "Introduce the solution clearly.",
          },
        ]
  );

  useEffect(() => {
    if (deckData && deckData.length > 0) {
      setSlides(deckData);
    }
  }, [deckData]);

  const handleAttachImage = async (imageUrl: string) => {
    const updated = slides.map((s, idx) =>
      idx === currentSlide ? { ...s, imageUrl } : s
    );
    setSlides(updated);
    try {
      await updatePitchDeckData(pitch.id, updated);
    } catch (err) {
      console.error("Failed to save attached image", err);
    }
  };

  const handleRemoveImage = async () => {
    const updated = slides.map((s, idx) =>
      idx === currentSlide ? { ...s, imageUrl: undefined } : s
    );
    setSlides(updated);
    try {
      await updatePitchDeckData(pitch.id, updated);
    } catch (err) {
      console.error("Failed to remove attached image", err);
    }
  };

  const handleSlideEdit = async (field: keyof Slide, value: string, contentIdx?: number) => {
    const updated = [...slides];
    const current = { ...updated[currentSlide] };
    
    if (field === "content" && typeof contentIdx === "number") {
      const newContent = [...current.content];
      newContent[contentIdx] = value;
      current.content = newContent;
    } else {
      (current as any)[field] = value;
    }
    
    updated[currentSlide] = current;
    setSlides(updated);
    
    try {
      await updatePitchDeckData(pitch.id, updated);
    } catch (err) {
      console.error("Failed to save slide edit", err);
    }
  };

  const slide = slides[currentSlide] || slides[0];

  // Keyboard navigation for presentation mode and general deck view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Escape") {
        setIsPresenting(false);
        setIsEditing(false);
        setShowMoreMenu(false);
      } else if (e.key.toLowerCase() === "n") {
        if (isPresenting) {
          setShowNotesInPresent((prev) => !prev);
        } else {
          setShowNotes((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, isPresenting]);

  const handleDelete = async () => {
    await deletePitch(pitch.id);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSlide, isPresenting]);

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!slide.speakerNotes) return;
      const utterance = new SpeechSynthesisUtterance(slide.speakerNotes);
      const voices = window.speechSynthesis.getVoices();
      // Target highly expressive Neural/Online voices first, then premium British/Australian accents for better emotional cadence
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

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.set("startupName", editForm.startupName);
    formData.set("problem", editForm.problem);
    formData.set("solution", editForm.solution);
    formData.set("targetMarket", editForm.targetMarket);
    await updatePitch(pitch.id, formData);
    setIsEditing(false);
  };


  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1280, 720],
      });

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "1280px";
      container.style.height = "720px";
      container.style.zIndex = "-1";
      document.body.appendChild(container);

      for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        container.innerHTML = `
          <div style="width: 1280px; height: 720px; background: #ffffff; color: #17191c; padding: 70px 90px; display: flex; flex-direction: column; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-sizing: border-box; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 20px;">
              <span style="font-size: 15px; font-weight: 600; letter-spacing: 1.5px; color: #5d2a1a; text-transform: uppercase;">${pitch.startupName}</span>
              <span style="font-size: 13px; font-weight: 500; color: #777b86; font-family: monospace;">SLIDE ${i + 1} OF ${slides.length}</span>
            </div>

            <div style="margin: 40px 0; flex: 1; display: flex; flex-direction: column; justify-content: center;">
              <h1 style="font-size: 38px; font-weight: 700; color: #17191c; margin-bottom: 35px; letter-spacing: -0.5px; line-height: 1.2;">${s.title}</h1>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 20px;">
                ${s.content
                  .map(
                    (point) => `
                  <li style="display: flex; align-items: flex-start; font-size: 20px; line-height: 1.5; color: #40444f;">
                    <span style="color: #5d2a1a; margin-right: 16px; font-weight: bold;">•</span>
                    <span>${point}</span>
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 20px; font-size: 12px; color: #777b86;">
              <span>PitchSoup Investor Presentation</span>
              <span>Confidential</span>
            </div>
          </div>
        `;

        const canvas = await html2canvas(container, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) pdf.addPage([1280, 720], "landscape");
        pdf.addImage(imgData, "JPEG", 0, 0, 1280, 720);
      }

      document.body.removeChild(container);
      pdf.save(
        `${pitch.startupName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-deck.pdf`,
      );
      toast.success("Deck exported as PDF");
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("Failed to export PDF");
    }
    setIsExportingPDF(false);
  };
  return (
    <div className={`flex-1 flex flex-col h-screen bg-bg-primary text-text-primary overflow-hidden transition-all duration-300 ease-in-out ${isExiting ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"}`}>
      {/* Editorial Top Bar */}
      <header className="h-14 px-4 md:px-6 border-b border-border-subtle bg-bg-primary/95 backdrop-blur-md flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Back Link & Deck Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              setIsExiting(true);
              setTimeout(() => router.push("/dashboard"), 300);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-[1px] bg-border-subtle shrink-0" />

          <h1 className="font-serif text-[15px] md:text-[17px] text-text-primary font-medium tracking-tight truncate max-w-[180px] md:max-w-xs">
            {pitch.startupName}
          </h1>
        </div>

        {/* Center: Slide Jumper & Audio Voiceover Pill */}
        <div className="flex items-center gap-1.5 bg-bg-secondary border border-border-subtle/80 rounded-full px-2 py-1 shadow-xs">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="p-1 rounded-full hover:bg-bg-floating disabled:opacity-25 text-text-secondary hover:text-text-primary transition-colors"
            title="Previous Slide (← / PageUp)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[12px] font-mono font-medium text-text-primary px-2 min-w-[70px] text-center select-none">
            {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>

          <button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="p-1 rounded-full hover:bg-bg-floating disabled:opacity-25 text-text-secondary hover:text-text-primary transition-colors"
            title="Next Slide (→ / Space)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {slide.speakerNotes && (
            <>
              <div className="h-3 w-[1px] bg-border-subtle/80 mx-0.5" />
              <button
                onClick={toggleSpeech}
                className={`p-1 rounded-full transition-colors flex items-center justify-center ${
                  isSpeaking
                    ? "text-rose-600 bg-rose-500/15"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-floating"
                }`}
                title={isSpeaking ? "Stop voice-over" : "Listen to speaker notes"}
              >
                {isSpeaking ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Right: Consolidated Action Toolbar */}
        <div className="flex items-center gap-1.5">
          {/* Slide List Toggle */}
          <button
            onClick={() => setShowSlideList(!showSlideList)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showSlideList
                ? "bg-bg-secondary text-text-primary border border-border-subtle"
                : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            }`}
            title="Toggle Slide Thumbnails (S)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Slides</span>
          </button>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showNotes
                ? "bg-bg-secondary text-text-primary border border-border-subtle"
                : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            }`}
            title="Toggle Speaker Notes (N)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Notes</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="p-1.5 md:px-2.5 md:py-1.5 rounded-lg border border-border-subtle hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Export as PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">PDF</span>
          </button>


          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 rounded-lg border border-border-subtle hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center"
              title="More Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-bg-floating border border-border-subtle rounded-xl shadow-subtle-3 p-1.5 z-50 text-[13px] font-sans">
                  <Link
                    href={`/tools/stress-test?pitchId=${pitch.id}`}
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-secondary text-text-primary transition-colors"
                  >
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>VC Stress Test</span>
                  </Link>

                  <Link
                    href={`/simulator/${pitch.id}`}
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-secondary text-text-primary transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-sienna-brown" />
                    <span>Diligence Q&A Simulator</span>
                  </Link>



                  <button
                    onClick={() => {
                      setShowVersionHistory(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-secondary text-text-primary text-left transition-colors mt-1"
                  >
                    <History className="w-4 h-4 text-emerald-600" />
                    <span>Version History</span>
                  </button>

                  <div className="h-px bg-border-subtle my-1" />

                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-secondary text-text-primary text-left transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-text-secondary" />
                    <span>Edit Pitch Info</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Deck</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Primary CTA: Present */}
          <button
            onClick={() => setIsPresenting(true)}
            className="px-3.5 py-1.5 rounded-xl bg-ink-black text-paper-white font-medium text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm ml-1"
            title="Start Fullscreen Presentation"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Present</span>
          </button>
        </div>
      </header>

      {/* Main Studio Work Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Drawer: Collapsible Slide Thumbnails */}
        <AnimatePresence initial={false}>
          {showSlideList && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full border-r border-border-subtle bg-bg-secondary/70 flex flex-col shrink-0 overflow-hidden z-20"
            >
              <div className="p-3 border-b border-border-subtle flex items-center justify-between text-xs font-semibold text-text-secondary uppercase tracking-wider">
                <span>Slides</span>
                <span className="text-text-muted font-mono">{slides.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2.5 space-y-1 no-scrollbar">
                {slides.map((s, idx) => {
                  const isCurrent = currentSlide === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center gap-2.5 text-[12.5px] ${
                        isCurrent
                          ? "bg-bg-floating text-text-primary shadow-subtle border border-border-subtle font-medium"
                          : "text-text-secondary hover:bg-bg-floating/60 hover:text-text-primary"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono w-4 shrink-0 ${
                          isCurrent ? "text-sienna-brown font-bold" : "text-text-muted"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center Stage: The Slide Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden bg-bg-primary relative">
          
          {/* Subtle Canvas Backdrop Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_center,var(--color-blush-peach)_0%,transparent_70%)]" />

          {/* 16:9 Presentation Card */}
          <div className="w-full max-w-4xl lg:max-w-5xl aspect-[16/9] max-h-[calc(100vh-120px)] bg-bg-floating border border-border-subtle rounded-2xl p-6 lg:p-8 shadow-subtle-2 flex flex-col justify-between relative z-10 select-text transition-all overflow-hidden">
            
            {/* Slide Header */}
            <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2.5 mb-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-sienna-brown font-medium">
                {pitch.startupName}
              </span>
              <span className="text-[11px] font-mono text-text-muted">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Slide Content Core */}
            <div className="my-auto py-2 flex items-center flex-1 overflow-hidden">
              <div className="w-full max-w-4xl mx-auto flex flex-col justify-center pr-2">
                <h2 
                  key={currentSlide + '-title'}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleSlideEdit("title", e.currentTarget.textContent || "")}
                  className="font-serif text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] text-text-primary font-normal tracking-tight leading-snug mb-6 outline-none focus:ring-1 focus:ring-sienna-brown/50 rounded px-1 -ml-1 transition-all"
                >
                  {slide.title}
                </h2>

                <ul className="space-y-4">
                  {slide.content.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 text-[15px] lg:text-[17px] text-text-secondary leading-relaxed font-sans"
                    >
                      <span className="w-2 h-2 rounded-full bg-sienna-brown mt-2.5 shrink-0" />
                      <span 
                        key={currentSlide + '-point-' + idx}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleSlideEdit("content", e.currentTarget.textContent || "", idx)}
                        className="outline-none focus:bg-bg-secondary focus:ring-1 focus:ring-sienna-brown/50 rounded px-1 -ml-1 flex-1 transition-all"
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between border-t border-border-subtle/80 pt-2.5 mt-2 text-[10.5px] text-text-muted">
              <span>PitchSoup Presentation Studio</span>
              <span>Confidential • Investor Presentation</span>
            </div>
          </div>
        </main>

        {/* Right Drawer: Toggleable Speaker Notes */}
        <AnimatePresence initial={false}>
          {showNotes && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full border-l border-border-subtle bg-bg-secondary/70 flex flex-col shrink-0 overflow-hidden"
            >
              <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sienna-brown" />
                  <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Speaker Notes
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {slide.speakerNotes && (
                    <button
                      onClick={toggleSpeech}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isSpeaking
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-600"
                          : "border-border-subtle hover:bg-bg-floating text-text-secondary"
                      }`}
                      title={isSpeaking ? "Stop Voice" : "Play Voice"}
                    >
                      {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotes(false)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-floating transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 text-[14px] leading-relaxed text-text-secondary font-sans space-y-4">
                <p 
                  key={currentSlide + '-notes'}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleSlideEdit("speakerNotes", e.currentTarget.textContent || "")}
                  className="whitespace-pre-wrap outline-none focus:bg-bg-floating p-2 -m-2 rounded transition-all"
                >
                  {slide.speakerNotes || "No speaker notes written for this slide."}
                </p>
              </div>

              <div className="p-3 border-t border-border-subtle text-[11px] text-text-muted flex items-center justify-between">
                <span>Tip: Press 'N' to toggle notes</span>
                <span className="font-mono">Slide {currentSlide + 1}</span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Pitch Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-ink-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-floating border border-border-subtle rounded-cards p-6 md:p-8 max-w-lg w-full shadow-subtle-3 space-y-4">
            <h3 className="font-serif text-xl font-medium text-text-primary">
              Edit Pitch Details
            </h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <label className="block text-text-secondary mb-1 font-medium">Startup Name</label>
                <input
                  value={editForm.startupName}
                  onChange={(e) => setEditForm({ ...editForm, startupName: e.target.value })}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-inputs p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-ink-black"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-1 font-medium">Target Market</label>
                <input
                  value={editForm.targetMarket}
                  onChange={(e) => setEditForm({ ...editForm, targetMarket: e.target.value })}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-inputs p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-ink-black"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-1 font-medium">The Problem</label>
                <textarea
                  value={editForm.problem}
                  onChange={(e) => setEditForm({ ...editForm, problem: e.target.value })}
                  rows={2}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-inputs p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-ink-black resize-none"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-1 font-medium">Your Solution</label>
                <textarea
                  value={editForm.solution}
                  onChange={(e) => setEditForm({ ...editForm, solution: e.target.value })}
                  rows={2}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-inputs p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-ink-black resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-buttons border border-border-subtle hover:bg-bg-secondary text-[13px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-buttons bg-ink-black text-paper-white text-[13px] font-medium hover:scale-105 active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-ink-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-floating border border-border-subtle rounded-cards p-6 md:p-8 max-w-md w-full shadow-subtle-3">
            <h3 className="font-serif text-xl font-medium text-text-primary mb-2">Delete Pitch?</h3>
            <p className="text-text-secondary text-[14px] leading-relaxed mb-6 font-sans">
              This will permanently delete <strong>{pitch.startupName}</strong> and all its generated slides.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-buttons border border-border-subtle hover:bg-bg-secondary text-[13px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-buttons bg-rose-600 text-white text-[13px] font-medium hover:bg-rose-700 transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History & Comparison Modal (Concept Mockup) */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-ink-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-floating border border-border-subtle rounded-cards p-6 md:p-8 max-w-3xl w-full shadow-subtle-3 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-text-primary flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                Version History & Comparison
              </h3>
              <button onClick={() => setShowVersionHistory(false)} className="text-text-muted hover:text-text-primary">
                ×
              </button>
            </div>

            <p className="text-[13px] text-text-secondary">
              Track how your pitch has evolved over time. Select a previous version to compare side-by-side or restore.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-1 space-y-2 border-r border-border-subtle pr-4">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Saved Iterations</h4>
                
                <button className="w-full text-left p-3 rounded-lg bg-bg-secondary border border-emerald-500/30 text-text-primary text-[13px] relative flex flex-col gap-1">
                  <span className="font-medium flex items-center gap-1.5"><GitCommit className="w-3.5 h-3.5 text-emerald-600"/> v3: Current (Editable)</span>
                  <span className="text-text-muted text-[11px]">Just now • Pitch Score: 85/100</span>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-[13px] transition-colors flex flex-col gap-1">
                  <span className="font-medium flex items-center gap-1.5"><GitCommit className="w-3.5 h-3.5"/> v2: Punchier Problem</span>
                  <span className="text-text-muted text-[11px]">2 days ago • Pitch Score: 72/100</span>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-[13px] transition-colors flex flex-col gap-1">
                  <span className="font-medium flex items-center gap-1.5"><GitCommit className="w-3.5 h-3.5"/> v1: Initial AI Draft</span>
                  <span className="text-text-muted text-[11px]">1 week ago • Pitch Score: 60/100</span>
                </button>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Comparison View</span>
                  <span className="text-[10px] bg-sienna-brown/10 text-sienna-brown px-2 py-0.5 rounded-full">+13 Point Improvement</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4 space-y-2">
                     <span className="text-[10px] font-mono text-rose-600 font-medium">v2: PREVIOUS</span>
                     <h5 className="text-[13px] font-serif font-medium line-through decoration-rose-500/40 text-text-secondary">Logistics tracking is currently slow.</h5>
                     <p className="text-[11px] text-text-muted">Too generic. Doesn't quantify the financial pain for investors.</p>
                   </div>
                   <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 space-y-2">
                     <span className="text-[10px] font-mono text-emerald-600 font-medium">v3: CURRENT</span>
                     <h5 className="text-[13px] font-serif font-medium text-text-primary">Manual logistics tracking costs the average 3PL $2.4M annually in lost inventory.</h5>
                     <p className="text-[11px] text-emerald-600/80">Strong financial hook. VC-ready metric.</p>
                   </div>
                </div>

                <div className="mt-6 flex justify-end">
                   <button className="px-4 py-2 bg-bg-secondary border border-border-subtle rounded-buttons text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
                     Restore Version 2
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PRESENTATION MODE OVERLAY */}
      <AnimatePresence>
        {isPresenting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-neutral-950 text-white flex flex-col justify-between p-8 md:p-14 select-none overflow-hidden"
          >
            {/* Top Presentation Bar */}
            <div className="flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <span className="font-serif font-medium text-lg text-white">
                  {pitch.startupName}
                </span>
                <span className="text-xs px-2.5 py-0.5 bg-white/10 rounded-full font-mono text-white/60">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowNotesInPresent(!showNotesInPresent)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    showNotesInPresent
                      ? "bg-white text-black border-white font-medium"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                  title="Toggle Notes (Press 'N')"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes (N)</span>
                </button>

                <button
                  onClick={() => setIsPresenting(false)}
                  className="px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5"
                  title="Exit Presentation (Press Esc)"
                >
                  <span>Exit (Esc)</span>
                </button>
              </div>
            </div>

            {/* Main Stage Presentation Center */}
            <div className="flex-1 flex items-center justify-center relative my-6 w-full max-w-5xl mx-auto px-4">
              <div className="w-full flex flex-col justify-center">
                <div className="space-y-8 text-left max-w-4xl mx-auto">
                  <h1 className="font-serif text-[3rem] md:text-[4rem] font-normal text-white leading-tight tracking-tight">
                    {slide.title}
                  </h1>

                  <ul className="space-y-6">
                    {slide.content.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-4 text-xl md:text-2xl text-neutral-300 leading-relaxed font-sans"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-sienna-brown mt-3 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Floating Speaker Notes Panel in Presentation */}
              <AnimatePresence>
                {showNotesInPresent && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 right-4 max-w-md w-full bg-black/85 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-left"
                  >
                    <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider text-neutral-400">
                      <span>Speaker Notes</span>
                      {slide.speakerNotes && (
                        <button
                          onClick={toggleSpeech}
                          className="hover:text-white transition-colors"
                        >
                          {isSpeaking ? "■ Stop" : "▶ Listen"}
                        </button>
                      )}
                    </div>
                    <p className="text-sm font-sans text-neutral-200 leading-relaxed max-h-48 overflow-y-auto">
                      {slide.speakerNotes || "No notes for this slide."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between z-20 text-xs text-neutral-500 font-sans">
              <span>Use ← / → keys or Space to advance</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
