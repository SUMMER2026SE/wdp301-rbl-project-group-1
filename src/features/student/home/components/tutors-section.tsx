"use client";

import { TutorCard } from "@/src/features/student/tutors/components";
import { useGetTutorsQuery } from "@/src/features/student/tutors/tutorApi";
import { mapTutorResponseToTutor } from "@/src/features/student/tutors/utils/map-tutor";
import { Button } from "@/src/shared/components/ui/button";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import Link from "next/link";
import { useMemo } from "react";

const ITEMS_PER_PAGE = 3;

export const TutorsSection = () => {
  const { data, isLoading, isError, refetch } = useGetTutorsQuery();

  const tutors = useMemo(() => {
    const mapped = (data?.data ?? []).map(mapTutorResponseToTutor);
    return mapped.sort((a, b) => b.rating - a.rating).slice(0, ITEMS_PER_PAGE);
  }, [data]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          Gia sư nổi bật
        </h2>
        <Button variant="link" asChild className="text-info font-bold p-0">
          <Link href="/student/tutors">Xem tất cả</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Không thể tải danh sách gia sư. Vui lòng thử lại.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      ) : tutors.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Chưa có gia sư phù hợp.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </section>
  );
};
