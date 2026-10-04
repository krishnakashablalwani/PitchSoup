"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If in Deck Studio, decouple completely from dashboard layout
  if (pathname?.startsWith("/deck")) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-bg-primary text-text-primary">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-48 flex-shrink-0 h-full border-r border-border-subtle">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-primary shrink-0">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <Image
              src="/logo.png"
              alt="PitchSoup Logo"
              width={24}
              height={24}
              className="rounded transition-transform group-hover:scale-110"
            />
            <span className="font-serif font-medium text-sm text-text-primary tracking-tight">
              PitchSoup
            </span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
