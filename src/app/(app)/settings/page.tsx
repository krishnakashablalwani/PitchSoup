"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Settings,
  User,
  Palette,
  Sun,
  Moon,
  Laptop,
  LogOut,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-bg-primary text-text-primary p-6 md:p-10 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Editorial Header */}
        <header className="border-b border-border-subtle pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-peach/40 text-sienna-brown flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-text-primary font-medium tracking-tight">
                Account &amp; Preferences
              </h1>
              <p className="text-text-secondary text-sm mt-0.5 font-sans">
                Manage your founder profile and custom workspace appearance.
              </p>
            </div>
          </div>
        </header>

        {/* Profile Card */}
        <section className="bg-bg-floating border border-border-subtle rounded-2xl p-6 md:p-8 shadow-subtle space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <User className="w-4 h-4 text-sienna-brown" />
            <h2 className="font-serif text-base font-medium text-text-primary">
              Founder Profile
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <img
              src={
                user?.imageUrl ||
                "https://api.dicebear.com/7.x/notionists/svg?seed=placeholder"
              }
              alt="Avatar"
              className="w-16 h-16 rounded-2xl border border-border-subtle shadow-subtle object-cover bg-mist-gray"
            />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-medium text-text-primary">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-xs text-text-secondary font-sans">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-[11px] text-text-muted font-mono pt-1">
                Workspace Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Appearance Card */}
        <section className="bg-bg-floating border border-border-subtle rounded-2xl p-6 md:p-8 shadow-subtle space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Palette className="w-4 h-4 text-sienna-brown" />
            <h2 className="font-serif text-base font-medium text-text-primary">
              Theme &amp; Appearance
            </h2>
          </div>

          <p className="text-xs text-text-secondary font-sans">
            Choose how PitchSoup displays on your workspace. Preferences are persisted automatically.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "light", icon: Sun, label: "Warm Editorial (Light)" },
              { key: "dark", icon: Moon, label: "Obsidian (Dark)" },
              { key: "system", icon: Laptop, label: "System Sync" },
            ].map((opt) => {
              const Icon = opt.icon;
              const isActive =
                mounted &&
                (opt.key === "system"
                  ? theme === "system"
                  : resolvedTheme === opt.key && theme !== "system");

              return (
                <button
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
                    isActive
                      ? "border-sienna-brown/50 bg-blush-peach/25 text-sienna-brown dark:text-blush-peach font-semibold shadow-xs"
                      : "border-border-subtle bg-bg-secondary hover:bg-bg-card text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Session / Danger Zone */}
        <section className="bg-bg-floating border border-rose-500/20 rounded-2xl p-6 md:p-8 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h2 className="font-serif text-base font-medium text-text-primary">
              Session &amp; Security
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-text-primary">
                Sign Out of Workspace
              </p>
              <p className="text-xs text-text-secondary mt-0.5 font-sans">
                Securely terminate your current session on this device.
              </p>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-medium transition-colors flex items-center gap-1.5 w-fit"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
