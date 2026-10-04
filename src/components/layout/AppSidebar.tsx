"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  PlusSquare,
  MessageSquare,
  Flame,
  Radar,
  Calculator,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      subtitle: "Overview & metrics",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "New Pitch",
      subtitle: "Generate AI deck",
      href: "/pitch/new",
      icon: PlusSquare,
    },
    {
      name: "Pitch Q&A",
      subtitle: "Simulator & coaching",
      href: "/simulator",
      icon: MessageSquare,
    },
    {
      name: "VC Stress Test",
      subtitle: "Risk analysis",
      href: "/tools/stress-test",
      icon: Flame,
    },
    {
      name: "Outreach",
      subtitle: "CRM & emails",
      href: "/tools/outreach",
      icon: Radar,
    },
    {
      name: "Financials",
      subtitle: "Runway & cap table",
      href: "/tools/financials",
      icon: Calculator,
    },
  ];

  return (
    <aside className="w-48 h-full bg-bg-primary flex flex-col shrink-0 border-r border-border-subtle">
      {/* Logo Area */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-border-subtle/70">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2.5 group relative z-10"
        >
          <div className="relative w-7 h-7 rounded-images overflow-hidden group-hover:scale-105 transition-transform shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          <span className="font-serif font-medium text-[16px] text-text-primary tracking-tight">
            PitchSoup
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href + "/") &&
              item.href !== "/dashboard");

          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.subtitle}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-bg-secondary text-text-primary font-medium border border-border-subtle shadow-xs"
                  : "text-text-secondary hover:bg-bg-secondary/70 hover:text-text-primary"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? "text-sienna-brown dark:text-blush-peach"
                    : "text-text-tertiary group-hover:text-text-primary"
                }`}
              />
              <span className="text-[13px] truncate flex-1 leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Settings Menu */}
      <div className="px-2.5 pb-4 pt-3 relative border-t border-border-subtle flex flex-col gap-1">
        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-2.5 mb-2 w-[calc(100%-20px)] bg-bg-floating border border-border-subtle rounded-xl shadow-subtle-2 overflow-hidden z-50 py-1">
            <Link
              href="/settings"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors text-left hover:bg-bg-secondary"
            >
              <Settings className="w-3.5 h-3.5 text-text-tertiary" />
              Settings
            </Link>

            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-rose-600 hover:text-rose-500 transition-colors text-left hover:bg-bg-secondary"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}

        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center justify-between w-full px-2.5 py-2 rounded-xl hover:bg-bg-secondary group transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              src={user?.imageUrl || "https://www.gravatar.com/avatar/?d=mp"}
              alt="Profile"
              className="w-7 h-7 rounded-full bg-mist-gray border border-border-subtle shrink-0 object-cover"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12.5px] font-medium text-text-primary truncate leading-tight">
                {user?.firstName || "Founder"}
              </span>
              <span className="text-[10.5px] text-text-tertiary truncate leading-tight mt-0.5">
                Workspace Admin
              </span>
            </div>
          </div>
          {isProfileMenuOpen ? (
            <ChevronUp className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary transition-colors shrink-0 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary transition-colors shrink-0 ml-1" />
          )}
        </button>
      </div>
    </aside>
  );
}
