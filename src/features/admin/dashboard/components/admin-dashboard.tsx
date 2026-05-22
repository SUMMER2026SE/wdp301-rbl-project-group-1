import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import {
  BarChart3,
  CircleDollarSign,
  Filter,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Tổng người dùng",
    value: "1,250",
    change: "+15%",
    icon: Users,
    tone: "bg-info-soft text-info",
  },
  {
    label: "Doanh thu",
    value: "125M ₫",
    change: "+5%",
    icon: CircleDollarSign,
    tone: "bg-success-soft text-success",
  },
  {
    label: "Tỷ lệ hoàn thành",
    value: "95%",
    change: "+2%",
    icon: UserCheck,
    tone: "bg-purple-soft text-purple",
  },
];

const approvalQueue = [
  { name: "Nguyễn Thị A", subject: "Toán học", time: "Đã gửi 2h trước", initials: "NA" },
  { name: "Trần Văn B", subject: "Vật lý", time: "Đã gửi 5h trước", initials: "TB" },
  { name: "Lê Thị C", subject: "Tiếng Anh", time: "Đã gửi 1 ngày trước", initials: "LC" },
];

const withdrawals = [
  {
    tutor: "Phạm Minh D",
    amount: "2,500,000 ₫",
    date: "24/10/2023",
    status: "Đang chờ",
  },
  {
    tutor: "Ngô Hữu E",
    amount: "1,200,000 ₫",
    date: "23/10/2023",
    status: "Đang chờ",
  },
];

const revenueBars = [54, 68, 48, 82, 76, 92, 70, 88];

export function AdminDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <div className={`flex size-9 items-center justify-center rounded-lg ${stat.tone}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="flex items-center gap-1 text-sm font-medium text-success">
                    <TrendingUp className="size-4" />
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-bold">Biến động Doanh thu</CardTitle>
              <select className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Tháng này</option>
                <option>Tháng trước</option>
                <option>Năm nay</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex min-h-[300px] flex-col justify-between rounded-lg border border-dashed border-border bg-muted/40 p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="size-5" />
                <span className="text-sm font-medium">Doanh thu theo tuần</span>
              </div>
              <div className="flex h-56 items-end gap-3">
                {revenueBars.map((height, index) => (
                  <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-44 w-full items-end rounded-md bg-background">
                      <div
                        className="w-full rounded-md bg-primary"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">W{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-bold">Hàng đợi Phê duyệt</CardTitle>
              <Button variant="link" size="sm" className="px-0">
                Xem tất cả
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {approvalQueue.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.subject} • {item.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Xem
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-bold">Yêu cầu Rút tiền</CardTitle>
            <Button variant="ghost" size="sm">
              <Filter className="size-4" />
              Lọc
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-4 font-medium">Gia sư</th>
                  <th className="p-4 font-medium">Số tiền</th>
                  <th className="p-4 font-medium">Ngày yêu cầu</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {withdrawals.map((request) => (
                  <tr key={request.tutor} className="transition-colors hover:bg-muted/30">
                    <td className="p-4 font-medium text-foreground">{request.tutor}</td>
                    <td className="p-4 font-semibold text-foreground">{request.amount}</td>
                    <td className="p-4 text-muted-foreground">{request.date}</td>
                    <td className="p-4">
                      <Badge className="bg-warning-soft text-warning hover:bg-warning-soft">
                        {request.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="link" size="sm" className="px-0">
                        Xử lý
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
