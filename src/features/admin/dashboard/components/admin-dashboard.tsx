import { stats } from "./admin-dashboard.constants";
import { ApprovalQueueCard } from "./approval-queue-card";
import { RevenueChartCard } from "./revenue-chart-card";
import { StatCard } from "./stat-card";
import { WithdrawalRequestsCard } from "./withdrawal-requests-card";

export function AdminDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RevenueChartCard />
        <ApprovalQueueCard />
      </section>

      <WithdrawalRequestsCard />
    </div>
  );
}
