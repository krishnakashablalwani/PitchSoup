"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl md:text-4xl font-headline-xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-body-md">
            Manage your profile and preferences.
          </p>
        </div>

        {/* Profile Section */}
        <section className="glass-panel rounded-3xl p-8">
          <h2 className="text-xl font-headline-md font-semibold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Profile
          </h2>
          <div className="flex items-center gap-6">
            <img
              src={user?.imageUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=placeholder"}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl border-2 border-border shadow-lg"
            />
            <div className="flex-1 space-y-1">
              <h3 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-muted-foreground font-body-md">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-xs text-muted-foreground/60 font-mono-data mt-2">
                Member since{" "}
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

        {/* Appearance Section */}
        <section className="glass-panel rounded-3xl p-8">
          <h2 className="text-xl font-headline-md font-semibold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            Appearance
          </h2>
          <p className="text-muted-foreground font-body-md mb-6">
            Choose how PitchSoup looks for you. Your preference is saved locally.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "light", icon: "light_mode", label: "Light" },
              { key: "dark", icon: "dark_mode", label: "Dark" },
              { key: "system", icon: "desktop_windows", label: "System" },
            ].map((opt) => {
              const isActive =
                mounted &&
                (opt.key === "system"
                  ? theme === "system"
                  : resolvedTheme === opt.key && theme !== "system");
              return (
                <button
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  className={`p-6 rounded-2xl border-2 transition-all text-center ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary shadow-md"
                      : "border-border bg-foreground/5 hover:bg-foreground/10 text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="material-symbols-outlined block mb-3 text-4xl">
                    {opt.icon}
                  </span>
                  <span className="font-semibold block font-body-md">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="glass-panel rounded-3xl p-8 border-destructive/20">
          <h2 className="text-xl font-headline-md font-semibold mb-6 flex items-center gap-2 text-destructive">
            <span className="material-symbols-outlined">warning</span>
            Account
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                End your current session and return to the landing page.
              </p>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="px-6 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 font-semibold transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
