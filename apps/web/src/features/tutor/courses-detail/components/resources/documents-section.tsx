"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { DocumentCard } from "./document-card";

interface DocumentsSectionProps {
  documents: Array<{
    id: string;
    icon: "picture_as_pdf" | "play_circle" | "folder";
    iconColor: "red" | "blue" | "yellow";
    fileName: string;
    fileSize: string;
    uploadTime: string;
  }>;
}

const filterOptions = ["Tất cả", "PDF", "Video"];

export function DocumentsSection({ documents }: DocumentsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Tài liệu lớp học
        </h2>
        <Button className="flex items-center gap-2 rounded-lg h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
          <Upload className="size-4" />
          <span>Tải lên tài liệu</span>
        </Button>
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Lọc theo:
        </span>
        {filterOptions.map((option) => (
          <Button
            key={option}
            variant={activeFilter === option ? "secondary" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(option)}
            className="rounded-full text-sm font-medium"
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Documents grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            icon={doc.icon}
            iconColor={doc.iconColor}
            fileName={doc.fileName}
            fileSize={doc.fileSize}
            uploadTime={doc.uploadTime}
          />
        ))}
      </div>
    </div>
  );
}
