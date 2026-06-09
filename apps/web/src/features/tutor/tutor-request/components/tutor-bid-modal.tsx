"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";

import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import { Textarea } from "@/src/shared/components/ui/textarea";
import FormField from "@/src/shared/components/molecules/form-field/form-field";
import { FormFieldWrapper } from "@/src/shared/components/molecules/form-field/form-field-wrapper";

import { useSetTutorBidMutation } from "@/src/features/tutor-request/tutorRequestApi";

const bidSchema = z.object({
  proposedPrice: z.coerce
    .number()
    .min(10000, "Mức giá tối thiểu là 10,000 VND"),
  message: z.string().min(10, "Lời nhắn tối thiểu 10 ký tự").max(500, "Lời nhắn tối đa 500 ký tự"),
});

type BidFormData = z.infer<typeof bidSchema>;

interface TutorBidModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string | null;
}

export function TutorBidModal({ isOpen, onOpenChange, requestId }: TutorBidModalProps) {
  const [setTutorBid, { isLoading }] = useSetTutorBidMutation();

  const form = useForm<BidFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(bidSchema) as any,
    defaultValues: {
      proposedPrice: 0,
      message: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ proposedPrice: 0, message: "" });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: BidFormData) => {
    if (!requestId) return;

    try {
      await setTutorBid({
        id: requestId,
        setTutorBidDto: {
          proposedPrice: data.proposedPrice,
          message: data.message,
        },
      }).unwrap();

      toast.success("Đã gửi báo giá thành công!");
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Có lỗi xảy ra khi gửi báo giá");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Báo giá & Lời nhắn</DialogTitle>
          <DialogDescription>
            Gửi mức giá đề xuất và lời nhắn của bạn đến học viên để họ cân nhắc.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              name="proposedPrice"
              render={({ field }) => (
                <TextBox
                  id="proposedPrice"
                  label="Mức giá đề xuất (VND / buổi)"
                  placeholder="VD: 250000"
                  type="number"
                  {...field}
                  error={form.formState.errors.proposedPrice?.message}
                />
              )}
            />

            <FormField
              name="message"
              render={({ field }) => (
                <FormFieldWrapper
                  label="Lời nhắn cho học viên"
                  error={form.formState.errors.message?.message}
                >
                  <Textarea
                    placeholder="Giới thiệu ngắn về kinh nghiệm và phương pháp dạy của bạn..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormFieldWrapper>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Gửi báo giá
              </button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
