"use client";

import { ProfileNavigation } from "@/src/features/student/profile/components/profile-navigation";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateStudentProfileMutation,
} from "@/src/features/user/userApi";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { useAppSelector } from "@/src/shared/store/hooks";
import { BookOpen, Flag, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PROFILE_TABS, type ProfileTabId } from "../constants";

type ProfileFormValues = {
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  parentEmail: string;
  sendToParent: boolean;
  school: string;
  grade: string;
  goal: string;
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
  const [updateStudentProfile, { isLoading: isUpdatingStudent }] =
    useUpdateStudentProfileMutation();

  const isSubmitting = isUpdatingProfile || isUpdatingStudent;

  const userProfile = data?.data?.profile;
  const studentInfo = data?.data?.student;

  const buildDefaultValues = () => ({
    email: data?.data?.email ?? "",
    phone: userProfile?.phone ?? "",
    address: userProfile?.address ?? "",
    parentName: "",
    parentRelationship: "father",
    parentPhone: "",
    parentEmail: "",
    sendToParent: false,
    school: studentInfo?.school ?? "",
    grade: "12",
    goal: studentInfo?.learningGoal ?? "",
  });

  const methods = useForm<ProfileFormValues>({
    defaultValues: buildDefaultValues(),
    mode: "onTouched",
  });

  const { handleSubmit, control, reset } = methods;

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
            email: values.email || undefined,
            phone: values.phone || undefined,
            address: values.address || undefined,
          },
        }).unwrap(),
        updateStudentProfile({
          updateStudentProfileDto: {
            school: values.school || null,
            learningGoal: values.goal || null,
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
                  <Label
                    htmlFor="full-name"
                    className="text-foreground font-medium"
                  >
                    Họ và tên
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="full-name"
                      name="full-name"
                      type="text"
                      value={userProfile?.nickname ?? ""}
                      readOnly
                      className="bg-muted text-muted-foreground border-border"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tên được sử dụng để hiển thị trên hệ thống. Liên hệ hỗ trợ
                    nếu cần đổi tên.
                  </p>
                </div>

                <div>
                  <TextBox
                    id="email"
                    label="Địa chỉ Email"
                    name="email"
                    type="email"
                    placeholder="ví dụ: nva@example.com"
                    icon={<Mail className="w-5 h-5" />}
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
                    Thông tin phụ huynh
                  </h4>
                </div>

                <div>
                  <TextBox
                    id="parent-name"
                    label="Họ và tên phụ huynh"
                    name="parentName"
                    type="text"
                    placeholder="Họ và tên phụ huynh"
                    icon={<User className="w-5 h-5" />}
                  />
                </div>

                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="parent-relationship" className="font-bold">
                    Mối quan hệ
                  </Label>
                  <Controller
                    name="parentRelationship"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Chọn mối quan hệ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">Cha</SelectItem>
                          <SelectItem value="mother">Mẹ</SelectItem>
                          <SelectItem value="guardian">
                            Người giám hộ
                          </SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <TextBox
                    id="parent-phone"
                    label="Số điện thoại phụ huynh"
                    name="parentPhone"
                    type="tel"
                    placeholder="Số điện thoại phụ huynh"
                    icon={<Phone className="w-5 h-5" />}
                  />
                </div>

                <div>
                  <TextBox
                    id="parent-email"
                    label="Email phụ huynh"
                    name="parentEmail"
                    type="email"
                    placeholder="Email phụ huynh"
                    icon={<Mail className="w-5 h-5" />}
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start gap-3">
                    <Controller
                      name="sendToParent"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="send-to-parent"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                          className="mt-1 border-border"
                        />
                      )}
                    />
                    <div>
                      <Label
                        htmlFor="send-to-parent"
                        className="text-sm text-foreground font-medium cursor-pointer"
                      >
                        Gửi báo cáo tiến độ cho phụ huynh
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Phụ huynh sẽ nhận thông báo về tiến độ học tập và kết
                        quả bài kiểm tra của em
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h4 className="text-base font-medium text-foreground mb-4">
                    Thông tin học tập
                  </h4>
                </div>

                <div>
                  <TextBox
                    id="school"
                    label="Trường đang theo học"
                    name="school"
                    type="text"
                    placeholder="Tên trường học"
                    icon={<BookOpen className="w-5 h-5" />}
                  />
                </div>

                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="grade" className="font-bold">
                    Lớp
                  </Label>
                  <Controller
                    name="grade"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Chọn lớp" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">Lớp 6</SelectItem>
                          <SelectItem value="7">Lớp 7</SelectItem>
                          <SelectItem value="8">Lớp 8</SelectItem>
                          <SelectItem value="9">Lớp 9</SelectItem>
                          <SelectItem value="10">Lớp 10</SelectItem>
                          <SelectItem value="11">Lớp 11</SelectItem>
                          <SelectItem value="12">Lớp 12</SelectItem>
                          <SelectItem value="college">Cao đẳng</SelectItem>
                          <SelectItem value="university">Đại học</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="sm:col-span-2">
                  <TextBox
                    id="goal"
                    label="Mục tiêu học tập"
                    name="goal"
                    type="text"
                    placeholder="Ví dụ: Thi đại học khối A, Cải thiện điểm Toán..."
                    icon={<Flag className="w-5 h-5" />}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Giúp gia sư hiểu rõ định hướng và chuẩn bị bài giảng phù hợp
                    nhất cho bạn.
                  </p>
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

          {/* Lịch sử học tập Tab */}
          {activeTab === "history" && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Lịch sử học tập sẽ được cập nhật sớm...
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
