import { Metadata } from 'next';
import {
  WelcomeBanner,
  StatsGrid,
  RecentCourses,
  UpcomingSession,
  PendingTasks
} from '@/src/features/student/home/components';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'Hệ thống học tập thông minh Edura',
};

export default function StudentHome() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10 space-y-8">
      {/* Welcome Banner */}
      <WelcomeBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Recent Courses */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <StatsGrid />

          {/* Recent Courses */}
          <RecentCourses />
        </div>

        {/* Right Column: Schedule & Tasks */}
        <div className="space-y-8">
          {/* Upcoming Session */}
          <UpcomingSession />

          {/* Pending Tasks */}
          <PendingTasks />
        </div>
      </div>
    </div>
  );
}