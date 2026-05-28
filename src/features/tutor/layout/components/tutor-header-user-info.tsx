"use client";

import { useGetProfileQuery } from "@/src/features/user/userApi";
import { useAppSelector } from "@/src/shared/store/hooks";

export function TutorHeaderUserInfo() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  const userProfile = data?.data?.profile;
  const tutorInfo = data?.data?.tutor;
  const displayName = userProfile?.nickname || "Gia sư";
  const specialization = tutorInfo?.specialization;

  return (
    <div className="hidden text-right sm:block">
      <p className="text-sm font-bold text-foreground">
        {displayName}
      </p>
      <p className="text-xs text-muted-foreground">
        {specialization ? `Gia sư ${specialization}` : "Gia sư"}
      </p>
    </div>
  );
}
