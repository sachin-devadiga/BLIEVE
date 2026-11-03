"use client";

import {
  Lightbulb,
  BookOpen,
  Rocket,
  Target,
  TrendingUp,
  Award,
  GraduationCap,
  Users,
  IndianRupee,
  Building2,
  Megaphone,
  Handshake,
  Heart,
  Compass,
  Globe,
  Star,
  Zap,
  Layers,
  Sparkles,
  Hammer,
  Flag,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  BookOpen,
  Rocket,
  Target,
  TrendingUp,
  Award,
  GraduationCap,
  Users,
  IndianRupee,
  Building2,
  Megaphone,
  Handshake,
  Heart,
  Compass,
  Globe,
  Star,
  Zap,
  Layers,
  Sparkles,
  Hammer,
  Flag,
};

export function getIcon(name: string, props?: React.ComponentProps<LucideIcon>) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
