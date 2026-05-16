export function WelcomeSection() {
    const currentHour = new Date().getHours();
    let greeting = 'Chào buổi sáng';

    if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Chào buổi chiều';
    } else if (currentHour >= 18) {
        greeting = 'Chào buổi tối';
    }

    return (
        <section className="flex flex-col gap-2 pt-4">
            <h1 className="text-foreground text-3xl md:text-4xl font-black leading-tight tracking-tight">
                {greeting}, Thầy Minh! 👋
            </h1>
            <p className="text-muted-foreground text-base md:text-lg font-normal leading-normal">
                Bạn có 3 buổi dạy trong hôm nay. Chúc thầy một ngày làm việc hiệu quả.
            </p>
        </section>
    );
}