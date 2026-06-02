"use client";

import { useParams } from "next/navigation";
import {
  TutorBio,
  TutorCertifications,
  TutorCTACard,
  TutorExperience,
  TutorInfoHeader,
  TutorReviews,
} from "@/src/features/student/tutor-detail/components";
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { Button } from "@/src/shared/components/ui/button";
import { ScheduleCalendar } from "@/src/features/student/schedule/components";
import Link from "next/link";
import { useGetTutorByIdQuery } from "@/src/features/student/tutors/tutorApi";
import { mapApiToSlots } from "@/src/features/schedule/utils/schedule-mapper";
import { Tutor } from "@/src/features/student/tutors/types";

export default function TutorDetailPage() {
  const params = useParams();
  const tutorId = params?.id as string;

  const { data, isLoading, error } = useGetTutorByIdQuery(
    { id: tutorId },
    { skip: !tutorId }
  );

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Đang tải thông tin...</p>
        </div>
      </main>
    );
  }

  const tutorDto = data?.data;

  if (error || !tutorDto) {
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

  // Map API response to Tutor type
  const tutor: Tutor = {
    id: tutorDto.id,
    name: tutorDto.nickname || "Gia sư",
    avatar: tutorDto.avatarUrl || "https://i.pravatar.cc/150",
    isOnline: false, // Not supported yet
    rating: tutorDto.rating || 0,
    reviewCount: tutorDto.reviewCount || 0,
    specialty: tutorDto.specialization || "Chưa cập nhật",
    experience: tutorDto.experience ? `${tutorDto.experience} năm` : "Chưa cập nhật",
    education: tutorDto.education || "Chưa cập nhật",
    pricePerHour: tutorDto.pricePerHour || 0,
    skills: tutorDto.specialization ? [tutorDto.specialization] : [],
    bio: tutorDto.bio || "",
    // Note: teachingExperience, certifications, and reviews are not yet provided by the API
    teachingExperience: [],
    certifications: [],
    reviews: [],
  };

  const initialAvailableSlots = mapApiToSlots(tutorDto.availability || []);

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
            
            {/* Fixed Schedule Section */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Lịch rảnh cố định</h3>
                <p className="text-sm text-muted-foreground mt-1">Lịch có thể nhận lớp mới của gia sư hàng tuần.</p>
              </div>
              <ScheduleCalendar
                mode="fixed"
                readonly={true}
                classes={[]}
                selectedFilter="all"
                initialAvailableSlots={initialAvailableSlots}
              />
            </div>

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
            <TutorCTACard
              tutorId={tutorDto.id}
              tutorName={tutor.name}
              price={tutor.pricePerHour}
              tutorAvailableSlots={initialAvailableSlots}
            />
          </div>
        </div>
      </main>
    </>
  );
}
