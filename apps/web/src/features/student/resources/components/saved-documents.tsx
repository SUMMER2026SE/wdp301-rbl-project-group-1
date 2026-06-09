"use client";

import { FileItemInfo } from "@/src/shared/components/molecules/file-item-info/file-item-info";
import { Button } from "@/src/shared/components/ui/button";
import { Bookmark, Download } from "lucide-react";
import Link from "next/link";
import { SAVED_DOCUMENTS } from "../mock-data";

export function SavedDocuments() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Bookmark className="size-5 text-warning" />
          Tài liệu đã lưu
        </h2>
        <a
          className="text-sm font-medium text-primary hover:underline"
          href="#"
        >
          Xem tất cả
        </a>
      </div>
      <div className="rounded-xl border border-border bg-card p-2 sm:p-4">
        <ul className="flex flex-col gap-2">
          {SAVED_DOCUMENTS.map((doc, idx) => (
            <li
              key={doc.id}
              className={`flex flex-col items-start justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-muted sm:flex-row sm:items-center ${
                idx > 0 ? "border-t border-border" : ""
              }`}
            >
              <Link
                href={`/student/resources/${doc.id}`}
                className="flex flex-1 items-center min-w-0"
              >
                <FileItemInfo
                  type={doc.type}
                  title={doc.title}
                  subtitle={`${doc.type.toUpperCase()} • ${doc.size} • Đã lưu ${doc.savedDate}`}
                />
              </Link>
              <div className="mt-2 flex w-full items-center gap-2 sm:mt-0 sm:w-auto">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  <Link href={`/student/resources/${doc.id}`}>Xem ngay</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Download className="size-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
