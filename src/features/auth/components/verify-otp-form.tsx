'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MailCheck } from 'lucide-react';

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

type OtpFormValues = {
  otp: string;
};

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = useCallback(() => {
    if (countdown > 0) return;
    setCountdown(RESEND_COOLDOWN);
    // TODO: call resend API
  }, [countdown]);

  const handleSubmit = useCallback(
    async (_data: OtpFormValues) => {
      if (otp.length !== 6) return;
      setIsSubmitting(true);
      try {
        // TODO: call verify OTP API
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setIsSubmitting(false);
      }
    },
    [otp],
  );

  const formattedCountdown = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`;

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
            Bảo mật tài khoản của bạn.
          </h1>
          <p className="text-lg leading-relaxed text-primary-foreground/85">
            Xác minh danh tính bằng mã OTP để đảm bảo an toàn cho tài khoản của
            bạn trên nền tảng học tập.
          </p>
        </div>
      </section>

      {/* Right Panel: OTP Form */}
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
              <MailCheck className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Xác minh mã OTP
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến email của bạn.
            </p>
          </div>

          {/* OTP Form */}
          <InputForm<OtpFormValues>
            defaultValues={{ otp: '' }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
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

            <div className="flex flex-col gap-4">
              <SubmitButton>Xác nhận</SubmitButton>

              <p className="text-center text-sm text-muted-foreground">
                Chưa nhận được mã?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResend}
                  disabled={countdown > 0}
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
