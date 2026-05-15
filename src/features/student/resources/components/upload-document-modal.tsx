"use client";

import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { CATEGORIES } from "../mock-data";
import {
  uploadDocumentSchema,
  type UploadDocumentFormValues,
} from "../schemas/upload-schemas";

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload?: (data: UploadDocumentFormValues) => void;
}

export function UploadDocumentModal({
  open,
  onOpenChange,
  onUpload,
}: UploadDocumentModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UploadDocumentFormValues>({
    resolver: zodResolver(uploadDocumentSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      category: "",
    } as UploadDocumentFormValues,
  });

  const onSubmit = useCallback(
    (data: UploadDocumentFormValues) => {
      onUpload?.(data);
      reset();
      onOpenChange(false);
    },
    [onUpload, reset, onOpenChange],
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        reset();
      }
      onOpenChange(newOpen);
    },
    [reset, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tải lên tài liệu</DialogTitle>
          <DialogDescription>
            Chia sẻ tài liệu của bạn với cộng đồng học tập
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Tệp tài liệu
            </label>
            <Controller
              name="file"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.mp4"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        onChange(selectedFile);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:border-primary hover:bg-muted"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="size-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-semibold text-foreground">
                          Chọn tệp hoặc kéo thả
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, Word, Video (Tối đa 50MB)
                        </p>
                      </div>
                    </div>
                  </label>
                  {value && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-success/10 p-3">
                      <span className="text-sm font-medium text-success">
                        ✓ {(value as File).name}
                      </span>
                      <button
                        type="button"
                        onClick={() => onChange(undefined)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                  {errors.file && (
                    <p className="mt-2 text-xs text-error">
                      {errors.file.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Tiêu đề <span className="text-error">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    placeholder="Nhập tiêu đề tài liệu..."
                    disabled={isSubmitting}
                    {...field}
                  />
                  {errors.title && (
                    <p className="text-xs text-error">{errors.title.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Danh mục <span className="text-error">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger disabled={isSubmitting}>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          disabled={isSubmitting}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-error">
                      {errors.category.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Mô tả
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <>
                  <Textarea
                    placeholder="Nhập mô tả tài liệu (tùy chọn)..."
                    disabled={isSubmitting}
                    rows={4}
                    {...field}
                  />
                  {errors.description && (
                    <p className="text-xs text-error">
                      {errors.description.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tải lên..." : "Tải lên tài liệu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
