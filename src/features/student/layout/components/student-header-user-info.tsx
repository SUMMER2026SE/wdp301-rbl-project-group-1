"use client";

import { useGetProfileQuery } from "@/src/features/user/userApi";
import { useAppSelector } from "@/src/shared/store/hooks";

export function StudentHeaderUserInfo() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  const userProfile = data?.data?.profile;
  const studentInfo = data?.data?.student;
  const displayName = userProfile?.nickname || "Học sinh";
  const gradeLabel = studentInfo?.grades?.[0]?.name;

  return (
    <div className="text-right hidden sm:block">
      <p className="text-sm font-bold text-foreground dark:text-foreground">
        {displayName}
      </p>
      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
        {gradeLabel ? `Học sinh ${gradeLabel}` : "Học sinh"}
      </p>
    </div>
  );
}
