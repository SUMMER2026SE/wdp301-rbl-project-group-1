"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import SelectBox from "@/src/shared/components/atoms/select-box/select-box";
import FormField from "@/src/shared/components/molecules/form-field/form-field";
import { FormFieldWrapper } from "@/src/shared/components/molecules/form-field/form-field-wrapper";
import { FileUpload } from "@/src/shared/components/molecules/file-upload/file-upload";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { useModalContext } from "@/src/shared/context/modal-context";
import {
  resourceClasses,
  resourceFolders,
} from "../types";

const uploadResourceSchema = z.object({
  file: z.any()
    .refine((val) => val instanceof File, "Vui lòng chọn file tải lên")
    .refine((file) => file instanceof File && file.size <= 50 * 1024 * 1024, "File quá lớn! Tối đa 50MB"),
  fileName: z.string().min(1, "Vui lòng nhập tên tài liệu"),
  folder: z.string().min(1, "Vui lòng chọn thư mục"),
  classId: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof uploadResourceSchema>;

export function UploadResourceForm() {
  const modalContext = useModalContext();
  const closeModal = modalContext?.closeModal;

  const handleSubmit = (data: FormValues) => {
    // Handle form submission
    console.log("Upload data:", data);
    closeModal?.();
  };

  return (
    <InputForm<FormValues>
      id="upload-resource-form"
      resolver={zodResolver(uploadResourceSchema)}
      defaultValues={{
        fileName: "",
        folder: "",
        classId: "all",
        description: "",
      }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 overflow-y-auto px-1 py-1"
    >
      {/* Upload Area */}
      <FormField<FormValues, "file">
        name="file"
        render={({ field, fieldState }) => (
          <FormFieldWrapper error={fieldState.error?.message}>
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              accept=".pdf,.doc,.docx,.xlsx,.xls,.mp4,.mov"
              maxSizeMB={50}
              placeholder="Kéo thả tệp vào đây hoặc nhấn để chọn tệp"
              helperText="Hỗ trợ định dạng: PDF, DOCX, XLSX, Video (Max 50MB)"
            />
          </FormFieldWrapper>
        )}
      />

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* File Name */}
        <TextBox
          id="fileName"
          name="fileName"
          label="Tên tài liệu *"
          placeholder="Nhập tên tài liệu..."
        />

        {/* Folder and Class Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectBox
            id="folder"
            name="folder"
            label="Phân loại thư mục *"
            placeholder="Chọn thư mục"
            options={resourceFolders}
          />

          <SelectBox
            id="classId"
            name="classId"
            label="Gán cho Lớp học"
            placeholder="Chọn lớp học"
            options={resourceClasses}
          />
        </div>

        {/* Description */}
        <FormField<FormValues, "description">
          name="description"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Mô tả ngắn gọn (Tùy chọn)"
              error={fieldState.error?.message}
            >
              <Textarea
                {...field}
                placeholder="Thêm mô tả cho tài liệu này..."
                className="w-full resize-none"
                rows={3}
              />
            </FormFieldWrapper>
          )}
        />
      </div>
    </InputForm>
  );
}
