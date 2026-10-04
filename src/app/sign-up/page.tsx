"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSignUp, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Sparkles, ShieldCheck, Flame } from "lucide-react";

export default function RegisterPage() {
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountExistsLink, setAccountExistsLink] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || isSubmitting) return;
    setError("");
    setAccountExistsLink(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const createResult = await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          name,
        },
      });

      if (createResult.error) {
        setError(createResult.error.message || "Registration failed.");
        return;
      }

      const sendCodeResult = await signUp.verifications.sendEmailCode();
      if (sendCodeResult.error) {
        setError(
          sendCodeResult.error.message || "Failed to send verification code.",
        );
        return;
      }

      setPendingVerification(true);
    } catch (err: any) {
      console.error(err);
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setAccountExistsLink(true);
        setError(
          "An account with this email already exists. Link your account by continuing with Google.",
        );
      } else {
        setError(err.errors?.[0]?.longMessage || "Registration failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError("");

    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (verifyResult.error) {
        setError(verifyResult.error.message || "Verification failed.");
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize();
        const redirectUrl =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("redirect_url") || "/dashboard"
            : "/dashboard";
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || "Verification failed.");
    }
  };

  const handleGoogleOAuth = async () => {
    if (!signUp) return;
    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect_url") || "/dashboard"
          : "/dashboard";
      const result = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl,
        redirectCallbackUrl: `${window.location.origin}/sso-callback`,
      });
      if (result?.error) {
        setError(result.error.message || "Google Sign-Up failed.");
      }
    } catch (err: any) {
      console.error("Clerk OAuth Error:", err);
      setError(
        err.errors?.[0]?.longMessage ||
          err.message ||
          "An error occurred during Google Sign-Up.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-blush-peach selection:text-sienna-brown font-sans relative overflow-x-hidden">
      {/* Background Soft Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--color-blush-peach)_0%,_transparent_60%)]" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-8 h-8 rounded-images overflow-hidden group-hover:scale-105 transition-transform shadow-sm">
            <Image src="/logo.png" alt="PitchSoup Logo" fill sizes="32px" className="object-cover" priority />
          </div>
          <span className="font-bold text-[18px] tracking-tight font-serif text-text-primary">
            PitchSoup
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="text-[14px] font-sans font-medium text-text-secondary hover:text-text-primary transition-colors hidden sm:inline-block"
          >
            Already have an account? <span className="font-semibold underline underline-offset-4">Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Brand Story / Editorial */}
          <div className="lg:col-span-6 flex flex-col justify-center max-w-xl">

            <h1 className="font-serif text-[2.5rem] lg:text-[3.25rem] text-text-primary leading-[1.12] tracking-tight mb-4">
              Step into the <br />
              <i className="text-text-secondary">kitchen.</i>
            </h1>

            <p className="text-[1.05rem] text-text-secondary leading-relaxed mb-8">
              Join founders who turn raw ideas into institutional-grade pitch decks, validate defensibility, and simulate venture meetings with AI.
            </p>

          </div>

          {/* Right Column: Sign Up Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-md bg-bg-floating border border-border-subtle p-8 md:p-10 rounded-cards shadow-subtle-2 relative">
              <div className="mb-6">
                <h2 className="font-serif text-[1.85rem] text-text-primary tracking-tight mb-1">
                  {pendingVerification ? "Verify Email" : "Create Account"}
                </h2>
                <p className="text-[14px] text-text-secondary font-sans">
                  {pendingVerification
                    ? `Enter the 6-digit code sent to ${email}`
                    : "Join founders building the future of venture"}
                </p>
              </div>

              <div id="clerk-captcha"></div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-inputs text-[13px] flex flex-col gap-3">
                  <p className="leading-relaxed">{error}</p>
                  {accountExistsLink && (
                    <button
                      onClick={handleGoogleOAuth}
                      type="button"
                      className="w-full flex items-center justify-center gap-2 bg-ink-black text-paper-white py-2 px-3 rounded-buttons font-medium text-[13px] hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      <span>Continue with Google</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {!pendingVerification ? (
                <>
                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleOAuth}
                    className="w-full flex items-center justify-center gap-3 bg-bg-secondary hover:bg-mist-gray dark:hover:bg-bg-card border border-border-subtle text-text-primary py-3 px-4 rounded-inputs font-medium text-[14px] transition-all hover:scale-[1.01] active:scale-[0.99] mb-5 shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.549L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25528 2.69 1.28027 6.609L5.27027 9.704C6.21527 6.86 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.294C5.02498 13.569 4.87998 12.8 4.87998 12C4.87998 11.2 5.01998 10.43 5.26498 9.704L1.27498 6.609C0.45998 8.279 0 10.06 0 12C0 13.94 0.45998 15.72 1.28048 17.39L5.26498 14.294Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.2154 17.135 5.2654 14.29L1.2754 17.385C3.2554 21.31 7.3104 24 12.0004 24Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </button>

                  {/* Or Divider */}
                  <div className="relative flex items-center justify-center mb-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border-subtle" />
                    </div>
                    <span className="relative bg-bg-floating px-3 text-[12px] font-sans text-text-muted uppercase tracking-wider">
                      or register with email
                    </span>
                  </div>

                  <form className="space-y-3" onSubmit={handleRegister}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-1"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all"
                        placeholder="name@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-1"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-1"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!signUp || isSubmitting}
                      className="w-full bg-ink-black text-paper-white rounded-buttons py-3 px-4 font-sans text-[14px] font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-4"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-paper-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <form className="space-y-4" onSubmit={handleVerify}>
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-2"
                    >
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all text-center tracking-widest text-xl font-mono"
                      placeholder="123456"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!signUp}
                    className="w-full bg-ink-black text-paper-white rounded-buttons py-3 px-4 font-sans text-[14px] font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    Verify & Continue
                  </button>

                  <button
                    type="button"
                    onClick={() => setPendingVerification(false)}
                    className="w-full text-text-secondary text-[13px] hover:text-text-primary transition-colors mt-2"
                  >
                    ← Back to Registration
                  </button>
                </form>
              )}

              <div className="mt-6 pt-5 border-t border-border-subtle text-center">
                <p className="text-[13px] text-text-secondary">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-text-primary font-semibold hover:underline underline-offset-4"
                  >
                    Sign in here →
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 text-center text-[13px] text-text-muted">
        PitchSoup © 2026 • The Ultimate Pitch Deck Engine
      </footer>
    </div>
  );
}
