import {
  WelcomeSection,
  AdminNotification,
  NextClassWidget,
  QuickShortcuts,
  SummaryStats
} from "@/src/features/tutor/home";

export default function TutorHome() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Admin Notification */}
      <AdminNotification />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <NextClassWidget />
          <QuickShortcuts />
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          <SummaryStats />
        </div>
      </div>
    </div>
  );
}