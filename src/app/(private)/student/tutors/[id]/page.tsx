"use client";

import {
  TutorAvailabilityCard,
  TutorBio,
  TutorCertifications,
  TutorCTACard,
  TutorExperience,
  TutorInfoHeader,
  TutorReviews,
} from "@/src/features/student/tutor-detail/components";
import { useGetTutorsQuery } from "@/src/features/student/tutors/tutorApi";
import { mapTutorResponseToTutor } from "@/src/features/student/tutors/utils/map-tutor";
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { Button } from "@/src/shared/components/ui/button";
import { Spinner } from "@/src/shared/components/ui/spinner";
import Link from "next/link";
import { useMemo } from "react";

export default function TutorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isFetching, isError, refetch } = useGetTutorsQuery({
    page: "1",
    limit: "100",
  });

  const tutor = useMemo(() => {
    const mappedTutors = (data?.data ?? []).map(mapTutorResponseToTutor);
    return mappedTutors.find((item) => item.id === params.id);
  }, [data, params.id]);

  if (isFetching) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
        <div className="flex items-center justify-center py-20">
          <Spinner className="size-8" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Không thể tải thông tin gia sư. Vui lòng thử lại.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              Thử lại
            </Button>
            <Link href="/student/tutors">
              <Button>Quay lại danh sách</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Không tìm thấy thông tin gia sư
          </p>
          <Link href="/student/tutors">
            <Button className="mt-4">Quay lại danh sách</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <BreadcrumbNav
            items={[
              { label: "Trang chủ", href: "/student/home" },
              { label: "Tìm gia sư", href: "/student/tutors" },
              { label: tutor.name },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 lg:w-[70%] flex flex-col gap-8">
            {/* Tutor info header */}
            <TutorInfoHeader tutor={tutor} />

            {/* Bio section */}
            {tutor.bio && <TutorBio bio={tutor.bio} />}

            {/* Certifications section */}
            {tutor.certifications && tutor.certifications.length > 0 && (
              <TutorCertifications certifications={tutor.certifications} />
            )}

            {/* Teaching experience section */}
            {tutor.teachingExperience &&
              tutor.teachingExperience.length > 0 && (
                <TutorExperience experiences={tutor.teachingExperience} />
              )}

            {/* Reviews section */}
            {tutor.reviews && tutor.reviews.length > 0 && (
              <TutorReviews
                reviews={tutor.reviews}
                rating={tutor.rating}
                reviewCount={tutor.reviewCount}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="flex-1 lg:w-[30%] flex flex-col gap-8">
            {/* CTA Card */}
            <TutorCTACard price={tutor.pricePerHour} />

            {/* Availability */}
            {tutor.availability && (
              <TutorAvailabilityCard availability={tutor.availability} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
