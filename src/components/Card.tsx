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
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-gray-900/80 border border-gray-800 rounded-xl p-4",
      className
    )}>
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
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    green: "bg-green-500/20 text-green-400",
  };

  const Icon = iconMap[iconName] || CheckSquare;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
