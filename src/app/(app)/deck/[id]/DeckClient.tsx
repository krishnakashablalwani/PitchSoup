"use client";

import { useState } from "react";
import Link from "next/link";
import { deletePitch, updatePitch } from "@/app/actions/pitchCrud";


interface Slide {
  title: string;
  content: string[];
  speakerNotes: string;
}

export default function DeckClient({ pitch, deckData }: { pitch: any, deckData: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    startupName: pitch.startupName || "",
    problem: pitch.problem || "",
    solution: pitch.solution || "",
    targetMarket: pitch.targetMarket || "",
  });

  const slides = deckData && deckData.length > 0 ? deckData : [
    {
      title: "THE PROBLEM",
      content: [pitch.problem],
      speakerNotes: "Start with a strong hook about the problem."
    },
    {
      title: "THE SOLUTION",
      content: [pitch.solution, `Targeting: ${pitch.targetMarket}`],
      speakerNotes: "Introduce the solution clearly."
    }
  ];

  const slide = slides[currentSlide];

  const handleDelete = async () => {
    await deletePitch(pitch.id);
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

  return (
    <div className="flex-1 flex flex-col p-6 h-full bg-background overflow-hidden">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-headline-md font-bold">{pitch.startupName}</h1>
          <p className="text-muted-foreground font-body-md text-sm">Generated Pitch Deck</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Delete
          </button>

          <Link 
            href={`/simulator?pitchId=${pitch.id}`} 
            className="bg-primary text-black px-6 py-2.5 rounded-xl font-semibold transition-transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
            Practice Pitch
          </Link>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-panel rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Delete Pitch?</h3>
            <p className="text-muted-foreground font-body-md mb-6">
              This will permanently delete <strong>{pitch.startupName}</strong> and all its generated slides. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-destructive text-white font-semibold text-sm transition-colors hover:bg-destructive/90"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Panel */}
      {isEditing && (
        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            Edit Pitch Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Startup Name</label>
              <input
                value={editForm.startupName}
                onChange={(e) => setEditForm({ ...editForm, startupName: e.target.value })}
                className="w-full bg-foreground/5 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary font-body-md"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Target Market</label>
              <input
                value={editForm.targetMarket}
                onChange={(e) => setEditForm({ ...editForm, targetMarket: e.target.value })}
                className="w-full bg-foreground/5 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary font-body-md"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Problem</label>
              <textarea
                value={editForm.problem}
                onChange={(e) => setEditForm({ ...editForm, problem: e.target.value })}
                rows={3}
                className="w-full bg-foreground/5 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary font-body-md resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Solution</label>
              <textarea
                value={editForm.solution}
                onChange={(e) => setEditForm({ ...editForm, solution: e.target.value })}
                rows={3}
                className="w-full bg-foreground/5 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary font-body-md resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-5 py-2.5 rounded-xl bg-primary text-black font-semibold text-sm transition-colors hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Sidebar: Slide Index */}
        <aside className="w-64 glass-panel rounded-2xl p-4 flex flex-col h-full overflow-y-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-2">Slide Index</h2>
          <div className="space-y-2 flex-1">
            {slides.map((s, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-full text-left p-3 rounded-xl transition-all text-sm font-body-md truncate ${
                  currentSlide === idx 
                    ? 'bg-foreground/10 text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                {idx + 1}. {s.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Stage: Slide Presentation */}
        <section id="deck-stage" className="flex-1 glass-panel rounded-3xl p-12 flex flex-col justify-center relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/30 rounded-full blur-[100px]" />
          </div>

          <div className="w-full max-w-4xl mx-auto space-y-12 relative z-10">
            <h1 className="text-5xl font-headline-xl font-bold uppercase tracking-tight">{slide.title}</h1>
            
            <ul className="space-y-6">
              {slide.content.map((point, idx) => (
                <li key={idx} className="flex items-start text-2xl font-body-lg text-foreground/90">
                  <span className="text-primary mr-4 mt-1 material-symbols-outlined">check_circle</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slide Navigation Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 z-20">
            <button 
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="h-12 w-12 rounded-full glass-panel flex items-center justify-center hover:bg-foreground/5 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="font-mono-data text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </span>
            <button 
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="h-12 w-12 rounded-full glass-panel flex items-center justify-center hover:bg-foreground/5 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Right Sidebar: Speaker Notes */}
        <aside className="w-80 glass-panel rounded-2xl p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 text-secondary">
            <span className="material-symbols-outlined">mic</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Speaker Notes</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto font-body-md text-foreground/80 leading-relaxed text-lg">
            {slide.speakerNotes}
          </div>
        </aside>
      </div>
    </div>
  );
}
