"use client";

import { useState, use } from "react";
import Link from "next/link";
import { chatWithCoach } from "@/app/actions/simulator";

export default function SimulatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [messages, setMessages] = useState<{ role: 'coach' | 'founder', text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const startSimulation = async () => {
    setMessages([{ role: 'coach', text: "Hi! I've reviewed your pitch deck. I'm your pitch coach. What would you like to prepare for? I can ask you hard questions, or you can ask me for advice on specific slides." }]);
  };

  const handleAnswer = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'founder' as const, text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    
    try {
      const coachResponse = await chatWithCoach(id, newMessages);
      setMessages([...newMessages, { role: 'coach', text: coachResponse }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'coach', text: "Error connecting to AI Coach." }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <Link href={`/deck/${id}`} className="text-sm font-medium hover:text-primary transition-colors">
            ← Back to Deck
          </Link>
          <span className="font-bold text-lg border-l border-border pl-4">
            Pitch Q&A Coach
          </span>
        </div>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col h-[calc(100vh-80px)]">
        <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col shadow-sm relative overflow-hidden h-full">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 z-10">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl border border-primary/30">
                <span className="material-symbols-outlined text-5xl text-primary">forum</span>
              </div>
              <h2 className="text-3xl font-headline-md font-bold text-center">Ready to Prepare?</h2>
              
              <p className="text-muted-foreground text-center max-w-md font-body-md">
                Our AI coach has analyzed your pitch deck. Ask questions to prepare yourself for pitching, or ask the coach to quiz you on your business.
              </p>
              <button 
                onClick={startSimulation}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">chat</span>
                Start Q&A Session
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-6 overflow-y-auto mb-6 z-10 p-2 pr-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'founder' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-2xl ${
                    msg.role === 'coach' 
                      ? 'bg-card border border-border shadow-sm' 
                      : 'bg-primary text-primary-foreground shadow-sm'
                  }`}>
                    <p className={`text-xs font-bold mb-2 uppercase tracking-widest ${msg.role === 'coach' ? 'text-primary' : 'text-primary-foreground/70'}`}>
                      {msg.role === 'coach' ? 'Pitch Coach' : 'You'}
                    </p>
                    <p className="text-lg font-body-lg leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-5 rounded-2xl flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {messages.length > 0 && (
            <div className="flex space-x-4 z-10 bg-card p-2 rounded-xl border border-border mt-auto">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnswer(); } }}
                placeholder="Ask your coach a question..."
                className="flex-1 bg-transparent p-4 focus:outline-none resize-none font-body-md"
                rows={2}
              />
              <div className="flex items-center pr-2">
                <button 
                  onClick={handleAnswer}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  Send
                </button>
              </div>
            </div>
          )}
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </main>
    </div>
  );
}
