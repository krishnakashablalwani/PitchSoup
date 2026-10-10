"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Building2, Target, Users, AlertTriangle, Briefcase, ChevronRight, Mail, FolderOpen } from "lucide-react";

type Profile = {
  investmentThesis: string;
  partnerBios: {
    name: string;
    focus: string;
    background: string;
    email: string;
  }[];
  redFlags: string[];
};

export default function InvestorProfileClient({ firmName, profile }: { firmName: string, profile: Profile }) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const { user } = useUser();

  const generateDraft = (partner: any) => {
    const firstName = partner.name.split(' ')[0];
    const founderName = user?.firstName || "Founder";
    const template = `Hi ${firstName},\n\nI'm building something in your space and noticed your specific focus on ${partner.focus}.\n\nWe're tackling a major problem in the market and gaining early traction. Would you be open to a brief chat or reviewing our deck?\n\nBest,\n${founderName}`;
    setDrafts(prev => ({ ...prev, [partner.name]: template }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/tools/investor-match" className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Investor Match
      </Link>

      <div className="bg-bg-floating border border-border-subtle rounded-2xl p-8 shadow-subtle space-y-8">
        
        {/* Thesis */}
        <section className="bg-bg-secondary/40 border border-border-subtle p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif text-base font-medium text-text-primary">Investment Thesis</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-sans whitespace-pre-wrap">
            {typeof profile.investmentThesis === 'string' 
              ? profile.investmentThesis 
              : Object.entries(profile.investmentThesis).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n\n')}
          </p>
        </section>

        {/* Partners */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border-subtle">
            <Users className="w-5 h-5 text-sienna-brown" />
            <h2 className="font-serif text-lg font-medium text-text-primary">Key Partners to Pitch</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.partnerBios.map((partner, idx) => (
              <div key={idx} className="bg-paper-white border border-border-subtle p-4 rounded-xl shadow-xs hover:border-sienna-brown/30 transition-colors">
                <h4 className="font-serif text-sm font-medium text-text-primary mb-0.5">{partner.name}</h4>
                {partner.email && (
                  <a href={partner.email.includes("http") ? partner.email : `mailto:${partner.email}`} className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline mb-2 truncate bg-emerald-500/10 px-2 py-1 rounded w-fit">
                    <Mail className="w-3 h-3" />
                    {partner.email}
                  </a>
                )}
                <div className="inline-block bg-blush-peach/30 text-sienna-brown text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full mb-3">
                  {partner.focus}
                </div>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed mb-3">
                  {partner.background}
                </p>

                {drafts[partner.name] ? (
                  <div className="mt-3 relative group">
                    <textarea
                      value={drafts[partner.name]}
                      onChange={(e) => setDrafts({ ...drafts, [partner.name]: e.target.value })}
                      className="w-full p-2.5 bg-bg-secondary/50 border border-border-subtle rounded-lg text-[11px] font-sans text-text-primary leading-relaxed focus:ring-1 focus:ring-sienna-brown focus:outline-none resize-y min-h-[100px]"
                    />
                    <button
                      onClick={() => copyToClipboard(drafts[partner.name])}
                      className="absolute top-2 right-2 p-1.5 bg-bg-floating text-text-muted hover:text-text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity border border-border-subtle shadow-xs"
                      title="Copy draft"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => generateDraft(partner)}
                    className="mt-1 w-full bg-bg-secondary hover:bg-bg-card border border-border-subtle text-text-primary text-[11px] font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-text-muted" />
                    Draft Outreach Email
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Red Flags */}
        <section className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="font-serif text-base font-medium text-rose-700 dark:text-rose-400">Pitching Red Flags</h3>
          </div>
          <ul className="space-y-2">
            {profile.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-rose-700/80 dark:text-rose-300/80 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}
