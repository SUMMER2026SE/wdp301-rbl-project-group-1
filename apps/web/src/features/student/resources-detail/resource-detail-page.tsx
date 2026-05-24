"use client";

import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { DocumentViewer } from "@/src/shared/components/organisms/document-viewer";
import { FileText, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { CommentsSection, RelatedResources, ResourceInfo } from "./components";
import {
  mockComments,
  mockRelatedResources,
  mockResourceDetail,
} from "./mock-data";

interface ResourceDetailPageProps {
  resourceId?: string;
}

export function ResourceDetailPage({}: ResourceDetailPageProps) {
  const router = useRouter();

  // In a real app, fetch resource data based on resourceId
  const resource = mockResourceDetail;
  const comments = mockComments;
  const relatedResources = mockRelatedResources;

  const handleViewProfile = () => {
    router.push(`/student/tutors/${resource.author.id}`);
  };

  const handleAddComment = (commentText: string) => {
    console.log("New comment:", commentText);
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <BreadcrumbNav
            items={[
              { label: "Thư viện Tài liệu", href: "/student/resources" },
              {
                label: resource.category,
                href: `/student/resources?category=${resource.category}`,
              },
              { label: resource.title },
            ]}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="flex flex-col gap-8 lg:col-span-9">
            {/* Document Viewer */}
            <DocumentViewer
              fileName={resource.fileName}
              totalPages={resource.pages}
            />

            {/* Resource Info */}
            <ResourceInfo
              resource={resource}
              onViewProfile={handleViewProfile}
            />

            {/* Comments Section */}
            <CommentsSection
              comments={comments}
              totalComments={comments.length}
              onAddComment={handleAddComment}
            />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {/* Related Resources */}
            <RelatedResources resources={relatedResources} />

            {/* Document Info Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-foreground">
                Thông tin tài liệu
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-1 text-muted-foreground">Loại tài liệu</p>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <FileText className="size-4 text-error" />
                    {resource.type.toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">Dung lượng</p>
                  <p className="font-medium text-foreground">
                    {resource.fileSize}
                  </p>
                </div>
                {resource.pages && (
                  <div>
                    <p className="mb-1 text-muted-foreground">Số trang</p>
                    <p className="font-medium text-foreground">
                      {resource.pages} trang
                    </p>
                  </div>
                )}
                {resource.tags && resource.tags.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-muted-foreground">
                      <Hash className="size-3.5" /> Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
