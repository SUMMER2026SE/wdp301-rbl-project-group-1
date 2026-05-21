export function AdminNotification() {
    return (
        <div className="bg-warning-soft border-l-4 border-warning p-4 rounded-r-lg shadow-sm">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <span className="material-symbols-outlined text-warning">campaign</span>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-bold text-warning-foreground">Thông báo từ Admin</h3>
                    <div className="mt-1 text-sm text-warning-foreground/80">
                        <p>Hệ thống sẽ bảo trì định kỳ vào lúc 02:00 sáng ngày 20/10/2023. Vui lòng lưu lại các thay đổi trước thời gian này.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}