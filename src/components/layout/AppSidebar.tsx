"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigation: Array<{ name: string; href: string; icon: string; comingSoon?: boolean }> = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "New Pitch", href: "/pitch/new", icon: "add_box" },
    { name: "Demo Day Showcase", href: "/showcase", icon: "public" },
    { name: "Pitch Scorecard", href: "/tools/pitch-score", icon: "scoreboard" },
    { name: "Pitch Q&A", href: "/simulator", icon: "forum" },
    { name: "Cap Table", href: "/tools/cap-table", icon: "calculate" },
    { name: "Runway Calculator", href: "/tools/runway", icon: "speed" },
    { name: "Investor Match", href: "/tools/investor-match", icon: "radar" },
    { name: "Competitor Battlecard", href: "/tools/battlecard", icon: "swords" },
    { name: "Export Hub", href: "/tools/export", icon: "download" },
  ];

  return (
    <div className="w-64 h-screen fixed top-0 left-0 border-r border-border bg-gradient-to-b from-background via-background to-foreground/5 flex flex-col z-50 shadow-2xl">
      {/* Logo Area */}
      <div className="p-8 border-b border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -z-10 rounded-full" />
        <Link href="/dashboard" className="flex items-center space-x-4 group relative z-10">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="PitchSoup Logo"
              width={40}
              height={40}
              className="rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
            />
          </div>
          <span className="font-headline-md font-black tracking-widest text-xl text-transparent bg-clip-text text-white">
            PitchSoup
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Platform
        </div>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href + "/") &&
              item.href !== "/dashboard");
          return (
            <Link
              key={item.name}
              href={item.comingSoon ? "#" : item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive && !item.comingSoon
                  ? "bg-foreground/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              } ${item.comingSoon ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={(e) => {
                if (item.comingSoon) e.preventDefault();
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-[20px] ${isActive && !item.comingSoon ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {item.comingSoon && (
                <span className="text-[9px] font-bold bg-foreground/5 border border-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile / Settings */}
      <div className="p-4 border-t border-border relative">
        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-4 mb-2 w-[calc(100%-32px)] bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
            <Link
              href="/settings"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center gap-3 w-full p-3 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[18px]">
                settings
              </span>
              Settings & Account
            </Link>

            <div className="h-px w-full bg-border"></div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex items-center gap-3 w-full p-3 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Sign Out
            </button>
          </div>
        )}

        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-foreground/5 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <img
              src={user?.imageUrl || "https://www.gravatar.com/avatar/?d=mp"}
              alt="Profile"
              className="w-8 h-8 rounded-lg"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground line-clamp-1">
                {user?.firstName || "My Profile"}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                Manage Account
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-muted-foreground text-sm">
            {isProfileMenuOpen ? "expand_more" : "expand_less"}
          </span>
        </button>
      </div>
    </div>
  );
}
