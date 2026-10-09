import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPitchesForUser } from '@/lib/mockPitch';
import { Presentation, MessageSquare, Target } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  // Safely fetch user to prevent Clerk API rate limits/errors from crashing the page
  const userPromise = currentUser().catch((err) => {
    console.error("Failed to fetch current user from Clerk:", err);
    return null;
  });

  const [user, pitches] = await Promise.all([
    userPromise,
    getPitchesForUser(userId)
  ]);

  const firstName = user?.firstName || "Founder";

  return (
    <div className="flex-1 min-h-screen bg-bg-primary text-text-primary overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-12">
        
        {/* Editorial Hero */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col max-w-xl">
            <h1 className="font-serif text-[2.5rem] lg:text-[3.25rem] text-text-primary mb-4 leading-tight tracking-tight">
              {greeting}, <br/><i className="text-text-secondary">{firstName}.</i>
            </h1>
            <p className="text-[1.05rem] text-text-secondary font-sans leading-relaxed">
              Your startup command center. Start cooking a new pitch deck, run financial simulations, or stress-test your existing deck against AI VCs.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/tools/stress-test"
              className="px-5 py-2.5 bg-transparent text-text-primary border border-ink-black rounded-buttons font-sans text-[14px] font-medium transition-colors hover:bg-bg-secondary"
            >
              Test Deck
            </Link>
            <Link 
              href="/pitch/new"
              className="px-5 py-2.5 bg-ink-black text-paper-white rounded-buttons font-sans text-[14px] font-medium transition-transform hover:scale-105 active:scale-95"
            >
              Start Cooking
            </Link>
          </div>
        </div>

        {/* Floating Artifacts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Decks Accent Card */}
          <div className="lg:col-span-8 bg-blush-peach rounded-cards p-8 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <h2 className="font-serif text-[1.75rem] text-sienna-brown">Recent Pitches</h2>
              <span className="text-[13px] font-sans text-sienna-brown/70 font-medium tracking-wide uppercase">Last 30 Days</span>
            </div>
            
            {pitches && pitches.length > 0 ? (
              <div className="flex flex-col gap-3 relative z-10">
                {pitches.map((pitch) => (
                  <Link 
                    key={pitch.id}
                    href={`/deck/${pitch.id}`} 
                    className="group bg-paper-white/50 hover:bg-paper-white/80 transition-colors rounded-[12px] p-3 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-paper-white rounded-lg flex items-center justify-center shadow-sm">
                        <Presentation className="w-5 h-5 text-sienna-brown" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-sienna-brown">
                          {pitch.startupName}
                        </span>
                        <span className="text-[13px] text-sienna-brown/60">
                          {new Date(pitch.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-sienna-brown font-medium text-[14px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-paper-white/30 rounded-[16px] relative z-10 mt-auto border border-sienna-brown/10">
                <p className="text-sienna-brown/70 mb-3 font-sans text-[14px]">No pitches found. Time to build.</p>
                <Link href="/pitch/new" className="text-sienna-brown font-medium text-[15px] hover:underline">
                  Create your first deck →
                </Link>
              </div>
            )}
            
            {/* Decorative abstract shape in background */}
            <div className="absolute right-[-10%] bottom-[-20%] w-[60%] h-[80%] rounded-full bg-paper-white/20 blur-[60px] pointer-events-none" />
          </div>

          {/* Quick Tools Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <Link href="/simulator" className="bg-bg-floating border border-border-subtle shadow-subtle-2 rounded-cards p-6 hover:shadow-subtle-3 transition-shadow group flex-1">
              <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center mb-4 text-text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-[17px] font-medium text-text-primary mb-2">Q&A Simulator</h3>
              <p className="text-text-secondary text-[14px] leading-relaxed mb-4">
                Prepare for aggressive investor pushback with our AI VC agent.
              </p>
              <span className="text-[14px] font-medium text-text-primary flex items-center group-hover:underline">
                Practice Pitching →
              </span>
            </Link>
            
            <Link href="/tools/stress-test" className="bg-bg-floating border border-border-subtle shadow-subtle-2 rounded-cards p-6 hover:shadow-subtle-3 transition-shadow group flex-1">
              <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center mb-4 text-text-primary">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-[17px] font-medium text-text-primary mb-2">Stress Test</h3>
              <p className="text-text-secondary text-[14px] leading-relaxed mb-4">
                Identify fatal flaws in your logic before you pitch a human.
              </p>
              <span className="text-[14px] font-medium text-text-primary flex items-center group-hover:underline">
                Analyze Deck →
              </span>
            </Link>

          </div>
          
        </div>
      </div>
    </div>
  );
}
