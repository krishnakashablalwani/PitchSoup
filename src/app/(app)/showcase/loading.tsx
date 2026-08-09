export default function ShowcaseLoading() {
  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="mb-12 space-y-4">
          <div className="h-12 bg-foreground/10 rounded-xl w-1/3"></div>
          <div className="h-6 bg-foreground/10 rounded-xl w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl p-6 h-48 bg-foreground/5"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
