import {
    TutorProfileHeader,
    UpgradePlans,
    ProfileTabs,
} from "@/src/features/tutor/profile/components";
import {
    tutorInfo,
    upgradePlans,
} from "@/src/features/tutor/profile/mock-data";

export default function TutorProfilePage() {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header section with profile info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                {/* Tabs for detailed information */}
                <div className="lg:col-span-2">
                    <ProfileTabs />
                </div>
            </div>

            {/* Upgrade plans section */}
            <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-12">
                <UpgradePlans plans={upgradePlans} />
            </div>
        </div>
    );
}
