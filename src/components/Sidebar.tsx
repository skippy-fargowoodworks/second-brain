"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  FileText,
  Key,
  Search,
  Settings,
  Brain,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/vault", label: "Vault", icon: Key },
  { href: "/search", label: "Search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header - Always visible on mobile/tablet */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 z-50 flex items-center justify-between px-4 min-[1536px]:hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/90 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent opacity-60" />
            <Brain className="relative w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="font-semibold tracking-tight text-white">Second Brain</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400">OS</span>
          </div>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 min-[1536px]:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={cn(
          "fixed top-16 left-0 bottom-0 w-72 bg-slate-950/70 border-r border-white/10 backdrop-blur-2xl z-50 transform transition-transform duration-300 min-[1536px]:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white ring-1 ring-white/15 shadow-[0_12px_30px_-18px_rgba(59,130,246,0.8)]"
                    : "text-slate-300 hover:text-white hover:bg-white/5 hover:ring-1 hover:ring-white/10"
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10">
                  <item.icon className="w-5 h-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar - Only on large screens (1536px+) */}
      <aside className="hidden min-[1536px]:flex fixed left-0 top-0 h-screen w-72 bg-slate-950/70 backdrop-blur-2xl border-r border-white/10 flex-col z-40 gap-6">
        {/* Logo */}
        <div className="px-6 pt-6">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/90 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/35 to-transparent opacity-70" />
              <Brain className="relative w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white tracking-tight">Second Brain</h1>
              <p className="text-xs text-slate-400">Fargo Woodworks</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white ring-1 ring-white/15 shadow-[0_12px_30px_-18px_rgba(59,130,246,0.8)]"
                    : "text-slate-300 hover:text-white hover:bg-white/5 hover:ring-1 hover:ring-white/10"
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10">
                  <item.icon className="w-5 h-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="px-6 pb-6">
          <Link
            href="/settings"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 hover:ring-1 hover:ring-white/10 transition-all duration-200"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </span>
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
