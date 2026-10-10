"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { chatWithCoach } from "@/app/actions/simulator";
import {
  MessageSquare,
  Bot,
  User,
  Send,
  Trash2,
  Sparkles,
  Target,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

type Pitch = {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
};

export default function SimulatorClient({ pitches }: { pitches: Pitch[] }) {
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [messages, setMessages] = useState<{ role: "coach" | "founder"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoaded) {
      scrollToBottom();
    }
  }, [messages, isLoaded, loading]);

  // Load chat history when a pitch is selected
  useEffect(() => {
    if (selectedPitch) {
      const savedHistory = localStorage.getItem(`pitchsoup_simulator_${selectedPitch.id}`);
      if (savedHistory) {
        try {
          setMessages(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Failed to parse chat history");
        }
      } else {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
    setIsLoaded(true);
  }, [selectedPitch]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (isLoaded && selectedPitch && messages.length > 0) {
      localStorage.setItem(`pitchsoup_simulator_${selectedPitch.id}`, JSON.stringify(messages));
    }
  }, [messages, selectedPitch, isLoaded]);

  const clearHistory = () => {
    if (!selectedPitch) return;
    setMessages([]);
    localStorage.removeItem(`pitchsoup_simulator_${selectedPitch.id}`);
    toast.success("Chat history cleared");
  };

  const startSimulation = async () => {
    setMessages([
      {
        role: "coach",
        text: "Hi! I've reviewed your pitch deck. I'm your pitch coach. What would you like to prepare for? I can ask you hard questions, or you can ask me for advice on specific slides.",
      },
    ]);
  };

  const handleAnswer = async () => {
    if (!input.trim() || !selectedPitch) return;

    const userMessage = { role: "founder" as const, text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const coachResponse = await chatWithCoach(selectedPitch.id, newMessages);
      setMessages([...newMessages, { role: "coach", text: coachResponse }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "coach", text: "Error connecting to AI Coach." },
      ]);
    }

    setLoading(false);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto space-y-6">
      {/* Pitch Selector Card */}
      <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sienna-brown" />
            <h3 className="font-serif text-base font-medium text-text-primary">
              Select Pitch Deck for Q&amp;A
            </h3>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            AI Coach Simulator
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {pitches.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPitch(p)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedPitch?.id === p.id
                  ? "border-sienna-brown/60 bg-blush-peach/25 shadow-xs"
                  : "border-border-subtle bg-bg-secondary hover:bg-bg-card"
              }`}
            >
              <p className="font-serif text-sm font-medium text-text-primary truncate">
                {p.startupName}
              </p>
              <p className="text-xs text-text-secondary truncate mt-1">
                {p.targetMarket || "Target Market"}
              </p>
            </button>
          ))}
        </div>

        {pitches.length === 0 && (
          <div className="text-center py-6 flex flex-col items-center">
            <p className="text-xs text-text-secondary max-w-sm mb-4 font-sans">
              Create a pitch deck first, and then come back to simulate partner meetings with an AI coach.
            </p>
            <Link
              href="/pitch/new"
              className="px-4 py-2 bg-ink-black text-paper-white rounded-buttons text-xs font-medium flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blush-peach" />
              <span>Create Pitch Deck</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Chat Panel */}
      {selectedPitch && (
        <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 flex flex-col shadow-subtle min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
            <div>
              <h1 className="font-serif text-lg font-medium text-text-primary">
                {selectedPitch.startupName} Q&amp;A Session
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs font-medium text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear History
                </button>
              )}
              <Link
                href={`/deck/${selectedPitch.id}`}
                className="text-xs font-medium text-sienna-brown dark:text-blush-peach hover:underline flex items-center gap-1"
                target="_blank"
              >
                View Deck Slides &rarr;
              </Link>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-blush-peach/40 text-sienna-brown flex items-center justify-center mb-2">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-xl font-medium text-text-primary">
                Ready to Prepare Your Pitch?
              </h2>
              <p className="text-xs md:text-sm text-text-secondary max-w-md font-sans leading-relaxed">
                Our AI coach has synthesized your business model, problem statement, and market. Ask questions about your pitch or test your answers against VC skepticism.
              </p>
              <button
                onClick={startSimulation}
                className="mt-4 px-6 py-2.5 bg-ink-black text-paper-white rounded-buttons text-xs font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-subtle"
              >
                <Sparkles className="w-3.5 h-3.5 text-blush-peach" />
                <span>Start Q&amp;A Session</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-4 overflow-y-auto mb-4 pr-2 custom-scrollbar max-h-[50vh]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "founder" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      msg.role === "coach"
                        ? "bg-bg-secondary border border-border-subtle text-text-primary shadow-xs"
                        : "bg-sienna-brown text-paper-white shadow-xs"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 mb-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        msg.role === "coach"
                          ? "text-sienna-brown dark:text-blush-peach"
                          : "text-blush-peach"
                      }`}
                    >
                      {msg.role === "coach" ? (
                        <>
                          <Bot className="w-3 h-3" />
                          <span>AI Coach</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" />
                          <span>You (Founder)</span>
                        </>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-bg-secondary border border-border-subtle p-3 rounded-2xl flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-sienna-brown rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-sienna-brown rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-sienna-brown rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat Input Bar */}
          {messages.length > 0 && (
            <div className="flex items-center gap-2 bg-bg-secondary border border-border-subtle p-2 rounded-xl mt-auto focus-within:ring-1 focus-within:ring-sienna-brown transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAnswer();
                  }
                }}
                placeholder="Ask your coach or reply to the question..."
                className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm text-text-primary placeholder:text-text-muted focus:outline-none resize-none font-sans"
                rows={1}
              />
              <button
                onClick={handleAnswer}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-ink-black text-paper-white rounded-lg text-xs font-medium disabled:opacity-50 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 shrink-0"
              >
                <Send className="w-3 h-3" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
