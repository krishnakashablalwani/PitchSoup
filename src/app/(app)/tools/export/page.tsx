import { supabase } from '@/lib/supabase';
import { auth } from "@clerk/nextjs/server";
import ExportHubClient from "./ExportHubClient";

export const dynamic = 'force-dynamic';


export default async function ExportHubPage() {
  const { userId } = await auth();

  if (!userId) return null;

  const { data: pitches } = await supabase.from("Pitch")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-headline-xl font-bold tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl">download</span>
            Export Hub
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-body-md">
            Download your pitch data as CSV or PDF for sharing, backups, and investor packets.
          </p>
        </div>

        <ExportHubClient pitches={pitches || []} />
      </div>
    </div>
  );
}
