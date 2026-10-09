"use client";

import { useState } from "react";
import { exportAsCSV } from "@/lib/export";
import {
  Users,
  Plus,
  Trash2,
  DollarSign,
  PieChart,
  Download,
  AlertCircle,
  TrendingDown,
} from "lucide-react";

type Founder = {
  id: number;
  name: string;
  role: string;
  initialEquity: number | "";
};

export default function CapTableClient() {
  const [founders, setFounders] = useState<Founder[]>([
    { id: 1, name: "Alice (CEO)", role: "Business & Strategy", initialEquity: 50 },
    { id: 2, name: "Bob (CTO)", role: "Product & Engineering", initialEquity: 40 },
  ]);
  const [optionPool, setOptionPool] = useState<number | "">(10);
  const [preMoney, setPreMoney] = useState<number | "">(4000000);
  const [investment, setInvestment] = useState<number | "">(1000000);
  const [currency, setCurrency] = useState("USD");

  const currencies: Record<string, { symbol: string; locale: string }> = {
    USD: { symbol: "$", locale: "en-US" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" },
    INR: { symbol: "₹", locale: "en-IN" },
  };

  const numOptionPool = Number(optionPool) || 0;
  const totalInitialEquity =
    founders.reduce((acc, f) => acc + (Number(f.initialEquity) || 0), 0) +
    numOptionPool;
  const isBalanced = Math.abs(totalInitialEquity - 100) < 0.01;

  const numPreMoney = Number(preMoney) || 0;
  const numInvestment = Number(investment) || 0;
  const postMoney = numPreMoney + numInvestment;
  const dilutionPercent = postMoney === 0 ? 0 : numInvestment / postMoney;

  const investorEquity = dilutionPercent * 100;
  const retentionMultiplier = 1 - dilutionPercent;

  const updateFounder = (
    id: number,
    field: keyof Founder,
    value: string | number,
  ) => {
    setFounders(
      founders.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    );
  };

  const addFounder = () => {
    setFounders([
      ...founders,
      {
        id: Date.now(),
        name: `Founder ${founders.length + 1}`,
        role: "Co-founder",
        initialEquity: 0,
      },
    ]);
  };

  const removeFounder = (id: number) => {
    if (founders.length <= 1) return;
    setFounders(founders.filter((f) => f.id !== id));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(currencies[currency].locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportCSV = () => {
    const rows = [
      ...founders.map((f) => ({
        Shareholder: f.name,
        "Pre-Investment %": (Number(f.initialEquity) || 0).toFixed(1),
        "Post-Investment %": (
          (Number(f.initialEquity) || 0) * retentionMultiplier
        ).toFixed(1),
        "Post-Money Value": formatCurrency(
          (postMoney *
            ((Number(f.initialEquity) || 0) * retentionMultiplier)) /
            100,
        ),
      })),
      {
        Shareholder: "Option Pool",
        "Pre-Investment %": numOptionPool.toFixed(1),
        "Post-Investment %": (numOptionPool * retentionMultiplier).toFixed(1),
        "Post-Money Value": formatCurrency(
          (postMoney * (numOptionPool * retentionMultiplier)) / 100,
        ),
      },
      {
        Shareholder: "Seed Investors",
        "Pre-Investment %": "0.0",
        "Post-Investment %": investorEquity.toFixed(1),
        "Post-Money Value": formatCurrency(numInvestment),
      },
    ];
    exportAsCSV(rows, "cap-table");
  };

  const renderDoughnut = () => {
    let cumulativePercent = 0;
    const segments: any[] = [];
    const colors = ["#8B5A2B", "#10B981", "#6366F1", "#F59E0B"];
    
    const addSegment = (percent: number, color: string, label: string) => {
      if (percent <= 0) return;
      segments.push({ percent, cumulativePercent, color, label });
      cumulativePercent += percent;
    };

    founders.forEach((f, i) => {
      addSegment(((Number(f.initialEquity) || 0) * retentionMultiplier), colors[i % 4], f.name);
    });
    addSegment((numOptionPool * retentionMultiplier), "#9CA3AF", "Option Pool");
    addSegment(investorEquity, "#059669", "Seed Investors");

    return (
      <div className="relative w-48 h-48 mx-auto my-6">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="15.9155" fill="transparent" stroke="#f3f4f6" strokeWidth="31.831" className="dark:stroke-gray-800" />
          {segments.map((seg, i) => {
            const strokeDasharray = `${seg.percent} ${100 - seg.percent}`;
            const strokeDashoffset = -seg.cumulativePercent;
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="15.9155"
                fill="transparent"
                stroke={seg.color}
                strokeWidth="31.831"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-in-out hover:opacity-90 cursor-pointer"
              >
                <title>{seg.label}: {seg.percent.toFixed(1)}%</title>
              </circle>
            );
          })}
          {/* Inner cutout to make it a donut */}
          <circle cx="50" cy="50" r="12" fill="currentColor" className="text-bg-floating" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] uppercase tracking-widest text-text-muted font-semibold">Post-Money</span>
            <span className="text-sm font-mono font-bold text-text-primary">{formatCurrency(postMoney)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!isBalanced && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Total pre-seed equity must equal 100%. Currently at{" "}
              <strong>{totalInitialEquity.toFixed(1)}%</strong>.
            </span>
          </div>
          <span className="text-[11px] font-mono">
            Delta: {(100 - totalInitialEquity).toFixed(1)}%
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Founding Team Card */}
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-5 md:p-6 shadow-subtle space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sienna-brown" />
                <h2 className="font-serif text-base font-medium text-text-primary">
                  Founding Team (Pre-Seed)
                </h2>
              </div>
              <button
                onClick={addFounder}
                className="px-3 py-1.5 bg-bg-secondary hover:bg-bg-card border border-border-subtle rounded-lg text-xs font-medium text-text-primary transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-sienna-brown" />
                <span>Add Founder</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {founders.map((founder) => (
                <div
                  key={founder.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg-secondary/70 border border-border-subtle transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <input
                      value={founder.name}
                      onChange={(e) =>
                        updateFounder(founder.id, "name", e.target.value)
                      }
                      className="w-full bg-bg-floating border border-border-subtle rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-sienna-brown"
                      placeholder="Founder Name (e.g. Alice (CEO))"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center bg-bg-floating border border-border-subtle rounded-lg px-2 py-1">
                      <input
                        type="number"
                        value={founder.initialEquity}
                        onChange={(e) =>
                          updateFounder(
                            founder.id,
                            "initialEquity",
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                          )
                        }
                        className="w-12 bg-transparent text-center text-xs md:text-sm font-mono font-medium text-text-primary focus:outline-none"
                      />
                      <span className="text-xs text-text-muted font-medium ml-1">
                        %
                      </span>
                    </div>

                    {founders.length > 1 && (
                      <button
                        onClick={() => removeFounder(founder.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-text-muted hover:text-rose-600 transition-colors shrink-0"
                        title="Remove Founder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Employee Option Pool Row */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-blush-peach/25 border border-sienna-brown/20">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary">
                    Employee Option Pool
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Reserved for early hires & advisors (Standard: 10–20%)
                  </p>
                </div>
                <div className="flex items-center bg-bg-floating border border-border-subtle rounded-lg px-2 py-1 shrink-0">
                  <input
                    type="number"
                    value={optionPool}
                    onChange={(e) =>
                      setOptionPool(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-12 bg-transparent text-center text-xs md:text-sm font-mono font-medium text-text-primary focus:outline-none"
                  />
                  <span className="text-xs text-text-muted font-medium ml-1">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seed Round Investment Card */}
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-5 md:p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif text-base font-medium text-text-primary">
                Seed Round Investment
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-text-secondary font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  Pre-Money Valuation
                </label>
                <div className="flex items-center bg-bg-secondary border border-border-subtle rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-sienna-brown">
                  <span className="text-text-muted font-mono font-medium mr-2">
                    {currencies[currency].symbol}
                  </span>
                  <input
                    type="number"
                    value={preMoney}
                    onChange={(e) =>
                      setPreMoney(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full bg-transparent text-sm font-mono font-medium text-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  Investment Amount
                </label>
                <div className="flex items-center bg-bg-secondary border border-border-subtle rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-sienna-brown">
                  <span className="text-text-muted font-mono font-medium mr-2">
                    {currencies[currency].symbol}
                  </span>
                  <input
                    type="number"
                    value={investment}
                    onChange={(e) =>
                      setInvestment(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full bg-transparent text-sm font-mono font-medium text-text-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Post-Money Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-5 md:p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sienna-brown" />
                <h3 className="font-serif text-base font-medium text-text-primary">
                  Post-Money Cap Table
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-bg-secondary border border-border-subtle rounded-lg px-2 py-1 text-xs font-mono font-medium text-text-primary focus:outline-none"
                >
                  {Object.keys(currencies).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-1 rounded-lg border border-border-subtle hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-xs font-medium transition-colors flex items-center gap-1"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>
            </div>

            {/* Metric Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-secondary border border-border-subtle/80 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mb-1">
                  Post-Money Val
                </span>
                <span className="text-lg lg:text-xl font-mono font-bold text-text-primary">
                  {formatCurrency(postMoney)}
                </span>
              </div>

              <div className="bg-bg-secondary border border-border-subtle/80 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mb-1">
                  Dilution
                </span>
                <span className="text-lg lg:text-xl font-mono font-bold text-sienna-brown dark:text-blush-peach">
                  {(dilutionPercent * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Visualizer */}
            {renderDoughnut()}

            {/* Shareholder Breakdown Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10.5px] font-mono uppercase tracking-wider text-text-muted border-b border-border-subtle pb-2">
                <span>Shareholder</span>
                <div className="flex gap-6 w-36 justify-end">
                  <span>Pre</span>
                  <span>Post</span>
                </div>
              </div>

              {founders.map((f, i) => (
                <div
                  key={f.id}
                  className="flex justify-between items-center py-2 border-b border-border-subtle/40"
                >
                  <span className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        [
                          "bg-sienna-brown",
                          "bg-emerald-500",
                          "bg-indigo-500",
                          "bg-amber-500",
                        ][i % 4]
                      }`}
                    />
                    <span className="font-medium text-text-primary truncate">
                      {f.name}
                    </span>
                  </span>
                  <div className="flex gap-6 w-36 justify-end font-mono shrink-0">
                    <span className="text-text-muted">
                      {(Number(f.initialEquity) || 0).toFixed(1)}%
                    </span>
                    <span className="font-semibold text-text-primary">
                      {(
                        (Number(f.initialEquity) || 0) * retentionMultiplier
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center py-2 border-b border-border-subtle/40">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-text-muted shrink-0" />
                  <span className="font-medium text-text-primary">Option Pool</span>
                </span>
                <div className="flex gap-6 w-36 justify-end font-mono shrink-0">
                  <span className="text-text-muted">
                    {numOptionPool.toFixed(1)}%
                  </span>
                  <span className="font-semibold text-text-primary">
                    {(numOptionPool * retentionMultiplier).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 bg-emerald-500/10 px-2.5 rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Seed Investors
                  </span>
                </span>
                <div className="flex gap-6 w-36 justify-end font-mono font-semibold shrink-0">
                  <span className="text-emerald-600/70">0.0%</span>
                  <span className="text-emerald-700 dark:text-emerald-300">
                    {investorEquity.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
