import { supabase } from '@/lib/supabase';
import { auth } from "@clerk/nextjs/server";
import BattlecardClient from "./BattlecardClient";

export default async function BattlecardPage() {
  const { userId } = await auth();

  if (!userId) return null;

  const { data: pitches } = await supabase.from("Pitch")
    .select("id, startupName, problem, solution, targetMarket")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-headline-xl font-bold tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl">swords</span>
            Competitor Battlecard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-body-md">
            AI-powered competitive analysis. Know your rivals inside and out.
          </p>
        </div>

        <BattlecardClient pitches={pitches || []} />
      </div>
    </div>
  );
}
