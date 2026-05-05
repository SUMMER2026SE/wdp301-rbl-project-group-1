import { GraduationCap, BookCheck, Smile, type LucideIcon } from 'lucide-react';
interface StatItem {
    icon: LucideIcon;
    number: string;
    label: string;
    color: string;
}

const stats: StatItem[] = [
    {
        icon: GraduationCap,
        number: '5,000+',
        label: 'Gia sư tinh hoa',
        color: 'bg-primary/10 text-primary',
    },
    {
        icon: Smile,
        number: '20,000+',
        label: 'Học viên tin tưởng',
        color: 'bg-success-soft text-success',
    },
    {
        icon: BookCheck,
        number: '4.9/5',
        label: 'Đánh giá trung bình',
        color: 'bg-purple-soft text-purple',
    },
];

export default function Stats({ id }: { id?: string }) {
    return (
        <section id={id} className="w-full pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 rounded-3xl border border-border bg-card py-12 shadow-sm">
                    <div className="mb-10 text-center">
                        <h2 className="mb-4 text-3xl font-black leading-tight text-foreground">
                            Mạng lưới học tập lớn nhất
                        </h2>
                        <p className="text-muted-foreground">
                            Được tin dùng bởi hàng ngàn học sinh và gia sư trên toàn quốc
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 px-8 sm:grid-cols-3">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`flex flex-col items-center justify-center gap-3 ${index === 1
                                    ? 'border-y py-8 sm:border-y-0 sm:border-x sm:py-0 border-border'
                                    : ''
                                    }`}
                            >
                                <div className={`rounded-2xl p-4 ${stat.color}`}>
                                    <stat.icon className="text-4xl" />
                                </div>
                                <p className="text-5xl font-black text-foreground">{stat.number}</p>
                                <p className="text-lg font-medium text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}