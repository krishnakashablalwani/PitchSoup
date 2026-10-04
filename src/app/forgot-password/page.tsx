"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Sparkles, KeyRound, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn() as any;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useGoogleLink, setUseGoogleLink] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const startResendCountdown = () => {
    setResendCountdown(60);
  };

  const requestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isSubmitting) return;

    setError("");
    setUseGoogleLink(false);
    setIsSubmitting(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      startResendCountdown();
    } catch (err: any) {
      console.error("Password reset request error:", err);
      const errorCode = err.errors?.[0]?.code;
      if (errorCode === "user_not_found") {
        setError("No account found with this email address.");
      } else if (errorCode === "strategy_for_user_invalid") {
        setUseGoogleLink(true);
        setError(
          "This account was created with Google. Please sign in with Google instead.",
        );
      } else {
        setError(
          err.errors?.[0]?.longMessage ||
            "Failed to send reset code. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || isSubmitting || resendCountdown > 0) return;

    setError("");
    setIsSubmitting(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      startResendCountdown();
    } catch (err: any) {
      console.error("Password reset request error:", err);
      setError(
        err.errors?.[0]?.longMessage ||
          "Failed to resend reset code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.log("Password reset status:", result.status);
        setError("Password reset incomplete. Please check your verification code.");
      }
    } catch (err: any) {
      console.error("Password reset confirmation error:", err);
      setError(
        err.errors?.[0]?.longMessage ||
          "Failed to reset password. Please check your verification code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleOAuth = async () => {
    if (!signIn) return;
    try {
      const signInAny = signIn as any;
      if (typeof signInAny.sso === "function") {
        const result = await signInAny.sso({
          strategy: "oauth_google",
          redirectCallbackUrl: `${window.location.origin}/sso-callback`,
          redirectUrl: `${window.location.origin}/dashboard`,
        });
        if (result?.error) {
          throw new Error(result.error.message || "SSO failed");
        }
      } else if (typeof signInAny.authenticateWithRedirect === "function") {
        await signInAny.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectUrlComplete: `${window.location.origin}/dashboard`,
        });
      } else {
        throw new Error(
          "Clerk OAuth Error: Neither sso nor authenticateWithRedirect is a function on signIn.",
        );
      }
    } catch (err: any) {
      console.error("Clerk OAuth Error:", err);
      setError(
        err.errors?.[0]?.longMessage ||
          err.message ||
          "An error occurred during Google Sign-In.",
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
            Remember password? <span className="font-semibold underline underline-offset-4">Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-6 flex flex-col justify-center max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-peach/40 text-sienna-brown text-[12px] font-medium tracking-wide uppercase mb-6 w-max border border-sienna-brown/15">
              <KeyRound className="w-3.5 h-3.5" />
              Security & Access
            </div>

            <h1 className="font-serif text-[2.5rem] lg:text-[3.25rem] text-text-primary leading-[1.12] tracking-tight mb-4">
              Reset your <br />
              <i className="text-text-secondary">credentials.</i>
            </h1>

            <p className="text-[1.05rem] text-text-secondary leading-relaxed mb-8">
              We'll send a secure one-time verification code to your email address to help you recover access to your pitch decks.
            </p>

            <div className="flex items-center gap-6 text-[13px] text-text-secondary font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sienna-brown" />
                Encrypted Auth Sessions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sienna-brown" />
                Zero-Loss Recovery
              </span>
            </div>
          </div>

          {/* Right Column: Reset Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-md bg-bg-floating border border-border-subtle p-8 md:p-10 rounded-cards shadow-subtle-2 relative">
              <div className="mb-6">
                <h2 className="font-serif text-[1.85rem] text-text-primary tracking-tight mb-1">
                  {successfulCreation ? "Enter Code" : "Forgot Password"}
                </h2>
                <p className="text-[14px] text-text-secondary font-sans">
                  {successfulCreation
                    ? `Verification code sent to ${email}`
                    : "Enter your email to receive recovery instructions"}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-inputs text-[13px] flex flex-col gap-3">
                  <p className="leading-relaxed">{error}</p>
                  {useGoogleLink && (
                    <button
                      onClick={handleGoogleOAuth}
                      type="button"
                      className="w-full flex items-center justify-center gap-2 bg-ink-black text-paper-white py-2 px-3 rounded-buttons font-medium text-[13px] hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      <span>Sign In with Google</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {!successfulCreation ? (
                <form className="space-y-4" onSubmit={requestPasswordReset}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-1.5"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all"
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isLoaded || isSubmitting}
                    className="w-full bg-ink-black text-paper-white rounded-buttons py-3 px-4 font-sans text-[14px] font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-4"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-paper-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Send Recovery Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={resetPassword}>
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-1.5"
                    >
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all text-center tracking-widest font-mono text-lg"
                      placeholder="123456"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-[12px] font-medium tracking-wide uppercase text-text-secondary mb-1.5"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-bg-secondary border border-border-subtle rounded-inputs px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-ink-black focus:border-ink-black transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isLoaded || isSubmitting}
                    className="w-full bg-ink-black text-paper-white rounded-buttons py-3 px-4 font-sans text-[14px] font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    Set New Password & Sign In
                  </button>

                  <div className="flex items-center justify-between text-[12px] text-text-secondary pt-2">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCountdown > 0 || isSubmitting}
                      className="hover:text-text-primary transition-colors disabled:opacity-50"
                    >
                      {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuccessfulCreation(false)}
                      className="hover:text-text-primary transition-colors"
                    >
                      Change Email
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-border-subtle text-center">
                <Link
                  href="/sign-in"
                  className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                >
                  ← Back to Sign In
                </Link>
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
