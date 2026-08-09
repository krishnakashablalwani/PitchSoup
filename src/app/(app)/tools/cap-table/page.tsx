"use client";

import { useState } from "react";
import { exportAsCSV } from "@/lib/export";

type Founder = { id: number, name: string, role: string, initialEquity: number | "" };

export default function CapTablePage() {
  const [founders, setFounders] = useState<Founder[]>([
    { id: 1, name: "Alice (CEO)", role: "Business & Strategy", initialEquity: 50 },
    { id: 2, name: "Bob (CTO)", role: "Product & Engineering", initialEquity: 40 }
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
  const totalInitialEquity = founders.reduce((acc, f) => acc + (Number(f.initialEquity) || 0), 0) + numOptionPool;
  const isBalanced = totalInitialEquity === 100;

  const numPreMoney = Number(preMoney) || 0;
  const numInvestment = Number(investment) || 0;
  const postMoney = numPreMoney + numInvestment;
  const dilutionPercent = postMoney === 0 ? 0 : numInvestment / postMoney; 
  
  const investorEquity = dilutionPercent * 100;
  const retentionMultiplier = 1 - dilutionPercent;

  const updateFounder = (id: number, field: keyof Founder, value: string | number) => {
    setFounders(founders.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const addFounder = () => {
    setFounders([...founders, { id: Date.now(), name: "New Co-founder", role: "Role", initialEquity: 0 }]);
  };

  const removeFounder = (id: number) => {
    setFounders(founders.filter(f => f.id !== id));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(currencies[currency].locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);
  };

  const handleExportCSV = () => {
    const rows = [
      ...founders.map(f => ({
        Shareholder: f.name,
        "Pre-Investment %": (Number(f.initialEquity) || 0).toFixed(1),
        "Post-Investment %": ((Number(f.initialEquity) || 0) * retentionMultiplier).toFixed(1),
        "Post-Money Value": formatCurrency(postMoney * ((Number(f.initialEquity) || 0) * retentionMultiplier / 100)),
      })),
      { Shareholder: "Option Pool", "Pre-Investment %": numOptionPool.toFixed(1), "Post-Investment %": (numOptionPool * retentionMultiplier).toFixed(1), "Post-Money Value": formatCurrency(postMoney * (numOptionPool * retentionMultiplier / 100)) },
      { Shareholder: "Seed Investors", "Pre-Investment %": "0.0", "Post-Investment %": investorEquity.toFixed(1), "Post-Money Value": formatCurrency(numInvestment) },
    ];
    exportAsCSV(rows, "cap-table");
  };

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto bg-background text-foreground font-sans">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-headline-xl font-bold tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl">calculate</span>
            Cap Table & Dilution Modeler
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-body-md">Model equity splits, option pools, and funding round dilution.</p>
          <div className="flex gap-3 mt-4">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-foreground/5 border border-border rounded-xl px-4 py-2 font-mono-data focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.keys(currencies).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>
        </div>
        {!isBalanced && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-xl font-medium mb-8 text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            Total initial equity must equal 100%. Currently at {totalInitialEquity}%.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-headline-md font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  Founding Team (Pre-Seed)
                </h2>
                <button 
                  onClick={addFounder}
                  className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors text-sm font-bold border border-border"
                >
                  + Add Founder
                </button>
              </div>

              <div className="space-y-4">
                {founders.map((founder) => (
                  <div key={founder.id} className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border">
                    <input 
                      value={founder.name}
                      onChange={(e) => updateFounder(founder.id, 'name', e.target.value)}
                      className="flex-1 bg-transparent border-b border-border px-2 py-1 focus:outline-none focus:border-primary font-body-md"
                      placeholder="Name"
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        value={founder.initialEquity}
                        onChange={(e) => updateFounder(founder.id, 'initialEquity', e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-20 bg-background border border-border rounded-lg p-2 text-center focus:outline-none focus:border-primary font-mono-data"
                      />
                      <span className="font-bold">%</span>
                      <button onClick={() => removeFounder(founder.id)} className="ml-2 text-destructive hover:opacity-80 p-2">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 items-center bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <div className="flex-1">
                    <p className="font-bold">Employee Option Pool</p>
                    <p className="text-xs text-muted-foreground mt-1">Reserved for future hires (Standard is 10-20%)</p>
                  </div>
                  <div className="flex items-center gap-2 pr-10">
                    <input 
                      type="number"
                      value={optionPool}
                      onChange={(e) => setOptionPool(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-20 bg-background border border-border rounded-lg p-2 text-center focus:outline-none focus:border-primary font-mono-data"
                    />
                    <span className="font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-headline-md font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">payments</span>
                Seed Round Investment
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Pre-Money Valuation</label>
                  <div className="flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
                    <span className="text-muted-foreground font-bold">$</span>
                    <input 
                      type="number"
                      value={preMoney}
                      onChange={(e) => setPreMoney(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-transparent p-3 focus:outline-none font-mono-data text-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Investment Amount</label>
                  <div className="flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-secondary transition-colors">
                    <span className="text-muted-foreground font-bold">$</span>
                    <input 
                      type="number"
                      value={investment}
                      onChange={(e) => setInvestment(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-transparent p-3 focus:outline-none font-mono-data text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output & Visualization */}
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8 shadow-sm relative overflow-hidden">
              <h2 className="text-xl font-headline-md font-bold mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">analytics</span>
                Post-Money Cap Table
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-1 uppercase font-bold tracking-wider">Post-Money Val</p>
                  <p className="text-2xl font-mono-data font-bold text-primary">{formatCurrency(postMoney)}</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-1 uppercase font-bold tracking-wider">Dilution</p>
                  <p className="text-2xl font-mono-data font-bold text-destructive">{(dilutionPercent * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                  <span>Shareholder</span>
                  <div className="flex gap-8 w-48 justify-end">
                    <span>Pre</span>
                    <span>Post</span>
                  </div>
                </div>

                {founders.map((f, i) => (
                  <div key={f.id} className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${['bg-primary', 'bg-secondary', 'bg-yellow-500', 'bg-purple-500'][i % 4]}`}></span>
                      <span className="font-body-md truncate max-w-[150px]">{f.name}</span>
                    </span>
                    <div className="flex gap-8 w-48 justify-end font-mono-data">
                      <span className="text-muted-foreground">{(Number(f.initialEquity) || 0).toFixed(1)}%</span>
                      <span className="font-bold text-foreground">{((Number(f.initialEquity) || 0) * retentionMultiplier).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-muted-foreground"></span>
                    <span className="font-body-md">Option Pool</span>
                  </span>
                  <div className="flex gap-8 w-48 justify-end font-mono-data">
                    <span className="text-muted-foreground">{numOptionPool.toFixed(1)}%</span>
                    <span className="font-bold text-foreground">{(numOptionPool * retentionMultiplier).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 bg-green-500/5 px-2 rounded-lg -mx-2">
                  <span className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="font-bold text-green-600 dark:text-green-400">Seed Investors</span>
                  </span>
                  <div className="flex gap-8 w-48 justify-end font-mono-data">
                    <span className="text-muted-foreground">0.0%</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{investorEquity.toFixed(1)}%</span>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm flex gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
              <div>
                <h3 className="font-bold mb-1">VC Insight</h3>
                <p className="text-sm text-foreground/80 leading-relaxed font-body-md">
                  Investors want to see a cap table where founders are incentivized (keep 50%+ post-Series A) and there's enough room (10-15% option pool) to hire top early employees. 
                  In a standard Seed round, expect to sell 15-25% of your company.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
