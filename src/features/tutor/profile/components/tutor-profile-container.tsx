"use client";

import { useGetProfileQuery } from "@/src/features/user/userApi";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { upgradePlans } from "../mock-data";
import { EditProfileModal } from "./edit-profile-modal";
import { ProfileTabs } from "./profile-tabs";
import { TutorProfileHeader } from "./tutor-profile-header";
import { UpgradePlans } from "./upgrade-plans";

export function TutorProfileContainer() {
  const { data, isLoading } = useGetProfileQuery();

  const profile = data?.data;
  const userProfile = profile?.profile;
  const tutorInfo = profile?.tutor;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-1 rounded-xl" />
          <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TutorProfileHeader
            name={userProfile?.nickname ?? ""}
            subject={tutorInfo?.specialization ?? ""}
            rating={tutorInfo?.rating ?? 0}
            reviewCount={tutorInfo?.reviewCount ?? 0}
            location={userProfile?.address ?? ""}
            workType="Full-time"
            avatar={userProfile?.avatarUrl ?? undefined}
            editButton={<EditProfileModal />}
          />
        </div>

        <div className="lg:col-span-2">
          <ProfileTabs
            bio={tutorInfo?.bio ?? null}
            experience={tutorInfo?.experience ?? null}
            specialization={tutorInfo?.specialization ?? null}
            education={tutorInfo?.education ?? null}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-12">
        <UpgradePlans plans={upgradePlans} />
      </div>
    </div>
  );
}
