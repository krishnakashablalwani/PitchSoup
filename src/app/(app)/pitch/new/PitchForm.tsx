"use client";

import { useState } from "react";
import { createPitch, createPitchFromBrainDump } from "@/app/actions/pitch";
import { SubmitButton } from "./SubmitButton";
import { Sparkles, Loader2, ArrowRight, ChevronRight, CheckCircle2, MessageSquare, Zap, Route } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ONBOARDING_QUESTIONS = [
  {
    id: "stage",
    title: "What stage is your startup at?",
    options: ["Idea stage", "Building an MVP", "Early traction / first customers", "Growing business"]
  },
  {
    id: "goal",
    title: "What do you need help with first?",
    options: ["Create a pitch deck", "Find investors", "Build a financial model", "Prepare for investor meetings"]
  },
  {
    id: "industry",
    title: "What industry are you in?",
    options: ["SaaS / AI", "Fintech", "Healthcare", "E-commerce", "Other"]
  },
  {
    id: "experience",
    title: "How familiar are you with fundraising?",
    options: ["I'm a first-time founder", "I've done some fundraising", "I'm experienced"]
  }
];

export default function PitchForm() {
  const [creationMode, setCreationMode] = useState<"workflow" | "braindump" | null>(null);
  const [step, setStep] = useState(0);
  
  // Onboarding state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Form state
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [startupName, setStartupName] = useState("");
  const [features, setFeatures] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [traction, setTraction] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    if (step < ONBOARDING_QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300); // Auto-advance
    }
  };

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

  const renderOnboardingStep = () => {
    const question = ONBOARDING_QUESTIONS[step];
    return (
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 text-sienna-brown font-medium mb-8 bg-sienna-brown/10 w-fit px-3 py-1.5 rounded-full text-sm">
          <MessageSquare className="w-4 h-4" /> PitchSoup AI Copilot
        </div>
        
        <h2 className="text-2xl font-serif text-text-primary">
          Let's set up your startup workflow.
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          {question.title} <span className="text-text-tertiary">({step + 1}/{ONBOARDING_QUESTIONS.length})</span>
        </p>

        <div className="space-y-3">
          {question.options.map(option => {
            const isSelected = answers[question.id] === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(question.id, option)}
                className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected 
                    ? "border-sienna-brown bg-blush-peach/10 text-sienna-brown shadow-subtle-2" 
                    : "border-border-subtle bg-bg-secondary hover:border-text-tertiary text-text-secondary hover:text-text-primary"
                }`}
              >
                <span className="font-medium text-[15px]">{option}</span>
                {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 opacity-40" />}
              </button>
            );
          })}
        </div>
        
        {step === ONBOARDING_QUESTIONS.length - 1 && answers[question.id] && (
           <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="button"
              onClick={() => setStep(step + 1)}
              className="w-full mt-6 bg-ink-black text-paper-white rounded-buttons py-3.5 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
           >
             Generate my personalized workflow <ArrowRight className="w-4 h-4" />
           </motion.button>
        )}
      </motion.div>
    );
  };

  const renderBrainDump = () => (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      action={createPitchFromBrainDump}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium mb-8 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-full text-sm border border-emerald-500/20">
        <Zap className="w-4 h-4" /> AI Magic Dump
      </div>
      
      <h2 className="text-2xl font-serif text-text-primary">
        Dump your thoughts.
      </h2>
      <p className="text-text-secondary text-sm mb-6 leading-relaxed">
        Don't worry about formatting, market size, or structure. Just tell us what you're building, why it matters, and how it makes money. Our VC AI will extrapolate the rest and build a 12-slide deck.
      </p>

      <textarea
        required
        name="braindump"
        rows={8}
        className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-sm md:text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-sans resize-none"
        placeholder="So basically we are building Uber but for private jets. The problem is private jets fly empty 40% of the time. We take 10% on every booking..."
      />

      <SubmitButton label="Generate Deck via AI" loadingLabel="Extrapolating & Generating..." />
    </motion.form>
  );

  const renderModeSelector = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-serif text-text-primary">How do you want to start?</h2>
        <p className="text-text-secondary text-sm">Choose how you want to build your pitch deck.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setCreationMode("braindump")}
          className="group text-left p-6 rounded-2xl border border-border-subtle bg-bg-secondary hover:border-emerald-500 hover:shadow-subtle-2 transition-all flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-1">Magic Mode</h3>
            <p className="text-xs text-text-secondary leading-relaxed">Fastest way. Just type a messy paragraph of what you're building, and the AI will extrapolate the business model, market size, and generate 12 slides instantly.</p>
          </div>
        </button>

        <button
          onClick={() => setCreationMode("workflow")}
          className="group text-left p-6 rounded-2xl border border-border-subtle bg-bg-secondary hover:border-sienna-brown hover:shadow-subtle-2 transition-all flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-sienna-brown/10 flex items-center justify-center border border-sienna-brown/20 text-sienna-brown group-hover:scale-110 transition-transform">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-1">Guided Workflow</h3>
            <p className="text-xs text-text-secondary leading-relaxed">More control. Go through a step-by-step wizard to define your problem, solution, and features before the AI generates your deck.</p>
          </div>
        </button>
      </div>
    </motion.div>
  );

  const renderFormStep = () => (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      action={createPitch} 
      className="space-y-5"
    >
      <div className="bg-bg-secondary/50 border border-border-subtle rounded-xl p-4 mb-6 flex items-start gap-3">
         <Sparkles className="w-5 h-5 text-sienna-brown shrink-0 mt-0.5" />
         <div>
            <h4 className="text-sm font-medium text-text-primary">Workflow Customized!</h4>
            <p className="text-xs text-text-secondary mt-1">
              Based on your answers (<b>{answers.industry}</b>, <b>{answers.stage}</b>), we will tailor the AI generation for your deck. Let's get the core details.
            </p>
         </div>
      </div>

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
            value={businessModel}
            onChange={e => setBusinessModel(e.target.value)}
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
            value={traction}
            onChange={e => setTraction(e.target.value)}
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
          value={targetMarket}
          onChange={e => setTargetMarket(e.target.value)}
          className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-sienna-brown transition-all font-sans"
          placeholder="Mid-to-large e-commerce fulfillment centers"
        />
      </div>
      
      {/* Hidden inputs to pass onboarding context to the server action */}
      <input type="hidden" name="copilotStage" value={answers.stage || ""} />
      <input type="hidden" name="copilotGoal" value={answers.goal || ""} />
      <input type="hidden" name="copilotIndustry" value={answers.industry || ""} />
      <input type="hidden" name="copilotExperience" value={answers.experience || ""} />

      <SubmitButton />
    </motion.form>
  );

  return (
    <div className="max-w-xl mx-auto py-8">
      <AnimatePresence mode="wait">
        {!creationMode && renderModeSelector()}
        {creationMode === "braindump" && renderBrainDump()}
        {creationMode === "workflow" && (step < ONBOARDING_QUESTIONS.length ? renderOnboardingStep() : renderFormStep())}
      </AnimatePresence>
    </div>
  );
}
