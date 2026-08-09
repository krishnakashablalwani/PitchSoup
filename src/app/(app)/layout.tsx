import { AppSidebar } from "@/components/layout/AppSidebar";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] dark:opacity-[0.25]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* Foreground UI */}
      <div className="z-10 flex h-full w-full">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image src="/logo.png" alt="PitchSoup Logo" width={24} height={24} className="rounded transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-[0.1em] text-foreground">PitchSoup</span>
            </Link>
          </div>
          
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
