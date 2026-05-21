"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateTutorProfileMutation,
} from "@/src/features/user/userApi";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { useModalContext } from "@/src/shared/context/modal-context";
import { WithModal } from "@/src/shared/hocs/with-modal";

import {
  editProfileSchema,
  type EditProfileFormValues,
} from "../schemas/edit-profile-schema";

const FORM_ID = "edit-tutor-profile-form";

function EditProfileFormFields() {
  const { control } = useFormContext<EditProfileFormValues>();

  return (
    <div className="flex flex-col gap-5 px-6 py-4 overflow-y-auto">
      <TextBox
        id="specialization"
        name="specialization"
        label="Chuyên môn"
        type="text"
        placeholder="Ví dụ: Toán, Tiếng Anh, Vật Lý..."
      />

      <TextBox
        id="address"
        name="address"
        label="Địa chỉ"
        type="text"
        placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
      />

      <div className="space-y-2">
        <Label htmlFor="experience" className="text-sm font-bold">
          Kinh nghiệm dạy học (năm)
        </Label>
        <Controller
          control={control}
          name="experience"
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <Input
                id="experience"
                type="number"
                min="0"
                placeholder="Số năm kinh nghiệm"
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  field.onChange(isNaN(val) ? null : val);
                }}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-bold">
          Giới thiệu bản thân
        </Label>
        <Controller
          control={control}
          name="bio"
          render={({ field }) => (
            <Textarea
              id="bio"
              placeholder="Mô tả về bản thân, phương pháp dạy học..."
              {...field}
              value={field.value ?? ""}
              className="resize-none h-28"
            />
          )}
        />
      </div>
    </div>
  );
}

function EditProfileModalContent() {
  const modal = useModalContext()!;
  const { data, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateTutorProfile, { isLoading: isUpdatingTutor }] =
    useUpdateTutorProfileMutation();

  const isSubmitting = isUpdatingProfile || isUpdatingTutor;

  const userProfile = data?.data?.profile;
  const tutorInfo = data?.data?.tutor;

  const handleSubmit = async (values: EditProfileFormValues) => {
    try {
      await Promise.all([
        updateProfile({
          updateProfileDto: {
            address: values.address ?? undefined,
          },
        }).unwrap(),
        updateTutorProfile({
          updateTutorProfileDto: {
            specialization: values.specialization,
            experience: values.experience,
            bio: values.bio,
          },
        }).unwrap(),
      ]);

      toast.success("Cập nhật hồ sơ thành công!");
      await refetch();
      modal.closeModal();
    } catch {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      modal.openModal();
    } else {
      modal.closeModal();
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 py-6 text-base font-bold"
        >
          <Pencil className="size-5 mr-2" />
          Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-bold">
            Chỉnh sửa hồ sơ
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-6 pt-4 shrink-0">
          <div className="space-y-2">
            <Label className="text-sm font-bold">Họ và tên</Label>
            <Input
              value={userProfile?.nickname ?? ""}
              readOnly
              className="bg-muted/50 cursor-not-allowed text-muted-foreground"
            />
          </div>
        </div>

        <InputForm<EditProfileFormValues>
          id={FORM_ID}
          resolver={zodResolver(editProfileSchema)}
          defaultValues={{
            specialization: tutorInfo?.specialization ?? "",
            address: userProfile?.address ?? "",
            experience: tutorInfo?.experience ?? null,
            bio: tutorInfo?.bio ?? "",
          }}
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <EditProfileFormFields />
        </InputForm>

        <DialogFooter className="border-t border-border px-6 py-7 bg-muted/30 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => modal.closeModal()}
          >
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const EditProfileModal = WithModal(EditProfileModalContent);
