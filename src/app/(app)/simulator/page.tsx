import { getSupabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export const revalidate = 0;

export default async function SimulatorIndexPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const { data: pitches } = await (await getSupabase()).from('Pitch')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto bg-background text-foreground font-sans relative">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline-xl font-extrabold mb-4 tracking-tight">
            Pitch <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Q&A</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-body-lg">
            Select one of your pitches to ask questions about your pitch deck and prepare yourself for pitching to investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pitches?.map((pitch) => (
            <Link
              href={`/simulator/${pitch.id}`}
              key={pitch.id}
              className="group glass-panel rounded-2xl p-6 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex flex-col relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4 relative z-10">
                <h3 className="text-xl font-headline-sm font-bold group-hover:text-primary transition-colors line-clamp-1">
                  {pitch.startupName}
                </h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                  Pitch
                </span>
              </div>
              <p className="text-sm font-body-md text-foreground/80 flex-1 line-clamp-3 mb-6 relative z-10">
                {pitch.problem}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs font-medium text-muted-foreground relative z-10">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  <span className="truncate">Market: {pitch.targetMarket}</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    forum
                  </span>
                  Start Q&A
                </div>
              </div>

              {/* Subtle hover gradient inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}

          {(!pitches || pitches.length === 0) && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                inbox
              </span>
              <p>You haven't cooked any pitches yet. <Link href="/pitch/new" className="text-primary hover:underline">Create one now!</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
