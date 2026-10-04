import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-sienna-brown border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary text-sm font-medium">Completing authentication...</p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
