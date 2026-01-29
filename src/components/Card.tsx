"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  Key,
  LucideIcon,
} from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card p-4 lg:p-6",
        hover && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Map icon names to components (avoid serialization issues)
const iconMap: Record<string, LucideIcon> = {
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  Key,
};

export function StatCard({
  title,
  value,
  iconName,
  trend,
  color = "primary",
}: {
  title: string;
  value: string | number;
  iconName: string;
  trend?: string;
  color?: "primary" | "accent" | "success" | "warning";
}) {
  const colorClasses = {
    primary: "from-primary-500/20 to-primary-600/20 text-primary-400",
    accent: "from-accent-500/20 to-accent-600/20 text-accent-400",
    success: "from-green-500/20 to-green-600/20 text-green-400",
    warning: "from-yellow-500/20 to-yellow-600/20 text-yellow-400",
  };

  const Icon = iconMap[iconName] || CheckSquare;

  return (
    <Card hover={false}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs lg:text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold">{value}</p>
          {trend && (
            <p className="text-xs lg:text-sm text-green-400 mt-2">{trend}</p>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
          colorClasses[color]
        )}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
      </div>
    </Card>
  );
}
