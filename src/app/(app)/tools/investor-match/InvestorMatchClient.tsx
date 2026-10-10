"use client";

import { useState } from "react";
import { findInvestors, scrapeInvestorContact, generateOutreach } from "@/app/actions/match";
import {
  Users,
  Search,
  Building2,
  Sparkles,
  Loader2,
  DollarSign,
  Heart,
  FolderOpen,
} from "lucide-react";

type Pitch = {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
};

type Investor = {
  name: string;
  type: string;
  thesis: string;
  whyMatch: string;
  typicalCheck: string;
};

export default function InvestorMatchClient({ pitches }: { pitches: Pitch[] }) {
  const [selectedPitch, setSelectedPitch] = useState<string>("");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loadingContacts, setLoadingContacts] = useState<Record<string, boolean>>({});

  const handleGetContact = async (investorName: string) => {
    setLoadingContacts((prev) => ({ ...prev, [investorName]: true }));
    try {
      const pitch = pitches.find(p => p.id === selectedPitch);
      if (!pitch) return;
      
      const { email, emailBody } = await generateOutreach(investorName, pitch);
      setContacts((prev) => ({ ...prev, [investorName]: email }));
      setDrafts((prev) => ({ ...prev, [investorName]: emailBody }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContacts((prev) => ({ ...prev, [investorName]: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleMatch = async () => {
    if (!selectedPitch) return;
    const pitch = pitches.find((p) => p.id === selectedPitch);
    if (!pitch) return;

    setLoading(true);
    setError("");
    setInvestors([]);

    try {
      const results = await findInvestors(pitch);
      setInvestors(results);
    } catch (err) {
      console.error(err);
      setError("Failed to find investors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sienna-brown" />
            <h3 className="font-serif text-base font-medium text-text-primary">
              Select Your Startup to Find Investor Matches
            </h3>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Thesis-Fit Matching
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {pitches.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPitch(p.id);
                setInvestors([]);
              }}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedPitch === p.id
                  ? "border-sienna-brown ring-2 ring-sienna-brown bg-blush-peach/30 shadow-sm"
                  : "border-border-subtle bg-bg-secondary hover:bg-bg-card hover:border-border-subtle"
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

        <button
          onClick={handleMatch}
          disabled={!selectedPitch || loading}
          className="w-full bg-ink-black text-paper-white rounded-buttons text-sm font-medium py-3.5 px-6 shadow-subtle hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blush-peach" />
              <span>Matching Theses...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-blush-peach" />
              <span>Find Aligned VCs</span>
            </>
          )}
        </button>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      {investors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-border-subtle">
            <Sparkles className="w-4 h-4 text-sienna-brown" />
            <h3 className="font-serif text-base font-medium text-text-primary">
              Top Matched VC Funds &amp; Angels ({investors.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {investors.map((inv, idx) => (
              <div
                key={idx}
                className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle hover:border-sienna-brown/40 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-text-primary flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sienna-brown" />
                      {inv.name}
                    </h4>
                    <span className="inline-block mt-1 bg-blush-peach/40 text-sienna-brown dark:text-blush-peach text-[11px] font-medium px-2 py-0.5 rounded-full">
                      {inv.type}
                    </span>
                  </div>

                  <div className="bg-bg-secondary px-3.5 py-1.5 rounded-xl border border-border-subtle text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider block">
                      Typical Check
                    </span>
                    <span className="font-mono text-xs font-bold text-text-primary">
                      {inv.typicalCheck}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 bg-bg-secondary/50 border border-border-subtle p-3 rounded-xl mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-text-secondary">
                      Outreach Contact &amp; Draft
                    </div>
                    {contacts[inv.name] ? (
                      <a 
                        href={(() => {
                          const contact = contacts[inv.name];
                          if (contact.includes('@')) return `mailto:${contact}`;
                          const urlPart = contact.split(' ').pop();
                          if (urlPart) return urlPart.startsWith('http') ? urlPart : `https://${urlPart}`;
                          return "#";
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20 transition-colors flex items-center gap-2 truncate max-w-[200px] sm:max-w-[300px]"
                        title={contacts[inv.name]}
                      >
                        {contacts[inv.name]}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleGetContact(inv.name)}
                        disabled={loadingContacts[inv.name]}
                        className="text-xs font-medium bg-ink-black text-paper-white px-3 py-1.5 rounded-lg shadow-subtle hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {loadingContacts[inv.name] ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Preparing...</>
                        ) : (
                          <><Search className="w-3 h-3" /> Get LinkedIn Contact &amp; Draft Pitch</>
                        )}
                      </button>
                    )}
                  </div>
                  
                  
                  {drafts[inv.name] && (
                    <div className="mt-2 relative group">
                      <textarea
                        value={drafts[inv.name]}
                        onChange={(e) => setDrafts({ ...drafts, [inv.name]: e.target.value })}
                        className="w-full p-3 bg-bg-floating border border-border-subtle rounded-lg text-xs font-sans text-text-primary leading-relaxed shadow-xs focus:ring-1 focus:ring-sienna-brown focus:outline-none resize-y min-h-[120px]"
                      />
                      <button
                        onClick={() => copyToClipboard(drafts[inv.name])}
                        className="absolute top-2 right-2 p-1.5 bg-bg-secondary text-text-muted hover:text-text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity border border-border-subtle"
                        title="Copy draft"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {contacts[inv.name] && (
                    <a
                      href={`/investor/${encodeURIComponent(inv.name)}`}
                      className="mt-2 w-full bg-sienna-brown text-paper-white px-3 py-2 rounded-lg text-xs font-medium text-center hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-subtle"
                    >
                      View Full Company &amp; Partner Deep Dive &rarr;
                    </a>
                  )}
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div>
                    <h5 className="font-semibold text-text-secondary uppercase tracking-wider text-[11px] mb-1">
                      Investment Thesis
                    </h5>
                    <p className="text-text-primary leading-relaxed">
                      {inv.thesis}
                    </p>
                  </div>

                  <div className="bg-blush-peach/20 border border-sienna-brown/20 p-3.5 rounded-xl">
                    <h5 className="font-semibold text-sienna-brown dark:text-blush-peach uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                      <Heart className="w-3 h-3" />
                      Why It&apos;s a Strategic Fit
                    </h5>
                    <p className="text-text-primary leading-relaxed">
                      {inv.whyMatch}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pitches.length === 0 && (
        <div className="text-center p-12 bg-bg-floating border border-border-subtle rounded-2xl shadow-subtle flex flex-col items-center">
          <FolderOpen className="w-8 h-8 text-text-muted mb-2" />
          <h4 className="font-serif text-base font-medium text-text-primary mb-1">
            No Pitches Found
          </h4>
          <p className="text-xs text-text-secondary font-sans mb-4">
            Create a pitch deck first before running investor thesis matching.
          </p>
          <a
            href="/pitch/new"
            className="px-5 py-2.5 bg-ink-black text-paper-white rounded-lg text-xs font-medium shadow-subtle hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Create Pitch Deck
          </a>
        </div>
      )}
    </div>
  );
}
