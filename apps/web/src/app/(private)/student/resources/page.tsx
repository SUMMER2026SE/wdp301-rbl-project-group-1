"use client";

import {
  CategoryGrid,
  FilterSidebar,
  HeroSection,
  SavedDocuments,
  SuggestionsGrid,
  UploadDocumentModal,
  type UploadDocumentFormValues,
} from "@/src/features/student/resources/components";
import { useState } from "react";

export default function StudentResourcesPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUpload = (data: UploadDocumentFormValues) => {
    console.log("Document uploaded:", data);
    // TODO: Call API to upload document
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
      {/* Hero */}
      <HeroSection onUploadClick={() => setUploadModalOpen(true)} />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Main Content: Sidebar + Documents */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Filter Sidebar */}
        <FilterSidebar />

        {/* Main Content */}
        <div className="flex flex-col gap-10 lg:col-span-8">
          {/* Saved Documents */}
          <SavedDocuments />

          {/* Suggestions Grid */}
          <SuggestionsGrid />
        </div>
      </div>

      {/* Upload Document Modal */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUpload}
      />
    </div>
  );
}
