export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        {/* Header */}
        <div className="space-y-4">
          <div className="h-10 bg-foreground/10 rounded-xl w-1/3"></div>
          <div className="h-6 bg-foreground/10 rounded-xl w-1/2"></div>
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[160px]">
          {/* Main Action */}
          <div className="md:col-span-8 row-span-2 glass-panel rounded-3xl p-8 bg-foreground/5"></div>
          
          {/* Stat Box */}
          <div className="md:col-span-4 row-span-1 glass-panel rounded-3xl p-6 bg-foreground/5"></div>
          
          {/* VC Simulator */}
          <div className="md:col-span-4 row-span-1 glass-panel rounded-3xl p-6 bg-foreground/5"></div>
          
          {/* Recent Pitches */}
          <div className="md:col-span-6 row-span-2 glass-panel rounded-3xl p-6 bg-foreground/5"></div>
          
          {/* Tools */}
          <div className="md:col-span-6 row-span-1 glass-panel rounded-3xl p-6 bg-foreground/5"></div>
          <div className="md:col-span-6 row-span-1 glass-panel rounded-3xl p-6 bg-foreground/5"></div>
        </div>
      </div>
    </div>
  );
}
