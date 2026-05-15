'use client';

import Link from 'next/link';
import { Download, Bookmark, FileText, FileVideo } from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';
import { SAVED_DOCUMENTS } from '../mock-data';
import type { Document } from '../types';

const iconColorClasses: Record<Document['type'], string> = {
  pdf: 'bg-error-soft text-error',
  docx: 'bg-info-soft text-info',
  video: 'bg-purple-soft text-purple',
};

const DocIcon = ({ type }: { type: Document['type'] }) => {
  if (type === 'video') return <FileVideo className="size-5" />;
  return <FileText className="size-5" />;
};

export function SavedDocuments() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Bookmark className="size-5 text-warning" />
          Tài liệu đã lưu
        </h2>
        <a className="text-sm font-medium text-primary hover:underline" href="#">
          Xem tất cả
        </a>
      </div>
      <div className="rounded-xl border border-border bg-card p-2 sm:p-4">
        <ul className="flex flex-col gap-2">
          {SAVED_DOCUMENTS.map((doc, idx) => (
            <li
              key={doc.id}
              className={`flex flex-col items-start justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-muted sm:flex-row sm:items-center ${
                idx > 0 ? 'border-t border-border' : ''
              }`}
            >
              <Link
                href={`/student/resources/${doc.id}`}
                className="flex flex-1 items-center gap-4"
              >
                <div
                  className={`${iconColorClasses[doc.type]} flex-shrink-0 rounded-lg p-2.5`}
                >
                  <DocIcon type={doc.type} />
                </div>
                <div>
                  <h3 className="line-clamp-1 font-bold text-foreground transition-colors hover:text-primary">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {doc.type.toUpperCase()} • {doc.size} • Đã lưu{' '}
                    {doc.savedDate}
                  </p>
                </div>
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
