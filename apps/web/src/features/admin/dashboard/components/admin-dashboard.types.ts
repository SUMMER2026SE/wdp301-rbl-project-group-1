import type { LucideIcon } from "lucide-react";

export type StatItem = {
  label: string;
  value: string;
  suffix?: string;
  change: string;
  icon: LucideIcon;
  tone: string;
};

export type ApprovalItem = {
  name: string;
  subject: string;
  time: string;
  initials: string;
};

export type WithdrawalRequest = {
  tutor: string;
  amount: string;
  date: string;
  status: string;
};

export type RevenueBar = {
  label: string;
  height: string;
};
