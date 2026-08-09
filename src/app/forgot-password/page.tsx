"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
        setError("Password reset incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("Password reset attempt error:", err);
      const errorCode = err.errors?.[0]?.code;
      if (errorCode === "form_code_incorrect") {
        setError("Incorrect reset code. Please try again.");
      } else if (errorCode === "form_password_pwned") {
        setError(
          "This password has been compromised in a data breach. Please choose a different one.",
        );
      } else if (err.errors?.[0]?.meta?.paramName === "password") {
        setError(
          err.errors?.[0]?.message || "Password does not meet requirements.",
        );
      } else {
        setError(
          err.errors?.[0]?.longMessage ||
            "Failed to reset password. Please try again.",
        );
      }
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
    <div className="min-h-screen relative bg-black text-white flex overflow-hidden">
      {/* Background with Diagonal Split - visible on lg screens */}
      <div
        className="absolute inset-0 z-0 bg-neutral-900 hidden lg:block"
        style={{ clipPath: "polygon(0 0, 55% 0, 45% 100%, 0% 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
        {/* Left Side: Text / Info */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:pr-24">
          <Link
            href="/"
            className="flex items-center space-x-3 mb-16 w-max group"
          >
            <img
              src="/logo.png"
              alt="PitchSoup Logo"
              className="w-8 h-8 rounded object-contain transition-transform group-hover:scale-110"
            />
            <span className="font-bold tracking-[0.1em] text-lg text-white uppercase">
              PitchSoup
            </span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Reset your <span className="text-indigo-400">access.</span>
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8">
            Enter your email address to receive a verification code. You can
            then use this code to choose a new password and regain access to
            your dashboard.
          </p>
        </div>

        {/* Right Side: Reset Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Forgot Password
              </h2>
              <p className="text-neutral-400 text-sm">
                {!successfulCreation
                  ? "Enter your email to reset your password"
                  : "Check your email for the reset code"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-xl">
                <p className="text-red-200 text-sm font-medium">{error}</p>
                {useGoogleLink && (
                  <button
                    onClick={handleGoogleOAuth}
                    type="button"
                    className="w-full flex items-center justify-center space-x-3 bg-white text-black py-2.5 px-4 rounded-xl font-semibold hover:bg-neutral-200 transition-all shadow-md hover:scale-[1.02]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
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
                    <span>Continue with Google</span>
                  </button>
                )}
              </div>
            )}

            {!successfulCreation ? (
              <form className="space-y-4" onSubmit={requestPasswordReset}>
                <div>
                  <label
                    className="block text-sm font-medium text-neutral-300 mb-1.5"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isLoaded || isSubmitting}
                  className="w-full bg-indigo-500 text-white font-semibold rounded-xl px-4 py-3 mt-4 hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={resetPassword}>
                <div>
                  <label
                    className="block text-sm font-medium text-neutral-300 mb-1.5"
                    htmlFor="code"
                  >
                    Reset Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter the 6-digit code"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-neutral-300 mb-1.5"
                    htmlFor="password"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isLoaded || isSubmitting}
                  className="w-full bg-indigo-500 text-white font-semibold rounded-xl px-4 py-3 mt-4 hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <div className="mt-4 pt-2 text-center flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCountdown > 0 || isSubmitting}
                    className="text-sm font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-neutral-400"
                  >
                    {resendCountdown > 0
                      ? `Resend code in ${resendCountdown}s`
                      : "Didn't receive the code? Resend"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <Link
                href="/sign-in"
                className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
