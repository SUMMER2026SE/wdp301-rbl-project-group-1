"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Textarea } from "@/src/shared/components/ui/textarea";
import CheckboxField from "@/src/shared/components/atoms/checkbox-field/checkbox-field";
import {
  useGetAllGradesQuery,
  useGetAllSubjectsQuery,
} from "@/src/features/academic-catalog/academicCatalogApi";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { TutorRegistrationData } from "../schemas/tutorRegistrationSchemas";
import { AvatarUpload } from "@/src/shared/components/molecules/avatar-upload/avatar-upload";

interface TutorBasicInfoFormProps {
  onNext: () => void;
}

export function TutorBasicInfoForm({ onNext }: TutorBasicInfoFormProps) {
  const {
    register,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<TutorRegistrationData>();

  const bioValue = watch("bio") || "";
  const [charCount, setCharCount] = useState(bioValue.length);

  const { data: subjectsData, isLoading: subjectsLoading } =
    useGetAllSubjectsQuery();
  const { data: gradesData, isLoading: gradesLoading } = useGetAllGradesQuery();

  const subjectOptions =
    subjectsData?.data.map((s) => ({ value: s.id, label: s.name })) ?? [];
  const gradeOptions =
    gradesData?.data
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((g) => ({ value: g.id, label: g.name })) ?? [];

  const selectedSubjectIds = watch("subjectIds") ?? [];
  const selectedGradeIds = watch("gradeIds") ?? [];

  const handleNext = async () => {
    const isValid = await trigger([
      "fullName",
      "phone",
      "bio",
      "subjectIds",
      "gradeIds",
      "hourlyRate",
    ]);
    if (isValid) {
      onNext();
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setCharCount(value.length);
      setValue("bio", value, { shouldValidate: true });
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 sm:p-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Thông tin cơ bản
      </h2>
      <p className="text-muted-foreground mb-8">
        Hãy cho chúng tôi biết về bạn. Thông tin này sẽ được hiển thị trên hồ sơ
        công khai của bạn để học sinh có thể tìm hiểu thêm về bạn.
      </p>

      <div className="space-y-8">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Controller
            control={control}
            name="photoFiles"
            render={({ field }) => (
              <AvatarUpload
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground mb-2">
              Ảnh chân dung chuyên nghiệp
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tải lên một bức ảnh rõ nét, chụp chính diện với khuôn mặt của bạn.
              Ảnh chụp chuyên nghiệp sẽ giúp bạn tạo ấn tượng tốt hơn với học
              viên.
            </p>
            <div className="text-xs text-muted-foreground">
              Định dạng hỗ trợ: JPG, PNG, tối đa 5MB.
            </div>
            {errors.photoFiles && (
              <p className="text-xs text-destructive mt-1">
                {(errors.photoFiles as { message?: string }).message}
              </p>
            )}
          </div>
        </div>

        {/* Full name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="fullName"
              className="text-sm font-bold text-foreground mb-2"
            >
              Họ và Tên
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              className="h-12 rounded-xl"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-bold text-foreground mb-2"
            >
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0912 345 678"
              className="h-12 rounded-xl"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label
            htmlFor="bio"
            className="text-sm font-bold text-foreground mb-2"
          >
            Bio giới thiệu (Tiểu sử)
          </Label>
          <Textarea
            id="bio"
            placeholder="Viết một đoạn ngắn giới thiệu về bản thân, kinh nghiệm giảng dạy và phương pháp sư phạm của bạn..."
            className="min-h-[120px] rounded-xl"
            maxLength={500}
            value={bioValue}
            onChange={handleBioChange}
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {charCount}/500 ký tự
          </p>
          {errors.bio && (
            <p className="text-xs text-destructive mt-1">
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Subjects checkboxes */}
        <div>
          <Label className="text-sm font-bold text-foreground mb-3 block">
            Môn học giảng dạy
          </Label>
          {subjectsLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              {subjectOptions.map((opt) => (
                <CheckboxField
                  key={opt.value}
                  id={`subject-${opt.value}`}
                  name={`subject-${opt.value}`}
                  label={opt.label}
                  defaultValue={selectedSubjectIds.includes(opt.value)}
                  onChange={() => {
                    const isChecked = selectedSubjectIds.includes(opt.value);
                    const next = isChecked
                      ? selectedSubjectIds.filter((id) => id !== opt.value)
                      : [...selectedSubjectIds, opt.value];
                    setValue("subjectIds", next, { shouldValidate: true });
                  }}
                />
              ))}
            </div>
          )}
          {errors.subjectIds && (
            <p className="text-xs text-destructive mt-2">
              {(errors.subjectIds as { message?: string }).message ??
                "Vui lòng chọn ít nhất 1 môn học"}
            </p>
          )}
        </div>

        {/* Grades checkboxes */}
        <div>
          <Label className="text-sm font-bold text-foreground mb-3 block">
            Cấp lớp giảng dạy
          </Label>
          {gradesLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              {gradeOptions.map((opt) => (
                <CheckboxField
                  key={opt.value}
                  id={`grade-${opt.value}`}
                  name={`grade-${opt.value}`}
                  label={opt.label}
                  defaultValue={selectedGradeIds.includes(opt.value)}
                  onChange={() => {
                    const isChecked = selectedGradeIds.includes(opt.value);
                    const next = isChecked
                      ? selectedGradeIds.filter((id) => id !== opt.value)
                      : [...selectedGradeIds, opt.value];
                    setValue("gradeIds", next, { shouldValidate: true });
                  }}
                />
              ))}
            </div>
          )}
          {errors.gradeIds && (
            <p className="text-xs text-destructive mt-2">
              {(errors.gradeIds as { message?: string }).message ??
                "Vui lòng chọn ít nhất 1 cấp lớp"}
            </p>
          )}
        </div>

        {/* Hourly rate */}
        <div>
          <Label
            htmlFor="hourlyRate"
            className="text-sm font-bold text-foreground mb-2"
          >
            Học phí mong muốn (VNĐ/giờ)
          </Label>
          <div className="relative border rounded-xl focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <Input
              id="hourlyRate"
              type="number"
              placeholder="200000"
              className="h-12 border-0 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
              {...register("hourlyRate", { valueAsNumber: true })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium bg-transparent pointer-events-none">
              VNĐ
            </span>
          </div>
          {errors.hourlyRate && (
            <p className="text-xs text-destructive mt-1">
              {errors.hourlyRate.message}
            </p>
          )}
        </div>

        {/* Next button */}
        <div className="pt-6 border-t border-border flex justify-end">
          <Button
            type="button"
            onClick={handleNext}
            size="lg"
            className="rounded-xl shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
          >
            Tiếp theo
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
