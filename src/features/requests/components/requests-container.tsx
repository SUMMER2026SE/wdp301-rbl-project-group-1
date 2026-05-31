"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/components/ui/tabs";
import { RequestsTable } from "./requests-table";
import { MOCK_STUDENT_REQUESTS, MOCK_TUTOR_REQUESTS, RequestStatus } from "../mocks/requests.mock";
import { ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select";

interface RequestsContainerProps {
  role: "student" | "tutor";
}

export function RequestsContainer({ role }: RequestsContainerProps) {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");

  // Choose mock data based on role
  const mockData = role === "student" ? MOCK_STUDENT_REQUESTS : MOCK_TUTOR_REQUESTS;
  
  // Apply tab filter
  const sentRequests = mockData.filter(req => req.type === "sent");
  const receivedRequests = mockData.filter(req => req.type === "received");

  // Apply status filter
  const filteredSentRequests = statusFilter === "all" ? sentRequests : sentRequests.filter(req => req.status === statusFilter);
  const filteredReceivedRequests = statusFilter === "all" ? receivedRequests : receivedRequests.filter(req => req.status === statusFilter);

  return (
    <div className="min-h-screen bg-muted/20 pt-8 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Quản lý Yêu cầu
          </h1>
          <p className="text-base text-muted-foreground">
            {role === "student" 
              ? "Theo dõi các yêu cầu học tập bạn đã gửi và nhận được từ gia sư."
              : "Quản lý các yêu cầu giảng dạy bạn nhận được và các đề xuất đã gửi."}
          </p>
        </div>

        {/* Tabs & Content */}
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
      </div>
    </div>
  );
}
