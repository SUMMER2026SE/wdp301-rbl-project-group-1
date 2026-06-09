"use client";

import {
  FoldersSection,
  RecentResourcesTable,
  ResourcesByCourse,
  UploadResourceModal,
} from "@/src/features/tutor/resources/components";
import {
  mockCourseResources,
  mockFolders,
  mockRecentResources,
} from "@/src/features/tutor/resources/mock-data";
import { Button } from "@/src/shared/components/ui/button";

export default function TutorResourcesPage() {
  return (
    <main className="flex flex-1 justify-center py-5 px-4 md:px-10">
      <div className="layout-content-container flex flex-col max-w-300 flex-1 w-full gap-8">
        {/* Header Section */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-b border-border pb-6">
          <div>
            <h1 className="text-foreground text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em]">
              Kho tài liệu giảng dạy
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-normal leading-normal mt-1">
              Quản lý và chia sẻ tài liệu học tập với học sinh của bạn.
            </p>
          </div>
          <UploadResourceModal
            trigger={
              <Button className="flex min-w-35 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  upload_file
                </span>
                <span className="truncate">Tải lên tài liệu</span>
              </Button>
            }
          />
        </section>

        {/* Folders Section */}
        <FoldersSection folders={mockFolders} />

        {/* Resources by Course Section */}
        <ResourcesByCourse courses={mockCourseResources} />

        {/* Recent Resources Table */}
        <RecentResourcesTable resources={mockRecentResources} />
      </div>
    </main>
  );
}
