"use client";

import { useState, use } from "react";
import Link from "next/link";

export default function OutreachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [emailContent, setEmailContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetVC, setTargetVC] = useState("Andreessen Horowitz");

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchId: id, targetVC }),
      });
      const data = await response.json();
      if (data.email) {
        setEmailContent(data.email);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto mt-8">
        <div className="mb-6">
          <Link
            href={`/deck/${id}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Deck
          </Link>
        </div>
        <div className="bg-[#111827] border border-[#2d3748] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <h1 className="text-3xl font-extrabold text-white mb-4">
            Cold Email Generator
          </h1>
          <p className="text-[#CCCCFF]/70 mb-8 font-medium">
            Generate a personalized, hyper-targeted cold email to a specific VC
            firm using your PitchSoup data.
          </p>

          <div className="space-y-4 mb-8">
            <label className="block text-sm font-semibold text-white">
              Target VC Firm / Partner
            </label>
            <input
              value={targetVC}
              onChange={(e) => setTargetVC(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              placeholder="e.g. Sequoia Capital, Y Combinator..."
            />
            <button
              onClick={generateEmail}
              disabled={loading}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Drafting Email..." : "Generate Cold Email ⚡"}
            </button>
          </div>

          {emailContent && (
            <div className="mt-8 p-6 bg-black border border-[#6366F1]/50 rounded-xl">
              <h3 className="text-[#6366F1] font-bold mb-4 uppercase text-sm tracking-wider">
                Generated Draft
              </h3>
              <div className="whitespace-pre-wrap text-white text-lg">
                {emailContent}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(emailContent)}
                className="mt-6 px-4 py-2 border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white rounded-lg transition-colors text-sm font-bold"
              >
                Copy to Clipboard
              </button>
            </div>
          )}

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
