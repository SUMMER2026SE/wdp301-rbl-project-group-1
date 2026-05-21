interface StatCard {
    label: string;
    value: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
    icon: string;
}

const stats: StatCard[] = [
    {
        label: 'Số giờ dạy',
        value: '12 giờ',
        trend: '+15%',
        trendDirection: 'up',
        icon: 'schedule',
    },
    {
        label: 'Học sinh mới',
        value: '2 học sinh',
        trend: '+1 học sinh',
        trendDirection: 'up',
        icon: 'people',
    },
];

export function SummaryStats() {
    return (
        <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-foreground text-xl font-bold">Tổng quan tuần này</h3>
            <p className="text-muted-foreground text-sm">Hiệu suất làm việc của bạn</p>

            <div className="space-y-4 mt-2">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-lg border border-border bg-card p-6 flex items-center justify-between hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-info-soft rounded-lg text-info">
                                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                                <p className="text-foreground text-xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                        {stat.trend && (
                            <div
                                className={`text-sm font-semibold ${stat.trendDirection === 'up'
                                    ? 'text-success'
                                    : 'text-error'
                                    }`}
                            >
                                {stat.trendDirection === 'up' ? '📈' : '📉'} {stat.trend}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}