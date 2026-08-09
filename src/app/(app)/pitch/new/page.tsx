import { createPitch } from "@/app/actions/pitch";

export default function NewPitchPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-background">
      <div className="w-full max-w-2xl bg-black border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-headline-lg font-bold mb-2">
          Cook New <span className="text-gradient">Pitch</span>
        </h1>
        <p className="text-muted-foreground mb-8 font-body-md text-lg">
          Provide your core startup details, and we will generate a compelling 10-slide VC deck.
        </p>
        
        <form action={createPitch} className="space-y-6">
          <div>
            <label className="block text-sm font-label-caps mb-2 text-white/80">Startup Name</label>
            <input 
              required
              name="startupName"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#CCCCFF] transition-all font-body-md"
              placeholder="e.g. NextGen Robotics"
            />
          </div>
          <div>
            <label className="block text-sm font-label-caps mb-2 text-white/80">The Core Problem</label>
            <textarea 
              required
              name="problem"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#CCCCFF] transition-all font-body-md resize-none"
              placeholder="Supply chains are inefficient due to manual tracking..."
            />
          </div>
          <div>
            <label className="block text-sm font-label-caps mb-2 text-white/80">Your Solution & Tech Stack</label>
            <textarea 
              required
              name="solution"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#CCCCFF] transition-all font-body-md resize-none"
              placeholder="An AI-driven autonomous robotic sorting facility powered by..."
            />
          </div>
          <div>
            <label className="block text-sm font-label-caps mb-2 text-white/80">Business Model</label>
            <input 
              required
              name="businessModel"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#CCCCFF] transition-all font-body-md"
              placeholder="e.g. B2B SaaS, Marketplace, D2C"
            />
          </div>
          <div>
            <label className="block text-sm font-label-caps mb-2 text-white/80">Traction / Validation</label>
            <input 
              name="traction"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#CCCCFF] transition-all font-body-md"
              placeholder="e.g. $10k MRR, 50k Waitlist, Beta Live"
            />
          </div>
          <div>
            <label className="block text-sm font-label-caps mb-2 text-white/80">Target Market</label>
            <input 
              required
              name="targetMarket"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#CCCCFF] transition-all font-body-md"
              placeholder="Mid-to-large e-commerce fulfillment centers"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#CCCCFF] text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] font-body-md text-lg mt-4"
          >
            Generate Deck
          </button>
        </form>
      </div>
    </div>
  );
}
