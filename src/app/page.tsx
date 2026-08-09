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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
      setIsScrolled(latest > 60);
    });
  }, [scrollY]);

  return (
    <div className="min-h-screen selection:bg-primary/30 font-sans overflow-hidden">
      {/* Solid Background (No Gradients) */}

      <Navbar isScrolled={isScrolled} />

      <main className="relative z-10 flex flex-col items-center">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}

function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.nav
        layout
        className={`flex items-center justify-between overflow-hidden transition-all duration-500 ease-out ${
          isScrolled
            ? "w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full py-3 px-6"
            : "w-full max-w-7xl bg-transparent border-transparent py-4 px-2"
        }`}
      >
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-8 h-8 rounded overflow-hidden group-hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <motion.span
            layout="position"
            className="font-bold text-lg tracking-wide hidden sm:block"
          >
            PitchSoup
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#CCCCFF]/70">
          <Link href="#problem" className="hover:text-white transition-colors">
            The Problem
          </Link>
          <Link href="#solution" className="hover:text-white transition-colors">
            Solution
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-bold text-white hover:text-[#CCCCFF] transition-colors mr-2"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-white hover:text-[#CCCCFF] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Start Cooking
              </Link>
            </>
          )}
        </div>
      </motion.nav>
    </motion.header>
  );
}

function HeroSection() {
  return (
    <section className="w-full relative mx-auto px-6 pt-40 pb-32 flex flex-col items-center text-center overflow-hidden min-h-[90vh] justify-center">
      {/* Translucent Periwinkle Waves / Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[70vw] h-[50vh] bg-[#8a8aff] rounded-[100%] blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -10, 5, 0],
            opacity: [0.15, 0.25, 0.15] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[60vh] bg-[#ccccff] rounded-[100%] blur-[130px] mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            y: [0, -50, 0],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[20%] left-[20%] w-[60vw] h-[40vh] bg-[#6366F1] rounded-[100%] blur-[150px] mix-blend-screen"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-[#8a8aff]" />
          <span className="text-sm font-medium text-[#CCCCFF]">
            The Ultimate Pitch Deck Generator
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
        >
          Cook Your Pitch. <br />
          <span className="text-white">Taste Test It.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-xl text-[#CCCCFF]/80 max-w-2xl mb-12"
        >
          Throw in your raw idea. We'll cook up the deck and test it in the
          kitchen.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/sign-up"
            className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:bg-gray-200 shadow-[0_0_30px_rgba(138,138,255,0.3)]"
          >
            <span className="relative flex items-center transition-colors">
              Start Cooking Now{" "}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 text-white font-bold text-lg rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            See How it Works
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="w-full py-32 bg-background relative">
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Problem</h2>
          <p className="text-xl text-[#CCCCFF]/60 max-w-3xl mx-auto">
            Founders waste weeks tweaking slide designs instead of building
            product. When they finally pitch, they get destroyed by basic VC
            questions they never practiced for.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: LineChart,
              title: "Wasted Time",
              desc: "100+ hours spent on PowerPoint alignment instead of customer validation.",
            },
            {
              icon: BrainCircuit,
              title: "Blind Spots",
              desc: "Crucial market sizing and business model flaws discovered only during the pitch.",
            },
            {
              icon: Target,
              title: "Missed Targets",
              desc: "Failing to answer VC interrogations under pressure blows the deal.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 hover:border-[#CCCCFF]/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#CCCCFF]/10 text-[#CCCCFF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-[#CCCCFF]/60">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solution" className="w-full py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              The PitchSoup Kitchen
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-xl text-[#CCCCFF]/70 mb-8"
            >
              We leverage Google Gemini 2.5 Flash to transform your brain-dump
              into a structured, VC-ready presentation. Then, our AI Sharks
              simulate a real pitch environment to battle-test your answers.
            </motion.p>

            <motion.ul variants={staggerContainer} className="space-y-4">
              {[
                "Instant structural generation",
                "Automated TAM/SAM/SOM insights",
                "Real-time VC interrogation simulation",
                "Constructive feedback loop",
              ].map((text, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-center text-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-[#6366F1]/20 flex items-center justify-center mr-4">
                    <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  </div>
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-[#111827] border border-white/10 rounded-3xl p-2 shadow-2xl overflow-hidden aspect-square md:aspect-[4/3] flex flex-col">
              <div className="h-8 flex items-center px-4 border-b border-white/10 space-x-2">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/40" />
                <div className="w-3 h-3 rounded-full bg-white/60" />
              </div>
              <div className="flex-1 bg-black p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Slide 4: The Market
                </h3>
                <div className="w-full max-w-sm h-32 border border-white/30 rounded-xl bg-white/5 flex items-end justify-between p-4 mb-4">
                  <div className="w-1/4 bg-white/40 h-1/3 rounded-t" />
                  <div className="w-1/4 bg-white/60 h-2/3 rounded-t" />
                  <div className="w-1/4 bg-white h-full rounded-t" />
                </div>
                <p className="text-[#CCCCFF]/50 text-sm">
                  Gemini generating TAM/SAM/SOM breakdown...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="w-full py-32 bg-background relative">
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for Winners
          </h2>
          <p className="text-xl text-[#CCCCFF]/60 max-w-2xl mx-auto">
            Everything you need to confidently walk into your next partner
            meeting.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="AI Deck Generator"
            desc="Enter a few details about your startup and let Gemini generate a full narrative instantly."
            gradient="from-[#CCCCFF]/20 to-[#8a8aff]/20"
            borderHover="hover:border-[#CCCCFF]/50"
          />
          <FeatureCard
            icon={MessageSquare}
            title="Pitch Q&A Coach"
            desc="Prepare for investor pushback with an AI coach that knows your deck inside out."
            gradient="from-[#CCCCFF]/10 to-[#8a8aff]/30"
            borderHover="hover:border-[#CCCCFF]/50"
          />
          <FeatureCard
            icon={Target}
            title="Competitor Battlecard"
            desc="Generate gamified battlecards pitting your startup's special abilities against incumbents."
            gradient="from-[#CCCCFF]/30 to-white/10"
            borderHover="hover:border-[#CCCCFF]/50"
          />
          <FeatureCard
            icon={LineChart}
            title="Cap Table Math"
            desc="Simulate fundraising rounds and calculate founder dilution before you sign term sheets."
            gradient="from-[#CCCCFF]/20 to-[#8a8aff]/20"
            borderHover="hover:border-[#CCCCFF]/50"
          />
          <FeatureCard
            icon={BrainCircuit}
            title="Runway Calculator"
            desc="Plan your burn rate, track revenue milestones, and visualize your startup's survival timeline."
            gradient="from-[#CCCCFF]/10 to-[#8a8aff]/30"
            borderHover="hover:border-[#CCCCFF]/50"
          />
          <FeatureCard
            icon={Sparkles}
            title="Investor Match"
            desc="Find the perfect VC firms for your specific stage, industry, and funding requirements."
            gradient="from-[#CCCCFF]/30 to-white/10"
            borderHover="hover:border-[#CCCCFF]/50"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  borderHover,
  className = "",
}: any) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className={`group relative p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 transition-all duration-300 ${borderHover} overflow-hidden ${className}`}
    >
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-[#CCCCFF]/60 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}



function Footer() {
  return (
    <footer className="w-full bg-background py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="font-bold text-white">PitchSoup</span>
        </div>
        <p className="text-[#CCCCFF]/40 text-sm">
          © {new Date().getFullYear()} PitchSoup.
        </p>
      </div>
    </footer>
  );
}
