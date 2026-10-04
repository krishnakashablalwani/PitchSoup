const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const replacement = `  const features = [
    {
      title: "AI Pitch Deck Generation",
      desc: "Transforms raw startup ideas into full 12-slide pitch decks in seconds. It writes the investment narrative, estimates TAM/SAM/SOM market demographics, generates speaker notes, and intelligently curates beautiful layouts.",
      graphic: (
        <div className="w-full aspect-square md:aspect-[4/3] bg-bg-primary border border-border-subtle rounded-cards p-6 shadow-subtle-2 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blush-peach blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          
          <div className="w-full flex justify-between items-center bg-bg-card p-3 rounded-lg border border-border-subtle relative z-10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-border-subtle" />
              <div className="w-2.5 h-2.5 rounded-full bg-border-subtle" />
            </div>
            <div className="w-16 h-3 bg-mist-gray rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
            <div className="bg-bg-card rounded-xl border border-border-subtle p-3 flex flex-col gap-3 shadow-sm group-hover:-translate-y-1 transition-transform duration-500">
              <div className="w-1/2 h-2 bg-mist-gray rounded-full" />
              <div className="w-full flex-1 bg-mist-gray/50 rounded-lg" />
            </div>
            <div className="bg-bg-card rounded-xl border border-border-subtle p-3 flex flex-col gap-3 shadow-sm group-hover:translate-y-1 transition-transform duration-500 delay-100">
              <div className="w-1/2 h-2 bg-mist-gray rounded-full" />
              <div className="w-full flex-1 bg-blush-peach rounded-lg" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Interactive Deck Studio",
      desc: "A premium presentation interface for your generated pitches. Features include responsive visual scaling, seamless keyboard navigation, automated AI voiceovers, PDF exporting, and instant public link sharing.",
      graphic: (
        <div className="w-full aspect-square md:aspect-[4/3] bg-bg-card border border-border-subtle rounded-cards overflow-hidden shadow-subtle-2 flex flex-col group relative">
          <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-mist-gray blur-[50px] rounded-full group-hover:bg-blush-peach/40 transition-colors duration-1000" />
          
          <div className="h-10 border-b border-border-subtle flex items-center px-4 space-x-1.5 bg-bg-primary relative z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-border-subtle" />
            <div className="w-2.5 h-2.5 rounded-full bg-border-subtle" />
            <div className="w-2.5 h-2.5 rounded-full bg-border-subtle" />
            <div className="ml-3 w-32 h-4 bg-bg-card rounded border border-border-subtle mx-auto" />
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center flex-1 relative z-10">
            <div className="w-full aspect-video bg-bg-primary rounded-lg border border-border-subtle shadow-sm flex flex-col justify-center items-center p-4">
               <div className="w-2/3 h-4 bg-ink-black rounded-md mb-4" />
               <div className="w-1/3 h-2 bg-mist-gray rounded-md" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "VC Stress Test Simulator",
      desc: "An AI-driven interrogation tool that acts like a skeptical venture capitalist. It actively analyzes your pitch deck for structural weaknesses and unit economic flaws, grilling you with brutal edge-case questions.",
      graphic: (
        <div className="w-full aspect-square md:aspect-[4/3] bg-bg-card border border-border-subtle rounded-cards p-6 shadow-subtle-2 flex flex-col gap-4 justify-end relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/50 to-transparent z-10 pointer-events-none h-20 top-0" />
          
          <div className="flex gap-3 items-end self-start w-5/6 relative z-0 group-hover:-translate-y-1 transition-transform duration-500">
            <div className="w-8 h-8 rounded-full bg-blush-peach shrink-0 flex items-center justify-center text-sienna-brown font-serif text-[10px] font-bold shadow-sm">VC</div>
            <div className="bg-bg-primary p-4 rounded-2xl rounded-bl-sm border border-border-subtle w-full shadow-sm">
              <div className="w-full h-2 bg-mist-gray rounded-full mb-2" />
              <div className="w-full h-2 bg-mist-gray rounded-full mb-2" />
              <div className="w-2/3 h-2 bg-mist-gray rounded-full" />
            </div>
          </div>
          
          <div className="flex gap-3 items-end self-end w-5/6 flex-row-reverse relative z-0 group-hover:-translate-y-1 transition-transform duration-500 delay-100">
            <div className="w-8 h-8 rounded-full bg-ink-black shrink-0 flex items-center justify-center shadow-md">
              <div className="w-3 h-3 bg-bg-primary rounded-[2px]" />
            </div>
            <div className="bg-ink-black p-4 rounded-2xl rounded-br-sm w-full shadow-md">
              <div className="w-full h-2 bg-bg-primary/20 rounded-full mb-2" />
              <div className="w-1/2 h-2 bg-bg-primary/20 rounded-full" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Elevator Pitch & Stage Scripting",
      desc: "A communication coach that distills your startup thesis into multiple spoken formats. Outputs a snappy 30-second elevator pitch alongside a comprehensive 2-minute stage script complete with theatrical cues.",
      graphic: (
        <div className="w-full aspect-square md:aspect-[4/3] bg-bg-primary border border-border-subtle rounded-cards p-6 shadow-subtle-2 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-mist-gray blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="w-3/4 aspect-[3/4] bg-bg-card border border-border-subtle rounded-xl p-5 shadow-md group-hover:-rotate-2 transition-transform duration-500 relative z-10 flex flex-col gap-3">
             <div className="w-1/2 h-3 bg-ink-black rounded-md mb-2" />
             <div className="w-full h-2 bg-mist-gray rounded-sm" />
             <div className="w-full h-2 bg-mist-gray rounded-sm" />
             <div className="w-5/6 h-2 bg-mist-gray rounded-sm mb-2" />
             <div className="w-1/3 h-2 bg-blush-peach rounded-sm mb-2" />
             <div className="w-full h-2 bg-mist-gray rounded-sm" />
             <div className="w-4/5 h-2 bg-mist-gray rounded-sm" />
          </div>
        </div>
      ),
    },
    {
      title: "Investor Match & Outreach",
      desc: "A targeting tool that matches your startup with ideal investor profiles based on your industry. It automatically drafts highly personalized, thesis-driven cold-outreach emails designed to capture attention.",
      graphic: (
        <div className="w-full aspect-square md:aspect-[4/3] bg-bg-card border border-border-subtle rounded-cards p-6 shadow-subtle-2 flex items-center justify-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blush-peach/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="w-full max-w-[200px] bg-bg-primary border border-border-subtle rounded-xl p-4 shadow-md group-hover:translate-y-[-4px] transition-transform duration-500 relative z-10">
              <div className="flex gap-2 items-center border-b border-border-subtle pb-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-mist-gray" />
                <div className="flex flex-col gap-1">
                  <div className="w-16 h-2 bg-ink-black rounded-sm" />
                  <div className="w-10 h-1.5 bg-mist-gray rounded-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                 <div className="w-full h-1.5 bg-mist-gray rounded-sm" />
                 <div className="w-full h-1.5 bg-mist-gray rounded-sm" />
                 <div className="w-2/3 h-1.5 bg-mist-gray rounded-sm" />
              </div>
              <div className="mt-4 w-20 h-6 bg-blush-peach rounded-md mx-auto" />
           </div>
        </div>
      ),
    },
  ];`;

const startIndex = code.indexOf('  const features = [');
const endIndex = code.indexOf('  ];\n\n  return (', startIndex) + 4;

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/app/page.tsx', newCode);
  console.log('Success');
} else {
  console.log('Failed to find indices');
}
