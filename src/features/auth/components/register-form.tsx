"use client";

import Header from "@/src/features/landing/components/header";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerFormSchema,
  type RegisterFormData,
} from "@/src/features/auth/schemas/authSchemas";
import CheckboxField from "@/src/shared/components/atoms/checkbox-field/checkbox-field";
import SubmitButton from "@/src/shared/components/atoms/submit-button/submit-button";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import { Input } from "@/src/shared/components/ui/input";
import { GradeCheckbox } from "@/src/features/academic-catalog/components/grade-checkbox";
import { SubjectCheckbox } from "@/src/features/academic-catalog/components/subject-checkbox";
import FormField from "@/src/shared/components/molecules/form-field/form-field";
import { FormFieldWrapper } from "@/src/shared/components/molecules/form-field/form-field-wrapper";
import { useRegisterForm } from "../hooks/use-register-form";
import { DEFAULT_REGISTER_FORM_VALUES } from "../constants/constants";

export default function RegisterForm() {
  const { handleSubmit, isSubmitting } = useRegisterForm();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl rounded-2xl border bg-card text-card-foreground p-8 shadow-xl sm:p-12">
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-black">
              Đăng ký tài khoản học sinh
            </h1>
            <p className="text-muted-foreground">
              Tham gia cộng đồng học tập hàng đầu ngay hôm nay
            </p>
          </div>

          <InputForm<RegisterFormData>
            id="register-form"
            className="w-full"
            resolver={zodResolver(registerFormSchema)}
            defaultValues={DEFAULT_REGISTER_FORM_VALUES}
            onSubmit={handleSubmit}
          >
            <div className="space-y-8">
              {/* ── Thông tin cá nhân ── */}
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                  Thông tin cá nhân
                </p>

                <TextBox
                  id="fullname"
                  name="fullname"
                  label="Họ và tên học sinh"
                  placeholder="Nguyễn Văn A"
                  inputClassName="h-11"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextBox
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="ban@example.com"
                    inputClassName="h-11"
                  />
                  <TextBox
                    id="phone"
                    name="phone"
                    label="Số điện thoại"
                    type="tel"
                    placeholder="0912345678"
                    inputClassName="h-11"
                  />
                </div>

                <FormField<RegisterFormData, "dateOfBirth">
                  name="dateOfBirth"
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper
                      label={
                        <>
                          Ngày sinh <span className="text-destructive">*</span>
                        </>
                      }
                      error={fieldState.error?.message}
                    >
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="h-11"
                        {...field}
                      />
                    </FormFieldWrapper>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextBox
                    id="password"
                    name="password"
                    label="Mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    inputClassName="h-11"
                  />
                  <TextBox
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    inputClassName="h-11"
                  />
                </div>
              </div>

              {/* ── Thông tin học tập ── */}
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                  Thông tin học tập
                </p>

                <FormField<RegisterFormData, "subjectIds">
                  name="subjectIds"
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper
                      label={
                        <>
                          Môn học muốn học{" "}
                          <span className="text-destructive">*</span>
                        </>
                      }
                    >
                      <SubjectCheckbox
                        selectedIds={field.value ?? []}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormFieldWrapper>
                  )}
                />

                <FormField<RegisterFormData, "gradeIds">
                  name="gradeIds"
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper
                      label={
                        <>
                          Cấp lớp học{" "}
                          <span className="text-destructive">*</span>
                        </>
                      }
                    >
                      <GradeCheckbox
                        selectedIds={field.value ?? []}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormFieldWrapper>
                  )}
                />

                <TextBox
                  id="school"
                  name="school"
                  label="Trường học (tùy chọn)"
                  placeholder="THPT Chu Văn An"
                  inputClassName="h-11"
                />

                <TextBox
                  id="learningGoal"
                  name="learningGoal"
                  label="Mục tiêu học tập (tùy chọn)"
                  placeholder="Vượt qua kỳ thi đại học..."
                  inputClassName="h-11"
                />
              </div>

              {/* ── Terms ── */}
              <div className="space-y-2 mt-2">
                <CheckboxField id="termsAccepted" name="termsAccepted">
                  <span className="ml-2 inline-block">
                    Tôi đồng ý với{" "}
                    <Link
                      href="#"
                      className="font-semibold text-primary hover:underline"
                    >
                      Điều khoản
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="#"
                      className="font-semibold text-primary hover:underline"
                    >
                      Chính sách
                    </Link>
                  </span>
                </CheckboxField>
              </div>

              <div className="mt-4">
                <SubmitButton isLoading={isSubmitting}>
                  Tạo tài khoản
                </SubmitButton>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:text-primary"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </InputForm>
        </div>
      </main>
    </div>
  );
}
