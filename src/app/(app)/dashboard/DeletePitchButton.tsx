"use client";

import { Trash2 } from "lucide-react";
import { deletePitch } from "@/app/actions/pitchCrud";
import { useTransition } from "react";

export function DeletePitchButton({ pitchId }: { pitchId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this pitch deck? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deletePitch(pitchId);
        } catch (error) {
          console.error("Failed to delete pitch", error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-lg text-sienna-brown/40 hover:text-rose-600 hover:bg-rose-50 transition-colors z-20 relative"
      title="Delete Pitch"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
