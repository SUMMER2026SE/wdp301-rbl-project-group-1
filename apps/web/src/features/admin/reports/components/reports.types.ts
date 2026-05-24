import type { LucideIcon } from "lucide-react";

export type ReportSeverity = "critical" | "medium" | "low" | "closed";

export type ReportItem = {
  id: string;
  reason: string;
  reporter: string;
  reporterRole: string;
  target: string;
  severity: ReportSeverity;
  severityLabel: string;
  time: string;
  active?: boolean;
  closed?: boolean;
};

export type ReportStat = {
  label: string;
  value: string;
  change: string;
  changeTone: string;
  icon: LucideIcon;
  iconTone: string;
  trendIcon: LucideIcon;
};
