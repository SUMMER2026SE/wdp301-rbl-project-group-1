"use client";

import Header from "@/src/features/landing/components/header";
import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import {
  GRADE_LEVELS,
  SUBJECTS,
} from "@/src/features/auth/constants/constants";
import {
  registerFormSchema,
  type RegisterFormData,
} from "@/src/features/auth/schemas/authSchemas";
import CheckboxField from "@/src/shared/components/atoms/checkbox-field/checkbox-field";
import SelectBox from "@/src/shared/components/atoms/select-box/select-box";
import SubmitButton from "@/src/shared/components/atoms/submit-button/submit-button";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { Label } from "@/src/shared/components/ui/label";

const SubjectsSelection = () => {
  const { control } = useFormContext<RegisterFormData>();
  return (
    <Controller
      name="subjects"
      control={control}
      render={({ field }) => (
        <div>
          <Label className="uppercase tracking-wide text-sm font-semibold text-foreground">
            Môn học muốn học
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SUBJECTS.map((subject) => {
              const checked = field.value?.includes(subject);
              return (
                <label
                  key={subject}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const updated = isChecked
                        ? [...(field.value || []), subject]
                        : (field.value || []).filter((s) => s !== subject);
                      field.onChange(updated);
                    }}
                    className="mt-0 size-4 rounded border"
                  />
                  <span className="text-foreground">{subject}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    />
  );
};

export default function RegisterForm() {
  const handleSubmit = async (data: RegisterFormData) => {
    const validatedData = registerFormSchema.safeParse(data);

    if (!validatedData.success) {
      toast.error(
        validatedData.error.issues[0]?.message ??
          "Vui lòng kiểm tra lại thông tin trên form.",
      );
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(error);
    }
  };

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
            defaultValues={{
              fullname: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
              grade: "",
              subjects: [],
              parentName: "",
              parentPhone: "",
              parentEmail: "",
              termsAccepted: undefined,
            }}
            onSubmit={handleSubmit}
          >
            <div className="space-y-8">
              {/* Thông tin cá nhân */}
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                  Thông tin cá nhân
                </p>

                <TextBox
                  id="fullname"
                  name="fullname"
                  label="Họ và tên học sinh"
                  placeholder="Nguyen Van A"
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

              {/* Thông tin học tập */}
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                  Thông tin học tập
                </p>
                <SelectBox
                  id="grade"
                  name="grade"
                  label="Cấp học"
                  options={GRADE_LEVELS}
                  placeholder="Chọn cấp học/lớp"
                  triggerClassName="h-11"
                />
                <SubjectsSelection />
              </div>

              {/* Thông tin phụ huynh */}
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                  Thông tin phụ huynh
                </p>
                <TextBox
                  id="parentName"
                  name="parentName"
                  label="Họ và tên phụ huynh"
                  placeholder="Nguyen Van B"
                  inputClassName="h-11"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextBox
                    id="parentPhone"
                    name="parentPhone"
                    label="Số điện thoại phụ huynh"
                    placeholder="0987654321"
                    inputClassName="h-11"
                  />
                  <TextBox
                    id="parentEmail"
                    name="parentEmail"
                    label="Email phụ huynh (tùy chọn)"
                    type="email"
                    placeholder="phuhuynh@example.com"
                    inputClassName="h-11"
                  />
                </div>
              </div>

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
                <SubmitButton>Tạo tài khoản</SubmitButton>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">
                    Hoặc đăng ký bằng
                  </span>
                </div>
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
