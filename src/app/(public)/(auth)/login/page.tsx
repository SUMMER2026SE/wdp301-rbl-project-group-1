import { GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import LoginForm from "@/src/features/auth/components/login-form";
import { Button } from "@/src/shared/components/ui/button";

export default function Login() {
  return (
    <main className="flex min-h-screen w-full bg-background">
      <section className="relative hidden w-1/2 overflow-hidden bg-primary lg:flex lg:items-center lg:justify-center">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLFiK7hc5ufQixR_FIGulZ4zJ4F1SWffaRYieH6yt87xna3CPJSL1ZDdgs0kzYv-YNqMvsH1DKnxvOd9YrC7XDMkG6UgoysDqjsbL2eOveYAHUEZGk7uoMKdDhkpFFuAj3Lo1kyJC3j8F6mIdaJ-QJsArtaYZvhrP1C_OK9JlRLjAxo3I5u1PIlBi9139JwtQGK4oz3Ux0c-ntdfNnXLuxzhDuvewWAM5hO030BIIMPJZGYWQ14-IScVemrqvwTTMQoD-0KzsUXTw"
          alt="Students studying together"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-primary/35" />
        <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />

        <div className="relative z-10 max-w-lg p-12 text-primary-foreground">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-2xl font-bold">Tutor Connect</h2>
          </div>
          <h1 className="mb-6 text-5xl font-black leading-tight">
            Kết nối tri thức, kiến tạo tương lai.
          </h1>
          <p className="text-lg leading-relaxed text-primary-foreground/85">
            Tham gia cộng đồng học tập hàng đầu với hơn 500+ gia sư chuyên
            nghiệp và công cụ quản lý học tập thông minh.
          </p>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-background p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-8 flex items-center justify-center gap-2 text-primary lg:hidden">
            <GraduationCap className="size-8" />
            <span className="text-2xl font-bold text-foreground">
              Tutor Connect
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Chào mừng trở lại
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục.
            </p>
          </div>

          <LoginForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11">
                Google
              </Button>
              <Button variant="outline" className="h-11">
                Facebook
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:opacity-80"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
