"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className={`w-full bg-[#CCCCFF] text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] font-body-md text-lg mt-4 ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? "Cooking Deck... (this takes ~15 seconds)" : "Generate Deck"}
    </button>
  );
}
