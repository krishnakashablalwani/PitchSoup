import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import InvestorMatchClient from './InvestorMatchClient';

export default async function InvestorMatchPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null; 
  }

  
  const { data: pitches } = await supabase.from('Pitch')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">radar</span>
              AI Investor Match
            </h1>
            <p className="text-muted-foreground mt-2 font-body-md">
              Select a pitch. Our AI will analyze your market and problem to find the perfect investor profiles for you.
            </p>
          </div>
        </header>

        <InvestorMatchClient pitches={pitches || []} />
      </div>
    </div>
  );
}
