"use client";

import { exportAsCSV } from "@/lib/export";

type Pitch = {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  createdAt: string;
  deckData?: string;
};

export default function ExportHubClient({ pitches }: { pitches: Pitch[] }) {
  const handleExportAllCSV = () => {
    exportAsCSV(
      pitches.map((p) => ({
        "Startup Name": p.startupName,
        Problem: p.problem,
        Solution: p.solution,
        "Target Market": p.targetMarket,
        "Created At": new Date(p.createdAt).toLocaleDateString(),
      })),
      "all-pitches"
    );
  };

  const handleExportSingleCSV = (pitch: Pitch) => {
    let slides: any[] = [];
    try {
      if (pitch.deckData) slides = JSON.parse(pitch.deckData);
    } catch (e) {}

    if (slides.length > 0) {
      exportAsCSV(
        slides.map((s: any, i: number) => ({
          "Slide #": i + 1,
          Title: s.title,
          Content: (s.content || []).join(" | "),
          "Speaker Notes": s.speakerNotes,
        })),
        `${pitch.startupName}-deck`
      );
    } else {
      exportAsCSV(
        [
          {
            "Startup Name": pitch.startupName,
            Problem: pitch.problem,
            Solution: pitch.solution,
            "Target Market": pitch.targetMarket,
          },
        ],
        `${pitch.startupName}-data`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Export */}
      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-headline-md font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">table_view</span>
            Export All Pitches
          </h3>
          <p className="text-muted-foreground font-body-md mt-1">
            Download a CSV containing all {pitches.length} pitch summaries.
          </p>
        </div>
        <button
          onClick={handleExportAllCSV}
          disabled={pitches.length === 0}
          className="px-6 py-3 rounded-xl bg-primary text-black font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download CSV
        </button>
      </div>

      {/* Individual Exports */}
      <div className="space-y-4">
        <h3 className="text-lg font-headline-md font-semibold">Individual Pitch Exports</h3>
        {pitches.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 text-center text-muted-foreground">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
            <p>No pitches to export yet.</p>
          </div>
        )}
        {pitches.map((pitch) => {
          let slideCount = 0;
          try {
            if (pitch.deckData) slideCount = JSON.parse(pitch.deckData).length;
          } catch (e) {}

          return (
            <div
              key={pitch.id}
              className="glass-panel rounded-2xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold truncate">{pitch.startupName}</h4>
                  <p className="text-xs text-muted-foreground">
                    {slideCount > 0 ? `${slideCount} slides` : "No deck"} · {new Date(pitch.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleExportSingleCSV(pitch)}
                  className="px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">table_view</span>
                  CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
