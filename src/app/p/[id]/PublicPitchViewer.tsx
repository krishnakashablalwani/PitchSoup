"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SlideVisual } from "@/components/deck/SlideVisual";

interface Slide {
  title: string;
  content: string[];
  speakerNotes?: string;
  graphicsSuggestion?: string;
  imageUrl?: string;
}

interface Pitch {
  id: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel?: string;
  traction?: string;
  fundraisingAsk?: string;
  createdAt: string;
}

export default function PublicPitchViewer({
  pitch,
  slides,
}: {
  pitch: Pitch;
  slides: Slide[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submittedContact, setSubmittedContact] = useState(false);

  const displaySlides: Slide[] =
    slides && slides.length > 0
      ? slides
      : [
          {
            title: "THE PROBLEM",
            content: [pitch.problem],
          },
          {
            title: "OUR SOLUTION",
            content: [pitch.solution, `Targeting: ${pitch.targetMarket}`],
          },
        ];

  const slide = displaySlides[currentSlide];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedContact(true);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col selection:bg-sienna-brown/30">
      {/* Top Navigation */}
      <header className="px-12 py-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-4 group relative z-10"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[32px] text-sienna-brown dark:text-blush-peach">
              play_shapes
            </span>
          </div>
          <span className="font-sans font-normal tracking-widest text-xl text-text-primary">
            PitchSoup
          </span>
        </Link>

        <button
          onClick={() => setShowContactModal(true)}
          className="bg-ink-black dark:bg-paper-white text-paper-white dark:text-ink-black font-sans font-semibold text-[13px] uppercase tracking-wider px-5 py-2.5 rounded-full inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          Request Intro / Contact
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 md:px-12 pb-24 space-y-16 mt-8">
        {/* Startup Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <span className="text-xs tracking-wider text-sienna-brown dark:text-blush-peach uppercase font-medium mb-3 block">
              Investment Memo
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-text-primary leading-tight max-w-3xl">
              {pitch.startupName}
            </h1>
          </div>
          <div className="pt-2">
            <p className="text-[15px] font-sans text-text-secondary leading-relaxed max-w-[480px]">
              {pitch.problem}
            </p>
          </div>
        </div>

        {/* Slide Deck Canvas */}
        <div className="flex flex-col md:flex-row gap-12 items-start pt-12 border-t border-border-subtle">
          <div className="w-full md:w-1/3 space-y-6 sticky top-12">
            <h2 className="font-serif text-xl font-medium text-text-primary">
              Slide {currentSlide + 1} of {displaySlides.length}
            </h2>
            <div className="flex flex-col gap-4">
              {displaySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`text-left transition-colors ${
                    idx === currentSlide
                      ? "text-sienna-brown dark:text-blush-peach font-semibold"
                      : "text-text-muted font-normal hover:text-text-primary"
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-widest font-semibold">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-8">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
                title="Previous slide"
              >
                <span className="material-symbols-outlined text-[24px]">
                  arrow_back
                </span>
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) =>
                    Math.min(displaySlides.length - 1, prev + 1),
                  )
                }
                disabled={currentSlide === displaySlides.length - 1}
                className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
                title="Next slide"
              >
                <span className="material-symbols-outlined text-[24px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-2/3 min-h-[440px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex items-center"
              >
                <div className="w-full max-w-2xl space-y-8">
                  <h3 className="text-[2.5rem] md:text-heading font-display font-normal tracking-[-1.68px] text-text-primary leading-tight">
                    {slide.title}
                  </h3>

                  <ul className="space-y-6">
                    {slide.content?.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="text-body font-sans font-extralight text-text-secondary leading-[1.6] flex items-start gap-4"
                      >
                        <span className="w-2 h-2 rounded-full bg-sienna-brown dark:bg-blush-peach mt-2.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Company Quick Intel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24 border-t border-border-subtle">
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-widest text-sienna-brown dark:text-blush-peach font-semibold">
              Solution
            </span>
            <p className="text-[15px] font-sans text-text-secondary">
              {pitch.solution}
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-widest text-sienna-brown dark:text-blush-peach font-semibold">
              Target Market
            </span>
            <p className="text-[15px] font-sans text-text-secondary">
              {pitch.targetMarket}
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-widest text-sienna-brown dark:text-blush-peach font-semibold">
              Traction
            </span>
            <p className="text-[15px] font-sans text-text-secondary">
              {pitch.traction || "Early customer validation"}
            </p>
          </div>
        </div>
      </main>

      {/* Contact Founder Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-bg-primary/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full relative">
            <button
              onClick={() => {
                setShowContactModal(false);
                setSubmittedContact(false);
              }}
              className="absolute -top-12 right-0 text-text-muted hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">
                close
              </span>
            </button>

            {submittedContact ? (
              <div className="text-center py-12 space-y-6">
                <span className="material-symbols-outlined text-sienna-brown dark:text-blush-peach text-[48px]">
                  done_all
                </span>
                <h3 className="font-serif text-2xl text-text-primary">
                  Intro Request Sent
                </h3>
                <p className="text-sm font-sans text-text-secondary">
                  Your inquiry to {pitch.startupName} has been routed to the founders.
                </p>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setSubmittedContact(false);
                  }}
                  className="mt-6 bg-ink-black dark:bg-paper-white text-paper-white dark:text-ink-black font-sans font-medium text-xs uppercase tracking-wider px-6 py-2.5 rounded-full"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-text-primary">
                  Contact Founder
                </h3>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <input
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      placeholder="e.g. Sarah Connor / Cyberdyne Ventures"
                      className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-primary font-sans text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black transition-all"
                    />
                  </div>
                  <div>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="name@firm.com"
                      className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-primary font-sans text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      placeholder="We'd love to learn more about your traction and discuss a seed ticket..."
                      className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-primary font-sans text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-ink-black dark:bg-paper-white text-paper-white dark:text-ink-black font-sans font-medium text-sm py-3 rounded-xl inline-flex items-center justify-center transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                  >
                    Send Intro Inquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
