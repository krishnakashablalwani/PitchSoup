export default function DeckLoading() {
  return (
    <div className="flex-1 flex flex-col p-6 h-full bg-background animate-pulse">
      <header className="flex items-center justify-between mb-6">
        <div className="space-y-2 w-1/3">
          <div className="h-8 bg-foreground/10 rounded-xl w-3/4"></div>
          <div className="h-4 bg-foreground/10 rounded-xl w-1/2"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-foreground/10 rounded-xl"></div>
          <div className="h-10 w-24 bg-foreground/10 rounded-xl"></div>
          <div className="h-10 w-32 bg-foreground/10 rounded-xl"></div>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 glass-panel rounded-2xl p-4 bg-foreground/5"></aside>

        {/* Main Stage */}
        <section className="flex-1 glass-panel rounded-3xl p-12 bg-foreground/5"></section>

        {/* Right Sidebar */}
        <aside className="w-80 glass-panel rounded-2xl p-6 bg-foreground/5"></aside>
      </div>
    </div>
  );
}
