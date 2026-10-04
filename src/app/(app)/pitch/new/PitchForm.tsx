"use client";

import { useState } from "react";
import { createPitch } from "@/app/actions/pitch";
import { SubmitButton } from "./SubmitButton";
import { Sparkles, Loader2 } from "lucide-react";

export default function PitchForm() {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [startupName, setStartupName] = useState("");
  const [features, setFeatures] = useState("");
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  const generateFeatures = async () => {
    if (!problem) {
      alert("Please describe the problem first!");
      return;
    }
    setLoadingFeatures(true);
    try {
      const res = await fetch("/api/generate-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, solution, startupName }),
      });
      const data = await res.json();
      if (data.features) {
        setFeatures((prev) =>
          prev ? prev + "\n" + data.features : data.features
        );
      } else if (data.error) {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Failed to generate features");
    }
    setLoadingFeatures(false);
  };

  return (
    <form action={createPitch} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
          Startup Name
        </label>
        <input
          required
          name="startupName"
          value={startupName}
          onChange={(e) => setStartupName(e.target.value)}
          className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans"
          placeholder="e.g. NextGen Robotics"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
          The Core Problem
        </label>
        <textarea
          required
          name="problem"
          rows={3}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans resize-none"
          placeholder="Supply chains are inefficient due to manual tracking..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
          Your Solution &amp; Tech Stack
        </label>
        <textarea
          required
          name="solution"
          rows={3}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans resize-none"
          placeholder="An AI-driven autonomous robotic sorting facility powered by..."
        />
      </div>

      {/* AI Feature Ideas */}
      <div className="bg-blush-peach/20 border border-sienna-brown/20 rounded-xl p-4 space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-text-primary">
            Features &amp; Capabilities (Optional)
          </label>
          <button
            type="button"
            onClick={generateFeatures}
            disabled={loadingFeatures}
            className="text-xs bg-sienna-brown text-paper-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {loadingFeatures ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blush-peach" />
            )}
            <span>{loadingFeatures ? "Generating..." : "AI Feature Ideas"}</span>
          </button>
        </div>
        <textarea
          name="features"
          rows={3}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className="w-full bg-bg-floating border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans resize-none"
          placeholder="List key features here, or use the AI insight button to brainstorm based on your problem..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
            Business Model
          </label>
          <input
            required
            name="businessModel"
            className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans"
            placeholder="e.g. B2B SaaS, Marketplace"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
            Traction / Validation
          </label>
          <input
            name="traction"
            className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans"
            placeholder="e.g. $10k MRR, 50k Waitlist"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
          Target Market
        </label>
        <input
          required
          name="targetMarket"
          className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans"
          placeholder="Mid-to-large e-commerce fulfillment centers"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
