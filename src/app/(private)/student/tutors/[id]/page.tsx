import {
  TutorAvailabilityCard,
  TutorBio,
  TutorCertifications,
  TutorExperience,
  TutorReviews,
} from "@/src/features/student/tutors/components";
import { TUTORS_DETAIL_DATA } from "@/src/features/student/tutors/mock-data";
import { Button } from "@/src/shared/components/ui/button";
import { Calendar, Check, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function TutorAvatar({ src, isOnline }: { src: string; isOnline: boolean }) {
  return (
    <div className="relative">
      <Image
        src={src}
        alt="Tutor avatar"
        width={160}
        height={160}
        className="h-32 w-32 rounded-full border-4 border-card object-cover shadow-lg md:h-40 md:w-40"
      />
      {isOnline && (
        <div
          className="absolute bottom-2 right-2 size-5 rounded-full border-2 border-card bg-success"
          title="Đang online"
        />
      )}
    </div>
  );
}

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = TUTORS_DETAIL_DATA[id];

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
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/student/home"
            className="hover:text-primary transition-colors"
          >
            Trang chủ
          </Link>
          <span>/</span>
          <Link
            href="/student/tutors"
            className="hover:text-primary transition-colors"
          >
            Tìm gia sư
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{tutor.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 lg:w-[70%] flex flex-col gap-8">
            {/* Header card with tutor info */}
            <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <TutorAvatar src={tutor.avatar} isOnline={tutor.isOnline} />
                </div>

                {/* Info section */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {tutor.name}
                    </h1>
                    <Check className="size-5 text-info" />
                  </div>
                  <p className="text-lg text-primary font-medium mb-4">
                    {tutor.specialty}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 md:gap-8 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="size-10 rounded-full bg-info/20 flex items-center justify-center text-info">
                        <Star className="size-5 fill-current" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 font-bold text-foreground">
                          <span>{tutor.rating}</span>
                          <span className="text-sm font-normal text-muted-foreground">
                            / 5
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {tutor.reviewCount} đánh giá
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                        <Calendar className="size-5" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {tutor.teachingHours ?? "1,500+"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Giờ giảng dạy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-10 rounded-full bg-purple/20 flex items-center justify-center text-purple">
                        <Users className="size-5" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {tutor.studentCount ?? "350+"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Học sinh
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {tutor.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary mb-2">
                  {tutor.pricePerHour.toLocaleString("vi-VN")}đ
                </div>
                <p className="text-sm text-muted-foreground">/giờ</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
                Đặt lịch học ngay
              </Button>
              <Button variant="outline" className="w-full">
                Liên hệ qua chat
              </Button>
            </div>

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
