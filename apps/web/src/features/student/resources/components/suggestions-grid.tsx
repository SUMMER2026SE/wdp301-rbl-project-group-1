'use client';

import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  FileText,
  FileVideo,
} from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';
import { SUGGESTIONS } from '../mock-data';
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

export function SuggestionsGrid() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Gợi ý cho bạn</h2>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronLeft className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SUGGESTIONS.map((doc) => (
          <Link
            key={doc.id}
            href={`/student/resources/${doc.id}`}
            className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`${iconColorClasses[doc.type]} flex-shrink-0 rounded-lg p-2`}
              >
                <DocIcon type={doc.type} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-warning"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <BookmarkPlus className="size-5" />
              </Button>
            </div>
            <h3 className="mb-2 line-clamp-2 flex-grow font-bold text-foreground transition-colors group-hover:text-primary">
              {doc.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {doc.type.toUpperCase()} • {doc.size || doc.description} • Lượt
              tải: {doc.downloads?.toLocaleString('vi-VN')}
            </p>
            <Button className="w-full font-bold">Xem chi tiết</Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
