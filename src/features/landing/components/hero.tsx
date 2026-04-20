import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';

export default function Hero({ id }: { id?: string }) {
    return (
        <section id={id} className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12 lg:py-20">
                    <div className="flex flex-col-reverse lg:flex-row gap-10 items-center">
                        {/* Content */}
                        <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
                            <div className="space-y-4">
                                <h1 className="text-foreground text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                                    Mở khóa tiềm năng cùng{' '}
                                    <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        gia sư chuyên gia
                                    </span>
                                </h1>
                                <p className="text-muted-foreground text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Kết nối với những gia sư hàng đầu để có trải nghiệm học tập cá nhân hóa,
                                    giúp bạn đạt mục tiêu nhanh hơn.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
                                >
                                    Tìm gia sư
                                </Button>
                                <Link href="/register/tutor">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-border hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Trở thành gia sư
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl shadow-2xl">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLFiK7hc5ufQixR_FIGulZ4zJ4F1SWffaRYieH6yt87xna3CPJSL1ZDdgs0kzYv-YNqMvsH1DKnxvOd9YrC7XDMkG6UgoysDqjsbL2eOveYAHUEZGk7uoMKdDhkpFFuAj3Lo1kyJC3j8F6mIdaJ-QJsArtaYZvhrP1C_OK9JlRLjAxo3I5u1PIlBi9139JwtQGK4oz3Ux0c-ntdfNnXLuxzhDuvewWAM5hO030BIIMPJZGYWQ14-IScVemrqvwTTMQoD-0KzsUXTw"
                                    alt="Student and tutor studying together"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/60 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}