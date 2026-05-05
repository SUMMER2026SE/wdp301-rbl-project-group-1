import Image from 'next/image';
import {
    Calendar,
    Video,
    FolderEdit,
    TrendingUp,
    Gamepad2,
    BellRing,
    BarChart3,
    MessageSquare,
    BookOpen,
    UserSearch,
    Users,
    CreditCard,
    CheckCircle2,
    Wallet,
    Check,
    ChevronDown,
    type LucideIcon
} from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    iconBg: string;
}

const features: Feature[] = [
    {
        icon: Calendar,
        title: 'Lịch học thông minh',
        description: 'Đặt lịch học dễ dàng với tính năng tích hợp lịch đồng bộ hóa qua các múi giờ.',
        iconBg: 'bg-primary/10 text-primary',
    },
    {
        icon: Video,
        title: 'Video tích hợp',
        description:
            'Cuộc gọi video được dẫn qua Google Meet trên trình duyệt của bạn.',
        iconBg: 'bg-error-soft text-error',
    },
    {
        icon: FolderEdit,
        title: 'Chia sẻ tài liệu',
        description:
            'Chia sẻ bài tập, tệp PDF và ghi chú bảng trắng ngay lập tức với gia sư của bạn.',
        iconBg: 'bg-warning-soft text-warning',
    },
    {
        icon: TrendingUp,
        title: 'Theo dõi tiến độ',
        description:
            'Xem báo cáo chi tiết về tiến độ học tập và cải thiện với các phân tích theo thời gian thực.',
        iconBg: 'bg-cyan-soft text-cyan',
    },
    {
        icon: Gamepad2,
        title: 'Quiz Game',
        description:
            'Quiz tương tác giúp củng cố kiến thức và làm cho việc học trở nên thú vị hơn bao giờ hết.',
        iconBg: 'bg-purple-soft text-purple',
    },
    {
        icon: BellRing,
        title: 'Thông báo tức thì',
        description:
            'Nhận cảnh báo về lịch học, điểm số mới, nhận xét từ gia sư và thanh toán sắp đến hạn cho cả học sinh, gia sư và phụ huynh.',
        iconBg: 'bg-pink-soft text-pink',
    },
    {
        icon: BarChart3,
        title: 'Báo cáo chi tiết',
        description:
            'Biểu đồ trực quan về sự tiến bộ, điểm danh, bài tập hoàn thành và đánh giá từng tuần.',
        iconBg: 'bg-indigo-soft text-indigo',
    },
    {
        icon: MessageSquare,
        title: 'Trao đổi với gia sư',
        description:
            'Kênh nhắn tin trực tiếp để phụ huynh trao đổi với gia sư về tiến độ và phương pháp học.',
        iconBg: 'bg-teal-soft text-teal',
    },
];

