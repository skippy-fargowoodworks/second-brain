"use client";

import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-40px_rgba(56,189,248,0.6)] backdrop-blur-xl transition-all duration-300",
        hover && "hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {hover && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      {children}
    </div>
  );
}

const iconMap: Record<string, any> = {
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
};

export function StatCard({
  title,
  value,
  iconName,
  color = "blue",
}: {
  title: string;
  value: string | number;
  iconName: string;
  color?: "blue" | "purple" | "yellow" | "green";
}) {
  const colorClasses = {
    blue: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20",
    purple: "bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/20",
    yellow: "bg-yellow-500/15 text-yellow-200 ring-1 ring-yellow-400/25",
    green: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20",
  };

  const Icon = iconMap[iconName] || CheckSquare;

  return (
    <Card className="min-h-[128px]">
      <div className="relative flex items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
