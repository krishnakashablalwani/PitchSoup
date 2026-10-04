"use client";

import { useFormStatus } from "react-dom";
import { Sparkles, Loader2 } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full bg-ink-black text-paper-white font-medium py-3.5 px-6 rounded-buttons transition-all hover:scale-[1.01] active:scale-[0.99] text-sm flex items-center justify-center gap-2 shadow-subtle mt-6 ${
        pending ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-sienna-brown dark:text-blush-peach" />
          <span>Cooking Deck... (this takes ~15 seconds)</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-blush-peach" />
          <span>Generate Deck</span>
        </>
      )}
    </button>
  );
}