export default function Features({ id = "features" }: { id?: string }) {
    return (
        <section id={id} className="w-full py-16 lg:py-20">
            <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
                        Hành trình của bạn tại Edura
                    </h2>
                    <p className="mx-auto max-w-3xl text-muted-foreground">
                        Quy trình đơn giản, minh bạch giúp bạn nhanh chóng đạt được mục tiêu học tập và giảng
                        dạy.
                    </p>
                </div>

                <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12">
                    <div className="mb-6 flex items-center gap-3 text-primary">
                        <BookOpen size={32} />
                        <h3 className="text-2xl font-bold text-foreground">Dành cho Học sinh</h3>
                    </div>

                    <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="absolute left-0 top-1/2 -z-10 hidden h-0.5 w-full -translate-y-1/2 bg-primary/20 md:block" />
                        {[
                            {
                                title: 'Tìm kiếm gia sư',
                                desc: 'Lọc theo môn học, trình độ, giá cả và đánh giá để chọn gia sư phù hợp nhất.',
                            },
                            {
                                title: 'Đặt lịch học',
                                desc: 'Chọn khung giờ rảnh, thanh toán an toàn và nhận liên kết học trực tuyến.',
                            },
                            {
                                title: 'Bắt đầu học',
                                desc: 'Kết nối qua phòng học ảo, làm bài tập và theo dõi tiến bộ từng ngày.',
                            },
                        ].map((item, idx) => (
                            <div key={item.title} className="relative z-10 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border-4 border-background bg-primary text-xl font-bold text-primary-foreground">
                                    {idx + 1}
                                </div>
                                <h4 className="mb-2 text-lg font-bold text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-success/20 bg-success-soft/30 p-8 sm:p-12">
                    <div className="mb-6 flex items-center gap-3 text-success">
                        <UserSearch size={32} />
                        <h3 className="text-2xl font-bold text-foreground">Dành cho Gia sư</h3>
                    </div>
<div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="absolute left-0 top-1/2 -z-10 hidden h-0.5 w-full -translate-y-1/2 bg-success/20 md:block" />
                        {[
                            {
                                title: 'Tạo hồ sơ',
                                desc: 'Cập nhật bằng cấp, kinh nghiệm giảng dạy và thiết lập mức giá mong muốn.',
                            },
                            {
                                title: 'Kết nối học viên',
                                desc: 'Nhận yêu cầu học từ học sinh và quản lý lịch trình linh hoạt.',
                            },
                            {
                                title: 'Tăng thu nhập',
                                desc: 'Nhận thanh toán an toàn, có thể rút tiền bất kỳ lúc nào và xây dựng uy tín.',
                            },
                        ].map((item, idx) => (
                            <div key={item.title} className="relative z-10 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border-4 border-background bg-success text-xl font-bold text-success-foreground">
                                    {idx + 1}
                                </div>
                                <h4 className="mb-2 text-lg font-bold text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-purple/20 bg-purple-soft/30 p-8 sm:p-12">
                    <div className="mb-6 flex items-center gap-3 text-purple">
                        <Users size={32} />
                        <h3 className="text-2xl font-bold text-foreground">Dành cho Phụ huynh</h3>
                    </div>

                    <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="absolute left-0 top-1/2 -z-10 hidden h-0.5 w-full -translate-y-1/2 bg-purple/20 md:block" />
                        {[
                            {
                                title: 'Đăng ký con em',
                                desc: 'Tạo tài khoản cho con và chọn gia sư phù hợp với nhu cầu học tập.',
                            },
                            {
                                title: 'Theo dõi tiến độ',
                                desc: 'Xem báo cáo chi tiết về thời gian học, kết quả bài tập và đánh giá từ gia sư.',
                            },
                            {
                                title: 'Quản lý tài chính',
                                desc: 'Kiểm soát chi phí học, lịch thanh toán và nhận thông báo về buổi học sắp tới.',
                            },
                        ].map((item, idx) => (
                            <div key={item.title} className="relative z-10 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border-4 border-background bg-purple text-xl font-bold text-purple-foreground">
                                    {idx + 1}
                                </div>
                                <h4 className="mb-2 text-lg font-bold text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-10 py-6 lg:py-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
                            Mọi thứ bạn cần để thành công
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Nền tảng tổng hợp của chúng tôi cung cấp bộ công cụ đầy đủ cho học tập và giảng dạy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50 hover:shadow-md">
                                    <div className={`mb-4 flex size-12 items-center justify-center rounded-lg ${feature.iconBg} transition-transform group-hover:scale-110`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="py-6">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-black text-foreground">Chính sách giá minh bạch</h2>
                        <p className="text-muted-foreground">Không phí ẩn. Hiểu rõ dòng tiền của bạn.</p>
                    </div>

                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                                <CreditCard className="text-primary" />
                                Thanh toán cho Học sinh
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={18} className="mt-0.5 text-success" />
                                    <div>
                                        <strong className="text-foreground">Trả theo buổi học:</strong>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Chỉ thanh toán cho các buổi học đã hoàn thành.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={18} className="mt-0.5 text-success" />
                                    <div>
                                        <strong className="text-foreground">Mua theo gói:</strong>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Tiết kiệm đến 15% khi mua gói 10, 20 hoặc 50 buổi học.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                                <Wallet className="text-warning" />
                                Hoa hồng Gia sư
                            </h3>
                            <div className="mb-6 rounded-xl border border-warning/20 bg-warning-soft/30 p-6">
                                <div className="mb-2 flex items-end gap-2">
                                    <span className="text-4xl font-black text-warning">10-15%</span>
                                    <span className="pb-1 font-medium text-warning/80">/buổi học</span>
                                </div>
                                <p className="text-sm text-warning/90">
                                    Mức phí nền tảng cạnh tranh nhất thị trường.
                                </p>
                            </div>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check size={16} /> Hoa hồng giảm dần khi bạn dạy càng nhiều giờ.</li>
                                <li className="flex items-center gap-2"><Check size={16} /> Miễn phí tạo hồ sơ và tiếp cận học sinh.</li>
                                <li className="flex items-center gap-2"><Check size={16} /> Hỗ trợ công cụ giảng dạy và marketing cá nhân.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="py-4">
                    <h2 className="mb-8 text-3xl font-bold text-foreground">Tài nguyên học tập mới nhất</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {[
                            {
                                tag: 'Mẹo học tập',
                                title: '10 Kỹ thuật ghi nhớ thông tin lâu hơn',
                                desc: 'Khám phá các phương pháp được khoa học chứng minh để cải thiện trí nhớ.',
                                image:
                                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDtAGjy-XBovQljOWkfCZp94QTmKyKvSmGSTpzZdYATn_A8QZELg80lfiu4kKbiWAbFPWjxae7r_yPVKa7n2V545yjqAxfbUayLpVjFNIjbINGhHBjOyw5IDUSn-NxOi53Z_S25c9SjzxEku_klEjOqVjGtqHlMJ0yG6mKX4JmBIsCJTlhS1fa9e5ReugJM83_A7cDVbzYc76SYspVHaWg4JDD6lubpg9uIuOAPi0gvR0fVakTr5Z6TUgi2iJ1B-59Q6ap6CT4CJw',
                            },
                            {
                                tag: 'Công nghệ giáo dục',
                                title: 'Tối ưu hóa các buổi học trực tuyến của bạn',
                                desc: 'Cách chuẩn bị môi trường và tư duy để học tập từ xa hiệu quả nhất.',
                                image:
                                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDB4FmX_3onAJ3Lr6pVelk5RoP8QLD2gFK2GlBphd5fZPIPK-aoB9vrusytq8KyvqOgyAlQ8upXzxoSKrhFZIXOkXYmU09JnTjXEGnsyXZdqhjX3A0S7dYM8ZIxZP3vGMrfgaaz-CqIdWus-qQu2Vmmlt_yVAF_vA_GcjQ9Z2AB_LvQ1klIryOHsxwd_zGt6yHS9plIUfP-yH_8um7I-wgFVrt2YkrI15jaHD7aEz8mZGnE3j3_zB50o0FYNlg8cL2TIHwFtuXFzwE',
                            },
                        ].map((item) => (
                            <article key={item.title} className="flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/30 md:flex-row">
                                <div className="relative h-48 w-full shrink-0 md:h-auto md:w-48">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex flex-col justify-center p-6">
                                    <span className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{item.tag}</span>
                                    <h3 className="mb-2 text-xl font-bold text-foreground">{item.title}</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">{item.desc}</p>
                                    <a className="text-sm font-bold text-foreground transition-colors hover:text-primary" href="#">Đọc thêm →</a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="mx-auto w-full max-w-3xl py-6">
                    <div className="mb-10 text-center">
                        <h2 className="mb-4 text-3xl font-black text-foreground">Câu hỏi thường gặp</h2>
                        <p className="text-muted-foreground">Giải đáp nhanh những thắc mắc của bạn</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Gia sư nhận tiền khi nào?',
                                a: 'Gia sư được thanh toán định kỳ theo số buổi học đã hoàn thành và xác nhận trên hệ thống.',
                            },
                            {
                                q: 'Có thể học thử không?',
                                a: 'Có. Nhiều gia sư hỗ trợ buổi học thử để học sinh trải nghiệm trước khi đăng ký dài hạn.',
                            },
                            {
                                q: 'Nền tảng thu phí bao nhiêu?',
                                a: 'Phí nền tảng minh bạch trong khoảng 10-15% tùy theo gói và số giờ giảng dạy.',
                            },
                        ].map((item) => (
                            <details key={item.q} className="group rounded-xl border border-border bg-card [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 font-bold text-foreground">
                                    <span className="text-lg">{item.q}</span>
                                    <ChevronDown className="shrink-0 transition duration-300 group-open:-rotate-180" />
                                </summary>
                                <div className="px-6 pb-6 leading-relaxed text-muted-foreground">{item.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}