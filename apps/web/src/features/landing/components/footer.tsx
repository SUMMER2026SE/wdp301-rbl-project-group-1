import { GraduationCap } from 'lucide-react';

export default function Footer({ id }: { id?: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer id={id} className="w-full border-t border-border bg-background py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="text-primary" size={24} />
                            <h3 className="font-bold text-foreground">Edura</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Kết nối học sinh và gia sư chuyên nghiệp trên toàn quốc.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-3 font-bold text-foreground">Nền tảng</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Duệt danh sách gia sư</li>
                            <li>Quản lý học tập</li>
                            <li>Hỏi đáp</li>
                            <li>An toàn & Tin cậy</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 font-bold text-foreground">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Trung tâm trợ giúp</li>
                            <li>Câu hỏi thường gặp</li>
                            <li>Liên hệ</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 font-bold text-foreground">Đăng nhận tin tức</h4>
                        <p className="mb-3 text-sm text-muted-foreground">Nhận tài nguyên và mẹo học mỗi tuần.</p>
                        <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                            Đăng ký
                        </button>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
                    <p>© {currentYear} Tutor Connect. All rights reserved.</p>
                    <div className="flex gap-3">
                        <a href="#">Riêng tư</a>
                        <a href="#">Điều khoản</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}