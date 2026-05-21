'use client';

import { Button } from '@/src/shared/components/ui/button';

interface FilterTabsProps {
    activeFilter: 'studying' | 'completed';
    onFilterChange: (filter: 'studying' | 'completed') => void;
}

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
    return (
        <div className="flex items-center rounded-xl bg-muted p-1.5 self-start">
            <Button
                onClick={() => onFilterChange('studying')}
                className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${activeFilter === 'studying'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                variant="ghost"
            >
                Đang học
            </Button>
            <Button
                onClick={() => onFilterChange('completed')}
                className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${activeFilter === 'completed'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                variant="ghost"
            >
                Đã hoàn thành
            </Button>
        </div>
    );
}