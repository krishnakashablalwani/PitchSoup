import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabase } from '@/lib/supabase';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  const firstName = user.firstName || "Founder";

  
  const { data: pitches } = await (await getSupabase()).from("Pitch")
    .select("id, startupName, createdAt")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false })
    .limit(3);

  const pitchCount = pitches?.length || 0;

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-headline-xl font-bold tracking-tight">
            {greeting}, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-body-md">
            Here is what is happening with your startups today.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[160px]">
          
          {/* Main Action - Create Deck (Spans 8 cols, 2 rows) */}
          <Link 
            href="/pitch/new" 
            className="md:col-span-8 row-span-2 group glass-panel rounded-3xl p-8 relative overflow-hidden transition-transform hover:scale-[1.01]"
          >
            <div className="absolute -right-12 -top-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[200px] text-techTeal">lightbulb</span>
            </div>
            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-techTeal/20 text-techTeal flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">add_box</span>
              </div>
              <div>
                <h2 className="text-3xl font-headline-lg font-bold mb-2">Cook a New Pitch</h2>
                <p className="text-muted-foreground font-body-md text-lg max-w-md">
                  Transform your raw startup idea into a comprehensive, 10-slide investor-ready presentation using our AI Co-Founder.
                </p>
              </div>
            </div>
          </Link>

          {/* Stat Box (Spans 4 cols, 1 row) */}
          <div className="md:col-span-4 row-span-1 glass-panel rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="font-label-caps uppercase tracking-wider">Total Pitches</span>
              <span className="material-symbols-outlined">folder</span>
            </div>
            <div>
              <span className="text-5xl font-headline-xl font-bold">{pitchCount}</span>
              <span className="text-muted-foreground ml-2">created</span>
            </div>
          </div>

          {/* Pitch Q&A Coach (Spans 4 cols, 1 row) */}
          <Link 
            href="/simulator" 
            className="md:col-span-4 row-span-1 glass-panel rounded-3xl p-6 group transition-transform hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 translate-y-4">
              <span className="material-symbols-outlined text-[100px] text-mutedPlum">forum</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-mutedPlum/20 text-mutedPlum flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <h3 className="text-xl font-headline-md font-semibold mb-1">Pitch Q&A</h3>
            <p className="text-muted-foreground font-body-md text-sm">Prepare for investor meetings.</p>
          </Link>

          {/* Recent Pitches List (Spans 6 cols, 2 rows) */}
          <div className="md:col-span-6 row-span-2 glass-panel rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md font-semibold text-xl">Recent Pitches</h3>
              <Link href="/dashboard" className="text-techTeal text-sm hover:underline font-medium">View All</Link>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
              {pitches && pitches.length > 0 ? (
                <ul className="space-y-3">
                  {pitches.map((pitch) => (
                    <li key={pitch.id}>
                      <Link 
                        href={`/deck/${pitch.id}`} 
                        className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border">
                            <span className="material-symbols-outlined text-foreground">auto_awesome</span>
                          </div>
                          <div>
                            <h4 className="font-semibold font-body-md">{pitch.startupName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(pitch.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                  <p className="font-body-md">No pitches found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Cap Table (Spans 6 cols, 1 row) */}
          <Link 
            href="/tools/cap-table" 
            className="md:col-span-6 row-span-1 glass-panel rounded-3xl p-6 group transition-transform hover:scale-[1.02] flex items-center justify-between overflow-hidden relative"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4">
              <span className="material-symbols-outlined text-[100px] text-primary">pie_chart</span>
            </div>
            <div>
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">calculate</span>
              </div>
              <h3 className="text-xl font-headline-md font-semibold">Cap Table Math</h3>
              <p className="text-muted-foreground font-body-md text-sm">Calculate dilution scenarios.</p>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">arrow_forward</span>
          </Link>

          {/* Demo Day (Spans 6 cols, 1 row) */}
          <Link 
            href="/showcase" 
            className="md:col-span-6 row-span-1 glass-panel rounded-3xl p-6 group transition-transform hover:scale-[1.02] flex items-center justify-between overflow-hidden relative"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4">
              <span className="material-symbols-outlined text-[100px] text-secondary">public</span>
            </div>
            <div>
              <div className="h-10 w-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <h3 className="text-xl font-headline-md font-semibold">Demo Day</h3>
              <p className="text-muted-foreground font-body-md text-sm">Explore top generated pitches.</p>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">arrow_forward</span>
          </Link>

          {/* Runway Calculator (Spans 4 cols, 1 row) */}
          <Link 
            href="/tools/runway" 
            className="md:col-span-4 row-span-1 glass-panel rounded-3xl p-6 group transition-transform hover:scale-[1.02] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 translate-y-4">
              <span className="material-symbols-outlined text-[100px] text-techTeal">flight_takeoff</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-techTeal/20 text-techTeal flex items-center justify-center mb-2">
              <span className="material-symbols-outlined">flight_takeoff</span>
            </div>
            <div>
              <h3 className="text-xl font-headline-md font-semibold mb-1">Runway Calc</h3>
              <p className="text-muted-foreground font-body-md text-sm">Plan your burn rate & survival.</p>
            </div>
          </Link>

          {/* Investor Match (Spans 4 cols, 1 row) */}
          <Link 
            href="/tools/investor-match" 
            className="md:col-span-4 row-span-1 glass-panel rounded-3xl p-6 group transition-transform hover:scale-[1.02] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 translate-y-4">
              <span className="material-symbols-outlined text-[100px] text-[#8a8aff]">handshake</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#8a8aff]/20 text-[#8a8aff] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <div>
              <h3 className="text-xl font-headline-md font-semibold mb-1">Investor Match</h3>
              <p className="text-muted-foreground font-body-md text-sm">Find the right VCs for you.</p>
            </div>
          </Link>

          {/* Competitor Battlecard (Spans 4 cols, 1 row) */}
          <Link 
            href="/tools/battlecard" 
            className="md:col-span-4 row-span-1 glass-panel rounded-3xl p-6 group transition-transform hover:scale-[1.02] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 translate-y-4">
              <span className="material-symbols-outlined text-[100px] text-destructive">swords</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center mb-2">
              <span className="material-symbols-outlined">swords</span>
            </div>
            <div>
              <h3 className="text-xl font-headline-md font-semibold mb-1">Battlecard</h3>
              <p className="text-muted-foreground font-body-md text-sm">Compare against incumbents.</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
