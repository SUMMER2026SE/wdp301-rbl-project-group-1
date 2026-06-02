"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/components/ui/tabs";
import { RequestsTable } from "./requests-table";
import { CreateTutorRequestModal } from "./create-tutor-request-modal";
import { RequestStatus, BookingRequest } from "../mocks/requests.mock";
import { ArrowUpRight, ArrowDownLeft, Filter, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select";
import { useGetBookingsQuery } from "../../booking/bookingApi";
import { useGetTutorRequestsQuery } from "../../tutor-request/tutorRequestEnhance";
import { useGetProfileQuery } from "../../user/userApi";
import { Loader2 } from "lucide-react";

interface RequestsContainerProps {
  role: "student" | "tutor";
}

const mapDayOfWeek = (day: number) => {
  if (day === 0) return "CN";
  return `T${day + 1}`;
};

export function RequestsContainer({ role }: RequestsContainerProps) {
  const { data: profileData } = useGetProfileQuery();
  const user = profileData?.data;
  
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");

  const { data: bookingsData, isLoading: isLoadingBookings } = useGetBookingsQuery({});
  
  // For students, fetch requests they created. For tutors, ideally fetch requests they bid on, but for now we fetch all open if needed or just skip.
  const { data: requestsData, isLoading: isLoadingRequests } = useGetTutorRequestsQuery({
    studentId: role === "student" && user ? user.id : undefined,
  });

  const isLoading = isLoadingBookings || isLoadingRequests;

  const mappedData = useMemo(() => {
    const combined: BookingRequest[] = [];

    if (bookingsData?.data) {
      bookingsData.data.forEach((b) => {
        const scheduleStr = b.scheduleRules && b.scheduleRules.length > 0
          ? b.scheduleRules.map(r => `${mapDayOfWeek(r.dayOfWeek)} (${r.startTime}-${r.endTime})`).join(", ")
          : "Theo thoả thuận";

        combined.push({
          id: b.id,
          type: role === "student" ? "sent" : "received",
          counterpartName: role === "student" ? b.tutor.name : (b.student.nickname || "Học viên"),
          counterpartAvatar: (role === "student" ? b.tutor.avatarUrl : b.student.avatarUrl) || "",
          courseName: b.subject?.name || "Dạy kèm theo yêu cầu",
          createdAt: b.createdAt,
          schedule: scheduleStr,
          price: b.price || 0,
          status: b.status.toLowerCase() as RequestStatus,
          message: b.message || undefined,
        });
      });
    }

    if (requestsData?.data && role === "student") {
      requestsData.data.forEach((r) => {
        combined.push({
          id: r.id,
          type: "sent",
          counterpartName: "Hệ thống (Tìm gia sư)",
          counterpartAvatar: "",
          courseName: r.title,
          createdAt: r.createdAt,
          schedule: "Theo thoả thuận",
          price: r.budget || 0,
          status: r.status === "OPEN" ? "pending" : (r.status === "CLOSED" ? "completed" : "rejected"),
          message: r.description,
          isTutorRequest: true,
        });
      });
    }

    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookingsData, requestsData, role]);

  const sentRequests = mappedData.filter((req) => req.type === "sent");
  const receivedRequests = mappedData.filter((req) => req.type === "received");

  const filteredSentRequests = statusFilter === "all" ? sentRequests : sentRequests.filter((req) => req.status === statusFilter);
  const filteredReceivedRequests = statusFilter === "all" ? receivedRequests : receivedRequests.filter((req) => req.status === statusFilter);

  return (
    <div className="min-h-screen bg-muted/20 pt-8 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Quản lý Yêu cầu
            </h1>
            <p className="text-base text-muted-foreground">
              {role === "student" 
                ? "Theo dõi các yêu cầu học tập bạn đã gửi và nhận được từ gia sư."
                : "Quản lý các yêu cầu giảng dạy bạn nhận được và các đề xuất đã gửi."}
            </p>
          </div>
          {role === "student" && (
            <CreateTutorRequestModal 
              trigger={
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  <Plus className="size-4" />
                  Tạo Yêu Cầu Mới
                </button>
              }
            />
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-8 animate-spin mb-4 text-primary" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "sent" | "received")} className="w-full space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-px">
              <TabsList className="bg-transparent h-12 p-0 space-x-6">
                <TabsTrigger 
                  value="sent"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none h-12 px-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="size-4" />
                    Yêu cầu Đã gửi
                    <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {filteredSentRequests.length}
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="received"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none h-12 px-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="size-4" />
                    Yêu cầu Nhận được
                    <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {filteredReceivedRequests.length}
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 pb-2 sm:pb-0">
                <Filter className="size-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RequestStatus | "all")}>
                  <SelectTrigger className="w-[180px] h-9 border-border/50 bg-transparent rounded-xl shadow-none">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-md">
                    <SelectItem value="all" className="rounded-lg">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending" className="rounded-lg">Đang chờ</SelectItem>
                    <SelectItem value="accepted" className="rounded-lg">Đã chấp nhận</SelectItem>
                    <SelectItem value="rejected" className="rounded-lg">Đã từ chối</SelectItem>
                    <SelectItem value="completed" className="rounded-lg">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="sent" className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <RequestsTable requests={filteredSentRequests} role={role} />
            </TabsContent>
            
            <TabsContent value="received" className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <RequestsTable requests={filteredReceivedRequests} role={role} />
            </TabsContent>
            
          </Tabs>
        )}
      </div>
    </div>
  );
}
