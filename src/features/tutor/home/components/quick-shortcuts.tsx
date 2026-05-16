import { Button } from '@/src/shared/components/ui/button';

interface ShortcutItem {
    icon: string;
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
    href: string;
}

const shortcuts: ShortcutItem[] = [
    {
        icon: 'add_circle',
        title: 'Tạo buổi học mới',
        description: 'Lên lịch buổi học sắp tới',
        bgColor: 'bg-info-soft',
        textColor: 'text-info',
        href: '#',
    },
    {
        icon: 'upload_file',
        title: 'Gửi tài liệu',
        description: 'Chia sẻ file với học sinh',
        bgColor: 'bg-purple-soft',
        textColor: 'text-purple',
        href: '#',
    },
    {
        icon: 'chat',
        title: 'Kiểm tra tin nhắn',
        description: 'Xem tin nhắn chưa đọc',
        bgColor: 'bg-success-soft',
        textColor: 'text-success',
        href: '#',
    },
];

export function QuickShortcuts() {
    return (
        <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-foreground text-xl font-bold">Lối tắt nhanh</h3>
            <p className="text-muted-foreground text-sm">Truy cập nhanh các chức năng thường dùng</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {shortcuts.map((shortcut) => (
                    <Button
                        key={shortcut.title}
                        variant="outline"
                        className="flex flex-col items-start gap-4 h-auto p-5 border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group text-left"
                    >
                        <div className={`p-3 ${shortcut.bgColor} rounded-lg ${shortcut.textColor} group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl">{shortcut.icon}</span>
                        </div>
                        <div>
                            <h4 className="text-foreground text-base font-bold mb-1">
                                {shortcut.title}
                            </h4>
                            <p className="text-muted-foreground text-xs">{shortcut.description}</p>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}