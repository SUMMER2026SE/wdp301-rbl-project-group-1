import { reportStats } from "./reports.constants";
import { ComplaintDetailCard } from "./complaint-detail-card";
import { ReportStatCard } from "./report-stat-card";
import { ReportsTable } from "./reports-table";

export function ReportsBoard() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {reportStats.map((stat) => (
          <ReportStatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ReportsTable />
        <ComplaintDetailCard />
      </section>
    </div>
  );
}
