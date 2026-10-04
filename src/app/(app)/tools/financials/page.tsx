import { getPitchesForUser } from '@/lib/mockPitch';
import { auth } from '@clerk/nextjs/server';
import FinancialsTabsClient from './FinancialsTabsClient';
import { Calculator } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FinancialsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null; 
  }

  const pitches = await getPitchesForUser(userId);

  return (
    <div className="flex-1 p-6 md:p-10 min-h-screen bg-bg-primary text-text-primary overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        <header className="border-b border-border-subtle pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-peach/40 text-sienna-brown flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-text-primary font-medium tracking-tight">
                Financial Studio
              </h1>
              <p className="text-text-secondary text-sm mt-0.5 font-sans">
                Model cap table ownership, funding round dilution, and cash runway projections.
              </p>
            </div>
          </div>
        </header>

        <FinancialsTabsClient pitches={pitches || []} />
      </div>
    </div>
  );
}

