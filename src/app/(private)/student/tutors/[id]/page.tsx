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
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { Button } from "@/src/shared/components/ui/button";
import { ScheduleCalendar } from "@/src/features/student/schedule/components";
import { scheduleClasses } from "@/src/features/student/schedule/mock-data";
import Link from "next/link";
import { Tutor } from "@/src/features/student/tutors/types";

const MOCK_TUTOR_DETAIL: Tutor = {
  id: "tutor-1",
  name: "Nguyễn Văn A",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  isOnline: true,
  rating: 4.8,
  reviewCount: 124,
  specialty: "Toán học, Vật lý",
  experience: "5 năm",
  education: "Đại học Sư phạm HN",
  pricePerHour: 200000,
  skills: ["Toán 10", "Toán 11", "Lý 10"],
  bio: "Xin chào, tôi là Nguyễn Văn A. Tôi có 5 năm kinh nghiệm giảng dạy môn Toán và Vật lý cho học sinh cấp 3. Phương pháp của tôi là cá nhân hóa lộ trình học theo từng học sinh để đạt kết quả tốt nhất.",
  teachingExperience: [
    {
      year: "2020 - Nay",
      position: "Giáo viên Toán",
      school: "Trường THPT Chuyên Hà Nội - Amsterdam",
      description: "Giảng dạy đội tuyển học sinh giỏi và các lớp chất lượng cao.",
      isCurrent: true,
    },
    {
      year: "2018 - 2020",
      position: "Gia sư tự do",
      school: "Hà Nội",
      description: "Dạy kèm 1-1 cho hơn 50 học sinh với tỷ lệ đỗ đại học NV1 đạt 95%.",
      isCurrent: false,
    }
  ],
  certifications: [
    {
      name: "Chứng chỉ nghiệp vụ sư phạm",
      issuer: "Đại học Sư phạm HN",
      year: "2018",
    }
  ],
  reviews: [
    {
      id: "r1",
      studentName: "Trần Bảo Khanh",
      role: "Học sinh lớp 10",
      rating: 5,
      content: "Thầy dạy rất dễ hiểu, nhiệt tình và thường xuyên có bài tập ứng dụng thực tế giúp em hiểu sâu hơn.",
      createdAt: "2 ngày trước",
    }
  ]
};

export default function TutorDetailPage() {
  // Mock logic instead of useGetTutorsQuery
  const tutor = MOCK_TUTOR_DETAIL;

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
            
            {/* Fixed Schedule Section */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Lịch rảnh cố định</h3>
                <p className="text-sm text-muted-foreground mt-1">Lịch có thể nhận lớp mới của gia sư hàng tuần.</p>
              </div>
              <ScheduleCalendar
                mode="fixed"
                readonly={true}
                classes={scheduleClasses}
                selectedFilter="all"
                initialAvailableSlots={{
                  "0_08:00": true,
                  "0_08:30": true,
                  "0_09:00": true,
                  "2_14:00": true,
                  "2_14:30": true,
                  "2_15:00": true,
                  "4_19:00": true,
                  "4_19:30": true,
                  "4_20:00": true,
                }}
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
