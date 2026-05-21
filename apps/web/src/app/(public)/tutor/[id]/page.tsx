import Link from "next/link";
import {
    TutorProfileHeader,
    ProfileTabs,
} from "@/src/features/tutor/profile/components";
import { tutorInfo } from "@/src/features/tutor/profile/mock-data";

export default function PublicTutorProfilePage({
    params: _params,
}: {
    params: { id: string };
}) {
    // In a real app, we would fetch tutor data by params.id
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Breadcrumbs or Back button could go here */}
            <div className="mb-2">
                <Link
                    href="/"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Quay lại danh sách gia sư
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1">
                    <TutorProfileHeader
                        name={tutorInfo.name}
                        subject={tutorInfo.subject}
                        rating={tutorInfo.rating}
                        reviewCount={tutorInfo.reviewCount}
                        location={tutorInfo.location}
                        workType={tutorInfo.workType}
                        avatar={tutorInfo.avatar}
                    />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    <ProfileTabs />
                </div>
            </div>
        </div>
    );
}
