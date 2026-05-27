'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';

import {
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useSendVerifyEmailOtpMutation,
} from '@/src/features/auth/authApi';
import {
  verifyOtpFormSchema,
  type VerifyOtpFormData,
} from '@/src/features/auth/schemas/authSchemas';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/src/shared/components/ui/input-otp';
import { Button } from '@/src/shared/components/ui/button';
import SubmitButton from '@/src/shared/components/atoms/submit-button/submit-button';
import InputForm from '@/src/shared/components/organisms/input-form/input-form';

const RESEND_COOLDOWN = 60;

type OtpMode = 'reset-password' | 'verify-email';

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const type = (searchParams.get('type') as OtpMode) ?? 'reset-password';

  const isVerifyEmail = type === 'verify-email';

  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResendingForgot }] = useForgotPasswordMutation();
  const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation();
  const [sendVerifyEmailOtp, { isLoading: isResendingVerify }] = useSendVerifyEmailOtpMutation();

  const isVerifying = isVerifyEmail ? isVerifyingEmail : isVerifyingOtp;
  const isResending = isVerifyEmail ? isResendingVerify : isResendingForgot;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (countdown > 0 || !email || isResending) return;

    try {
      if (isVerifyEmail) {
        await sendVerifyEmailOtp({ sendVerifyEmailOtpDto: { email } }).unwrap();
      } else {
        await forgotPassword({ forgotPasswordDto: { email } }).unwrap();
      }
      setCountdown(RESEND_COOLDOWN);
      toast.success('Mã OTP mới đã được gửi đến email của bạn.');
    } catch {
      toast.error('Gửi lại mã thất bại. Vui lòng thử lại.');
    }
  }, [countdown, email, isResending, isVerifyEmail, forgotPassword, sendVerifyEmailOtp]);

  const handleSubmit = useCallback(
    async (data: VerifyOtpFormData) => {
      if (!email) return;

      try {
        if (isVerifyEmail) {
          await verifyEmail({
            verifyEmailDto: { email, code: data.otp },
          }).unwrap();

          toast.success('Xác thực email thành công! Bạn có thể đăng nhập ngay.');
          router.push('/login');
        } else {
          const response = await verifyOtp({
            verifyOtpDto: { email, code: data.otp },
          }).unwrap();

          toast.success('Xác thực OTP thành công!');
          router.push(
            `/reset-password?token=${encodeURIComponent(response.data.resetToken)}`,
          );
        }
      } catch {
        toast.error('Mã OTP không hợp lệ hoặc đã hết hạn.');
      }
    },
    [email, isVerifyEmail, verifyOtp, verifyEmail, router],
  );

  const content = useMemo(() => ({
    backHref: isVerifyEmail ? '/register' : '/login',
    backLabel: isVerifyEmail ? 'Quay lại đăng ký' : 'Quay lại đăng nhập',
    icon: isVerifyEmail ? ShieldCheck : MailCheck,
    title: isVerifyEmail ? 'Xác thực email' : 'Xác minh mã OTP',
    description: isVerifyEmail
      ? 'Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến'
      : 'Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến',
    heroTitle: isVerifyEmail
      ? 'Xác thực email của bạn.'
      : 'Bảo mật tài khoản của bạn.',
    heroDescription: isVerifyEmail
      ? 'Hoàn tất xác thực email để bắt đầu sử dụng nền tảng học tập của chúng tôi.'
      : 'Xác minh danh tính bằng mã OTP để đảm bảo an toàn cho tài khoản của bạn trên nền tảng học tập.',
    submitLabel: isVerifyEmail ? 'Xác thực email' : 'Xác nhận',
  }), [isVerifyEmail]);

  const formattedCountdown = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`;

  if (!email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Không tìm thấy email để xác thực.</p>
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Quay lại đăng ký
          </Link>
        </div>
      </main>
    );
  }

  const IconComponent = content.icon;

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
            {content.heroTitle}
          </h1>
          <p className="text-lg leading-relaxed text-primary-foreground/85">
            {content.heroDescription}
          </p>
        </div>
      </section>

      {/* Right Panel: OTP Form */}
      <section className="flex w-full items-center justify-center bg-background p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Back link */}
          <Link
            href={content.backHref}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            {content.backLabel}
          </Link>

          {/* Header */}
          <div>
            <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
              <IconComponent className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {content.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.description}{' '}
              <span className="font-semibold text-foreground">{email}</span>.
            </p>
          </div>

          {/* OTP Form */}
          <InputForm<VerifyOtpFormData>
            resolver={zodResolver(verifyOtpFormSchema)}
            defaultValues={{ otp: '' }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <Controller<VerifyOtpFormData, 'otp'>
              name="otp"
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  containerClassName="justify-center gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="size-12 text-lg" />
                    <InputOTPSlot index={1} className="size-12 text-lg" />
                    <InputOTPSlot index={2} className="size-12 text-lg" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="size-12 text-lg" />
                    <InputOTPSlot index={4} className="size-12 text-lg" />
                    <InputOTPSlot index={5} className="size-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            <div className="flex flex-col gap-4">
              <SubmitButton isLoading={isVerifying}>{content.submitLabel}</SubmitButton>

              <p className="text-center text-sm text-muted-foreground">
                Chưa nhận được mã?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResend}
                  disabled={countdown > 0 || isResending}
                  className="font-semibold text-primary transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {countdown > 0
                    ? `Gửi lại mã (${formattedCountdown})`
                    : 'Gửi lại mã'}
                </Button>
              </p>
            </div>
          </InputForm>
        </div>
      </section>
    </main>
  );
}
