'use client';

import { Button } from '@/src/shared/components/ui/button';

export type BookingFilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface FilterTabsProps {
  activeFilter: BookingFilterStatus;
  onFilterChange: (filter: BookingFilterStatus) => void;
}

const TABS: { value: BookingFilterStatus; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đang học' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl bg-muted p-1.5 self-start">
      {TABS.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => onFilterChange(tab.value)}
          className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            activeFilter === tab.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
          variant="ghost"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}