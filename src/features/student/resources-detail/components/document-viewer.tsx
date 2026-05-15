"use client";

import { Button } from "@/src/shared/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

interface DocumentViewerProps {
  fileName: string;
  fileUrl: string;
  totalPages?: number;
}

export function DocumentViewer({
  fileName,
  fileUrl,
  totalPages = 45,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 50), 200));
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-foreground px-4 py-3 text-background">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-error" />
          <span className="truncate text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(-10)}
            title="Thu nhỏ"
            className="size-8 text-background/60 hover:bg-background/10 hover:text-background"
          >
            <ZoomOut className="size-5" />
          </Button>
          <span className="min-w-[44px] text-center text-sm text-background/60">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(10)}
            title="Phóng to"
            className="size-8 text-background/60 hover:bg-background/10 hover:text-background"
          >
            <ZoomIn className="size-5" />
          </Button>
          <div className="mx-2 h-4 w-px bg-background/20" />
          <Button
            variant="ghost"
            size="icon"
            title="Toàn màn hình"
            className="size-8 text-background/60 hover:bg-background/10 hover:text-background"
          >
            <Maximize2 className="size-5" />
          </Button>
        </div>
      </div>

      {/* Document Viewer Area */}
      <div className="flex h-[600px] w-full items-center justify-center overflow-auto bg-muted p-4">
        <div
          className="flex min-h-full w-full max-w-3xl flex-col items-center justify-center rounded-lg bg-card shadow-md"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="mb-3 size-16 opacity-30" />
            <p className="text-foreground">Document Viewer (PDF)</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </p>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-4" />
          Trước
        </Button>
        <span className="text-sm text-muted-foreground">
          Trang {currentPage} của {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Sau
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
