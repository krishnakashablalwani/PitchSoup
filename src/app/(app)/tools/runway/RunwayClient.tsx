"use client";

import { useState } from "react";
import { exportAsCSV } from "@/lib/export";
import {
  Sliders,
  Download,
  Flame,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function RunwayClient() {
  const [cashInBank, setCashInBank] = useState<number | "">(500000);
  const [monthlyBurn, setMonthlyBurn] = useState<number | "">(40000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | "">(5000);
  const [revenueGrowth, setRevenueGrowth] = useState<number | "">(10);
  const [currency, setCurrency] = useState("USD");

  const currencies: Record<string, { symbol: string; locale: string }> = {
    USD: { symbol: "$", locale: "en-US" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" },
    INR: { symbol: "₹", locale: "en-IN" },
  };

  const formatMoney = (val: number) =>
    new Intl.NumberFormat(currencies[currency].locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);

  const projections: {
    month: number;
    cash: number;
    revenue: number;
    netBurn: number;
  }[] = [];

  let cash = Number(cashInBank) || 0;
  let rev = Number(monthlyRevenue) || 0;
  let runwayMonths = 0;
  const numMonthlyBurn = Number(monthlyBurn) || 0;
  const numRevenueGrowth = Number(revenueGrowth) || 0;

  for (let m = 1; m <= 36; m++) {
    const netBurn = numMonthlyBurn - rev;
    cash -= netBurn;
    if (cash <= 0 && runwayMonths === 0) {
      runwayMonths = m - 1;
    }
    projections.push({
      month: m,
      cash: Math.max(0, cash),
      revenue: rev,
      netBurn,
    });
    rev = rev * (1 + numRevenueGrowth / 100);
  }

  if (runwayMonths === 0) runwayMonths = 36;

  const maxCash = Math.max(
    Number(cashInBank) || 1,
    ...projections.map((p) => p.cash)
  );

  const currentNetBurn = numMonthlyBurn - (Number(monthlyRevenue) || 0);
  const isDefaultAlive = currentNetBurn <= 0;

  const handleExportCSV = () => {
    exportAsCSV(
      projections.map((p) => ({
        Month: p.month,
        "Cash Remaining": Math.round(p.cash),
        "Monthly Revenue": Math.round(p.revenue),
        "Net Burn": Math.round(p.netBurn),
      })),
      "runway-projection"
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar / Currency & Export */}
      <div className="flex items-center justify-between gap-4 bg-bg-floating border border-border-subtle rounded-2xl px-5 py-3 shadow-subtle">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sienna-brown" />
          <span className="text-xs font-medium text-text-primary">
            Cash Horizon &amp; Depletion Forecast
          </span>
          <span
            className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
              isDefaultAlive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : runwayMonths <= 6
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                : runwayMonths <= 12
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
            }`}
          >
            {isDefaultAlive ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Default Alive
              </>
            ) : runwayMonths <= 6 ? (
              <>
                <AlertTriangle className="w-3 h-3" /> Urgent: &lt;6 Mo
              </>
            ) : (
              <>
                <TrendingUp className="w-3 h-3" /> {runwayMonths} Mo Runway
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-bg-secondary border border-border-subtle rounded-lg px-2.5 py-1 text-xs font-mono font-medium text-text-primary focus:outline-none"
          >
            {Object.keys(currencies).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1 rounded-lg border border-border-subtle hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-sienna-brown" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Burn & Revenue Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-5 md:p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
              <Sliders className="w-4 h-4 text-sienna-brown" />
              <h2 className="font-serif text-base font-medium text-text-primary">
                Financial Inputs
              </h2>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  label: "Cash in Bank",
                  value: cashInBank,
                  set: setCashInBank,
                  hint: "Liquid capital & reserves",
                },
                {
                  label: "Monthly Gross Burn",
                  value: monthlyBurn,
                  set: setMonthlyBurn,
                  hint: "Salaries, servers, operations",
                },
                {
                  label: "Monthly Revenue (MRR)",
                  value: monthlyRevenue,
                  set: setMonthlyRevenue,
                  hint: "Current recognized monthly income",
                },
              ].map((input) => (
                <div key={input.label} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-medium text-text-secondary">
                      {input.label}
                    </label>
                    <span className="text-[10.5px] text-text-muted">
                      {input.hint}
                    </span>
                  </div>
                  <div className="flex items-center bg-bg-secondary border border-border-subtle rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-sienna-brown transition-all">
                    <span className="text-text-muted font-mono font-medium mr-2 text-xs">
                      {currencies[currency].symbol}
                    </span>
                    <input
                      type="number"
                      value={input.value}
                      onChange={(e) =>
                        input.set(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full bg-transparent text-sm font-mono font-medium text-text-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-medium text-text-secondary">
                    Monthly Revenue Growth Rate
                  </label>
                  <span className="text-[10.5px] text-text-muted">
                    Expected MoM expansion
                  </span>
                </div>
                <div className="flex items-center bg-bg-secondary border border-border-subtle rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-sienna-brown transition-all">
                  <input
                    type="number"
                    value={revenueGrowth}
                    onChange={(e) =>
                      setRevenueGrowth(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full bg-transparent text-sm font-mono font-medium text-text-primary focus:outline-none"
                  />
                  <span className="text-text-muted font-mono font-medium ml-2 text-xs">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Projections & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-bg-floating border border-border-subtle rounded-2xl p-4 text-center shadow-subtle">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mb-1">
                Runway Horizon
              </span>
              <p
                className={`text-2xl lg:text-3xl font-mono font-bold ${
                  runwayMonths <= 6
                    ? "text-rose-600 dark:text-rose-400"
                    : runwayMonths <= 12
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {runwayMonths >= 36 ? "36+" : runwayMonths}
              </p>
              <span className="text-[11px] text-text-secondary">months remaining</span>
            </div>

            <div className="bg-bg-floating border border-border-subtle rounded-2xl p-4 text-center shadow-subtle">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mb-1">
                Net Monthly Burn
              </span>
              <p className="text-xl lg:text-2xl font-mono font-bold text-text-primary truncate">
                {formatMoney(currentNetBurn)}
              </p>
              <span className="text-[11px] text-text-secondary">
                {currentNetBurn <= 0 ? "Cash Flow Positive" : "Monthly outflow"}
              </span>
            </div>

            <div className="bg-bg-floating border border-border-subtle rounded-2xl p-4 text-center shadow-subtle">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block mb-1">
                Break-even Target
              </span>
              <p className="text-xl lg:text-2xl font-mono font-bold text-sienna-brown dark:text-blush-peach truncate">
                {formatMoney(numMonthlyBurn)}
              </p>
              <span className="text-[11px] text-text-secondary">MRR to reach neutral</span>
            </div>
          </div>

          {/* Cash Depletion Chart Card */}
          <div className="bg-bg-floating border border-border-subtle rounded-2xl p-5 md:p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-sienna-brown" />
                <h3 className="font-serif text-base font-medium text-text-primary">
                  Cash Depletion Timeline (24 Months)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                Hover bar for details
              </span>
            </div>

            {/* Visual Bar Graph */}
            <div className="pt-4 pb-2">
              <div className="flex items-end gap-1.5 h-44 w-full">
                {projections.slice(0, 24).map((p, i) => {
                  const heightPercent = Math.max(3, (p.cash / maxCash) * 100);
                  const isDepleted = p.cash <= 0;
                  const isNearDepletion = i >= runwayMonths - 2 && !isDepleted;

                  return (
                    <div
                      key={p.month}
                      className="flex-1 h-full flex items-end group relative"
                    >
                      {/* Bar */}
                      <div
                        className={`w-full rounded-t-sm transition-all duration-200 group-hover:opacity-100 ${
                          isDepleted
                            ? "bg-rose-500/30 group-hover:bg-rose-500/50"
                            : isNearDepletion
                            ? "bg-amber-500/60 group-hover:bg-amber-500/80"
                            : i < runwayMonths
                            ? "bg-sienna-brown/75 dark:bg-sienna-brown/90 group-hover:bg-sienna-brown"
                            : "bg-border-subtle/50"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-charcoal-warm text-cream-eggshell text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-md border border-border-subtle/30 font-mono">
                        <div className="font-sans font-semibold text-[10px] text-blush-peach">
                          Month {p.month}
                        </div>
                        <div>Cash: {formatMoney(p.cash)}</div>
                        <div className="text-text-muted text-[10px]">
                          Burn: {formatMoney(p.netBurn)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X Axis labels */}
              <div className="flex justify-between text-[11px] text-text-muted mt-2 font-mono pt-1 border-t border-border-subtle">
                <span>Month 1</span>
                <span>Month 6</span>
                <span>Month 12</span>
                <span>Month 18</span>
                <span>Month 24</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-text-secondary border-t border-border-subtle/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sienna-brown/75" />
                <span>Active Runway</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/70" />
                <span>Critical Threshold (&lt;2 mo)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40" />
                <span>Depleted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
