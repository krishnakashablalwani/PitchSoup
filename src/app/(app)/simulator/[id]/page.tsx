"use client";

import { useState, use } from "react";
import Link from "next/link";
import { chatWithCoach } from "@/app/actions/simulator";
import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  MessageSquare,
  User,
} from "lucide-react";

export default function SimulatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [messages, setMessages] = useState<
    { role: "coach" | "founder"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const startSimulation = async () => {
    setMessages([
      {
        role: "coach",
        text: "Hi! I've reviewed your pitch deck. I'm your pitch coach. What would you like to prepare for? I can ask you hard questions, or you can ask me for advice on specific slides.",
      },
    ]);
  };

  const handleAnswer = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "founder" as const, text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const coachResponse = await chatWithCoach(id, newMessages);
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

  return (
    <div className="flex-1 min-h-screen bg-bg-primary text-text-primary p-6 md:p-8 flex flex-col font-sans">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto mb-6 flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link
            href="/simulator"
            className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
            title="Back to Pitches"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-medium text-text-primary">
              Pitch Q&amp;A Coach
            </h1>
            <p className="text-xs text-text-secondary">
              Interactive prep &amp; VC stress testing
            </p>
          </div>
        </div>

        <Link
          href={`/deck/${id}`}
          className="text-xs font-medium text-sienna-brown dark:text-blush-peach hover:underline"
        >
          View Deck Slides →
        </Link>
      </div>

      {/* Main Chat Panel */}
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        <div className="bg-bg-floating border border-border-subtle rounded-2xl p-6 flex-1 flex flex-col shadow-subtle min-h-[500px]">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-blush-peach/40 text-sienna-brown flex items-center justify-center mb-2">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-text-primary">
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
            <div className="flex-1 flex flex-col space-y-4 overflow-y-auto mb-4 pr-2 custom-scrollbar max-h-[60vh]">
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
      </main>
    </div>
  );
}
