"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  LineChart,
  MessageSquare,
  Zap,
  Target,
} from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-bg-primary font-sans overflow-x-hidden text-text-primary relative selection:bg-blush-peach selection:text-sienna-brown">
      {/* Global Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <Navbar isScrolled={isScrolled} />

      <main className="relative z-10 flex flex-col items-center w-full">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}

import { ThemeToggle } from "@/components/ThemeToggle";

function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-bg-primary/90 backdrop-blur-xl border-b border-border-subtle shadow-sm py-2" : "bg-transparent border-transparent py-4"
      }`}
    >
      <nav className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-8 h-8 rounded-images overflow-hidden group-hover:scale-105 transition-transform shadow-sm">
            <Image src="/logo.png" alt="Logo" fill sizes="32px" className="object-cover" />
          </div>
          <span className="font-bold text-[18px] tracking-tight hidden sm:block font-serif text-text-primary">
            PitchSoup
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-[14px] font-sans font-medium text-text-secondary">
          <Link href="#problem" className="hover:text-text-primary transition-colors">
            Problem
          </Link>
          <Link href="#solution" className="hover:text-text-primary transition-colors">
            Kitchen
          </Link>
          <Link href="#features" className="hover:text-text-primary transition-colors">
            Features
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-[14px] font-medium text-text-primary hover:text-sienna-brown transition-colors mr-2"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-[14px] font-medium text-text-primary hover:text-sienna-brown transition-colors mr-2 hidden sm:block"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 text-[14px] font-sans font-semibold bg-ink-black text-paper-white rounded-buttons hover:bg-ink-black/90 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                Start Cooking
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="w-full relative mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col items-center text-center min-h-[85vh] justify-center bg-bg-primary overflow-hidden">
      
      {/* Very Soft Ambient Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blush-peach/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-mist-gray/40 blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto w-full">
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-6 px-3 py-1 rounded-full border border-sienna-brown/20 bg-blush-peach/30 backdrop-blur-md text-sienna-brown text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The Ultimate Pitch Deck Generator
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] tracking-tight text-text-primary mb-6"
        >
          Cook Your Pitch.<br />
          <i className="text-text-secondary font-light">Taste Test It.</i>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[1.1rem] md:text-[1.25rem] text-text-secondary max-w-xl mb-10 font-sans font-light leading-relaxed"
        >
          Throw in your raw idea. We'll cook up the deck and test it in the
          kitchen against AI investors.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/sign-up"
            className="group w-full sm:w-auto px-8 py-3.5 bg-ink-black text-paper-white font-semibold font-sans text-[15px] rounded-buttons overflow-hidden transition-all hover:scale-[1.02] hover:shadow-md active:scale-95 flex items-center justify-center"
          >
            Start Cooking Now
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 bg-bg-primary text-ink-black border border-border-subtle shadow-sm font-semibold font-sans text-[15px] rounded-buttons hover:bg-bg-secondary hover:shadow-sm transition-all active:scale-95 text-center"
          >
            See How it Works
          </Link>
        </motion.div>
      </div>
      
      {/* Floating UI Artifacts - Enhanced with Glassmorphism & Animation */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] left-[2%] lg:left-[5%] hidden md:flex flex-col bg-bg-card/80 backdrop-blur-xl border border-border-subtle shadow-subtle-3 rounded-elevatedcards p-4 w-[240px]"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-sans font-semibold text-text-primary">TAM / SAM / SOM</span>
          <div className="w-2 h-2 rounded-full bg-sienna-brown shadow-[0_0_8px_rgba(160,82,45,0.5)]"></div>
        </div>
        <div className="flex gap-2 items-end h-20 mb-1">
          <div className="w-1/3 bg-mist-gray h-[40%] rounded-t-md transition-all duration-1000 hover:h-[50%]" />
          <div className="w-1/3 bg-blush-peach h-[70%] rounded-t-md transition-all duration-1000 hover:h-[80%]" />
          <div className="w-1/3 bg-ink-black h-[100%] rounded-t-md transition-all duration-1000 hover:h-[95%]" />
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] right-[2%] lg:right-[5%] hidden md:flex flex-col bg-bg-card/80 backdrop-blur-xl border border-border-subtle shadow-subtle-3 rounded-elevatedcards p-5 w-[250px]"
      >
        <div className="flex items-center gap-3 mb-3 border-b border-border-subtle pb-2">
          <div className="w-8 h-8 rounded-full bg-blush-peach flex items-center justify-center text-sienna-brown font-serif text-[14px] shadow-inner">VC</div>
          <div className="flex flex-col">
            <span className="text-[13px] font-sans font-bold text-text-primary">AI Shark</span>
            <span className="text-[11px] text-text-tertiary">Partner, Sequoia</span>
          </div>
        </div>
        <p className="text-[12px] font-sans text-text-secondary leading-relaxed italic">
          "Your GTM strategy relies heavily on organic growth, but this is a crowded space. How do you acquire your first 100 enterprise customers?"
        </p>
      </motion.div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="w-full py-24 bg-bg-secondary relative border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="text-sienna-brown font-semibold tracking-widest uppercase text-xs mb-3 block">The Reality</span>
          <h2 className="font-serif text-[2.5rem] md:text-[3rem] leading-tight text-text-primary mb-4">Founders waste time.</h2>
          <p className="font-sans text-[1.1rem] text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
            You're spending 100+ hours tweaking slide designs instead of building
            product. And when you finally pitch, you get destroyed by basic VC
            questions you never practiced for.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: LineChart,
              title: "Wasted Time",
              desc: "Hundreds of hours spent on PowerPoint alignment instead of customer validation.",
            },
            {
              icon: BrainCircuit,
              title: "Blind Spots",
              desc: "Crucial market sizing and business model flaws discovered only during the actual pitch.",
            },
            {
              icon: Target,
              title: "Missed Targets",
              desc: "Failing to answer aggressive VC interrogations under pressure blows the entire deal.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-bg-primary p-8 rounded-cards border border-border-subtle group hover:shadow-subtle-2 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-mist-gray rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-blush-peach transition-all duration-300">
                <item.icon className="w-6 h-6 text-text-primary group-hover:text-sienna-brown transition-colors" />
              </div>
              <h3 className="font-sans text-[1.25rem] font-bold text-text-primary mb-3">{item.title}</h3>
              <p className="font-sans text-[1rem] text-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solution" className="w-full py-24 bg-bg-primary relative border-t border-border-subtle overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="order-2 lg:order-1"
          >
            <span className="text-sienna-brown font-semibold tracking-widest uppercase text-xs mb-3 block">The Solution</span>
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[2.5rem] md:text-[3rem] leading-tight text-text-primary mb-6"
            >
              The PitchSoup Kitchen
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-sans text-[1.1rem] text-text-secondary mb-8 leading-relaxed font-light"
            >
              We leverage Google Gemini 2.5 Flash to transform your brain-dump
              into a structured, VC-ready presentation. Then, our AI Sharks
              simulate a real pitch environment to battle-test your answers.
            </motion.p>

            <motion.ul variants={staggerContainer} className="space-y-4">
              {[
                "Instant structural generation in seconds",
                "Automated TAM/SAM/SOM demographic insights",
                "Real-time VC interrogation simulation",
                "Constructive feedback loop & scoring",
              ].map((text, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-center font-sans text-[1rem] text-text-primary font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-blush-peach text-sienna-brown flex items-center justify-center mr-3 shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 lg:order-2 relative"
          >
            <div className="absolute inset-0 bg-blush-peach/30 blur-[60px] rounded-full transform -translate-x-8 translate-y-8" />
            
            <div className="bg-bg-primary rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-subtle-2 border border-border-subtle relative z-10 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sienna-brown/20 via-sienna-brown to-sienna-brown/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="font-serif text-[1.5rem] text-text-primary mb-5">
                Slide 4: The Market
              </h3>
              
              <div className="w-full bg-mist-gray/50 rounded-xl p-5 mb-6 border border-border-subtle">
                <p className="font-sans text-[1.25rem] text-text-primary font-bold flex justify-between items-center mb-2">
                  <span>TAM</span> <span className="text-sienna-brown">$12B</span>
                </p>
                <p className="font-sans text-[1.1rem] text-text-secondary font-medium flex justify-between items-center mb-1">
                  <span>SAM</span> <span>$4B</span>
                </p>
                <p className="font-sans text-[0.95rem] text-text-tertiary flex justify-between items-center">
                  <span>SOM</span> <span>$150M</span>
                </p>
              </div>

              <div className="w-full h-32 flex items-end justify-center p-2 gap-2">
                <motion.div 
                  initial={{ height: "0%" }} whileInView={{ height: "33%" }} transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-1/3 bg-mist-gray rounded-t-lg" 
                />
                <motion.div 
                  initial={{ height: "0%" }} whileInView={{ height: "66%" }} transition={{ duration: 0.8, delay: 0.4 }}
                  className="w-1/3 bg-blush-peach rounded-t-lg" 
                />
                <motion.div 
                  initial={{ height: "0%" }} whileInView={{ height: "100%" }} transition={{ duration: 0.8, delay: 0.6 }}
                  className="w-1/3 bg-ink-black rounded-t-lg shadow-md" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
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
  ];

  return (
    <section id="features" className="w-full py-24 bg-bg-secondary relative border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <span className="text-sienna-brown font-semibold tracking-widest uppercase text-xs mb-3 block">The Arsenal</span>
          <h2 className="font-serif text-[2.5rem] md:text-[3rem] text-text-primary mb-4 leading-tight">
            Built for Winners
          </h2>
          <p className="font-sans text-[1.1rem] font-light text-text-secondary max-w-2xl mx-auto">
            Everything you need to confidently walk into your next partner
            meeting and dominate the conversation.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24">
          {features.map((feature, idx) => (
            <FeatureRow 
              key={idx}
              title={feature.title}
              desc={feature.desc}
              graphic={feature.graphic}
              isReversed={idx % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  title,
  desc,
  graphic,
  isReversed,
}: {
  title: string;
  desc: string;
  graphic: React.ReactNode;
  isReversed: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-16`}
    >
      <div className="flex-1 w-full relative">
        {graphic}
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-serif text-[1.5rem] md:text-[1.75rem] leading-tight text-text-primary mb-4">{title}</h3>
        <p className="font-sans text-[0.95rem] text-text-secondary leading-relaxed font-light">{desc}</p>
      </div>
    </motion.div>
  );
}


function FinalCTASection() {
  return (
    <section className="w-full py-32 bg-ink-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-sienna-brown/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] text-paper-white mb-6 leading-tight tracking-tight">
          Stop tweaking slides. <br className="hidden md:block"/> Start building.
        </h2>
        <p className="font-sans text-[1rem] md:text-[1.1rem] text-paper-white/70 mb-10 font-light max-w-xl mx-auto">
          Join hundreds of founders who have cooked their winning decks with PitchSoup.
        </p>
        <Link
          href="/sign-up"
          className="px-8 py-4 bg-paper-white text-ink-black font-semibold font-sans text-[16px] rounded-buttons hover:scale-105 active:scale-95 transition-transform"
        >
          Start Cooking Now
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-bg-primary py-12 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="rounded-images"
          />
          <span className="font-serif font-regular text-[18px] text-text-primary">PitchSoup</span>
        </div>
        <p className="font-sans text-caption text-text-tertiary">
          © {new Date().getFullYear()} PitchSoup.
        </p>
      </div>
    </footer>
  );
}
