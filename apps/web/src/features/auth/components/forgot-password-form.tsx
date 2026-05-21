'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForgotPasswordMutation } from '@/src/features/auth/authApi';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormData,
} from '@/src/features/auth/schemas/authSchemas';
import SubmitButton from '@/src/shared/components/atoms/submit-button/submit-button';
import TextBox from '@/src/shared/components/atoms/text-box/text-box';
import InputForm from '@/src/shared/components/organisms/input-form/input-form';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ forgotPasswordDto: { email: data.email } }).unwrap();
      toast.success('Mã OTP đã được gửi đến email của bạn.');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch {
      toast.error('Gửi mã thất bại. Vui lòng kiểm tra email và thử lại.');
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-background">
      {/* Left Panel: Decorative */}
      <section className="relative hidden w-1/2 overflow-hidden bg-primary lg:flex lg:items-center lg:justify-center">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnjqoKWgEPGcMavXWoxWYBZSBj5DOFIZwPOhcVO3PKyCyI_DQ69JZUneElzzkEYVacKk06EglzeecHm3P2OaXG9nAzNE1JpkAXn5Uio8XhdOh36IGaU5OSlUgpDNus5Kp4_a0wl4MPrHLvKpnX0_rDDxNw-YgTV3T0_rOS13HAahijBwaHZg4X38Ann0-UBsabazDJjACXL3_Jxmnzjj815xYhxK47Vw3FGqZHNM0yGmrwU4myeyNIorvqUAc9MNO4-E_y1HvlaWo"
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
            Khôi phục tài khoản của bạn.
          </h1>
          <p className="text-lg leading-relaxed text-primary-foreground/85">
            Nhập email đã đăng ký để nhận mã xác thực và đặt lại mật khẩu một
            cách an toàn.
          </p>
        </div>
      </section>

      {/* Right Panel: Forgot Password Form */}
      <section className="flex w-full items-center justify-center bg-background p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Back link */}
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Quay lại đăng nhập
          </Link>

          {/* Header */}
          <div>
            <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
              <Mail className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Quên mật khẩu
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã OTP để xác
              thực.
            </p>
          </div>

          {/* Form */}
          <InputForm<ForgotPasswordFormData>
            resolver={zodResolver(forgotPasswordFormSchema)}
            defaultValues={{ email: '' }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <TextBox
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="name@example.com"
              inputClassName="h-11"
            />

            <SubmitButton isLoading={isLoading}>
              Gửi mã xác thực
            </SubmitButton>
          </InputForm>
        </div>
      </section>
    </main>
  );
}
