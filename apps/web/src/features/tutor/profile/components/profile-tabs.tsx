"use client";

import { ProfileNavigation } from "@/src/features/tutor/profile/components/profile-navigation";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateTutorProfileMutation,
} from "@/src/features/user/userApi";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { useAppSelector } from "@/src/shared/store/hooks";
import { Briefcase, CircleDollarSign, GraduationCap, MapPin, Phone, Save, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PROFILE_TABS, type ProfileTabId } from "../constants";

type ProfileFormValues = {
  nickname: string;
  phone: string;
  address: string;
  bio: string;
  specialization: string;
  experience: number;
  education: string;
  pricePerHour: number;
};

export function ProfileTabs() {
  const pathname = usePathname();
  const activeTab =
    PROFILE_TABS.find((tab) => pathname.startsWith(tab.activePrefix))?.id ||
    ("info" as ProfileTabId);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data, refetch } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateTutorProfile, { isLoading: isUpdatingTutor }] =
    useUpdateTutorProfileMutation();

  const isSubmitting = isUpdatingProfile || isUpdatingTutor;

  const userProfile = data?.data?.profile;
  const tutorInfo = data?.data?.tutor;

  const buildDefaultValues = () => ({
    nickname: userProfile?.nickname ?? "",
    phone: userProfile?.phone ?? "",
    address: userProfile?.address ?? "",
    bio: tutorInfo?.bio ?? "",
    specialization: tutorInfo?.specialization ?? "",
    experience: tutorInfo?.experience ?? 0,
    education: tutorInfo?.education ?? "",
    pricePerHour: tutorInfo?.pricePerHour ?? 0,
  });

  const methods = useForm<ProfileFormValues>({
    defaultValues: buildDefaultValues(),
    mode: "onTouched",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data) {
      reset(buildDefaultValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await Promise.all([
        updateProfile({
          updateProfileDto: {
            nickname: values.nickname || undefined,
            phone: values.phone || undefined,
            address: values.address || undefined,
          },
        }).unwrap(),
        updateTutorProfile({
          updateTutorProfileDto: {
            bio: values.bio || null,
            specialization: values.specialization || null,
            experience: Number(values.experience) || 0,
            education: values.education || null,
            pricePerHour: Number(values.pricePerHour) || 0,
          },
        }).unwrap(),
      ]);

      toast.success("Đã lưu thay đổi hồ sơ thành công");
      await refetch();
    } catch {
      toast.error("Lưu thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card text-card-foreground border border-border pt-0">
      <ProfileNavigation tabs={PROFILE_TABS} />

      <FormProvider {...methods}>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Thông tin cá nhân Tab */}
          {activeTab === "info" && (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h4 className="text-base font-medium text-foreground mb-4">
                    Thông tin liên hệ
                  </h4>
                </div>

                <div>
                  <TextBox
                    id="nickname"
                    label="Họ và tên"
                    name="nickname"
                    type="text"
                    placeholder="Họ và tên hiển thị"
                    icon={<User className="w-5 h-5" />}
                  />
                </div>

                <div>
                  <TextBox
                    id="phone"
                    label="Số điện thoại"
                    name="phone"
                    type="tel"
                    placeholder="Số điện thoại liên hệ"
                    icon={<Phone className="w-5 h-5" />}
                  />
                </div>

                <div className="sm:col-span-2">
                  <TextBox
                    id="address"
                    label="Địa chỉ"
                    name="address"
                    type="text"
                    placeholder="Địa chỉ thường trú"
                    icon={<MapPin className="w-5 h-5" />}
                  />
                </div>
              </div>

              <hr className="border-border" />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h4 className="text-base font-medium text-foreground mb-4">
                    Thông tin chuyên môn giảng dạy
                  </h4>
                </div>

                <div className="sm:col-span-2">
                  <TextBox
                    id="bio"
                    label="Giới thiệu bản thân (Bio)"
                    name="bio"
                    type="text"
                    placeholder="Giới thiệu ngắn gọn về bản thân"
                  />
                </div>

                <div>
                  <TextBox
                    id="specialization"
                    label="Chuyên môn"
                    name="specialization"
                    type="text"
                    placeholder="Ví dụ: Toán học, Tiếng Anh"
                    icon={<Briefcase className="w-5 h-5" />}
                  />
                </div>

                <div>
                  <TextBox
                    id="education"
                    label="Trình độ học vấn"
                    name="education"
                    type="text"
                    placeholder="Ví dụ: Cử nhân Sư phạm Toán"
                    icon={<GraduationCap className="w-5 h-5" />}
                  />
                </div>

                <div>
                  <TextBox
                    id="experience"
                    label="Số năm kinh nghiệm"
                    name="experience"
                    type="number"
                    placeholder="0"
                    icon={<Briefcase className="w-5 h-5" />}
                  />
                </div>

                <div>
                  <TextBox
                    id="pricePerHour"
                    label="Mức lương mong muốn (VNĐ/giờ)"
                    name="pricePerHour"
                    type="number"
                    placeholder="Ví dụ: 150000"
                    icon={<CircleDollarSign className="w-5 h-5" />}
                  />
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-3 border-t border-border mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-muted"
                  onClick={() => reset(buildDefaultValues())}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm"
                >
                  {isSubmitting ? <Spinner /> : <Save className="w-5 h-5" />}
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          )}

          {/* Lịch sử giảng dạy Tab */}
          {activeTab === "history" && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Lịch sử giảng dạy sẽ được cập nhật sớm...
            </div>
          )}

          {/* Cài đặt tài khoản Tab */}
          {activeTab === "settings" && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Cài đặt tài khoản sẽ được cập nhật sớm...
            </div>
          )}
        </div>
      </FormProvider>
    </Card>
  );
}
