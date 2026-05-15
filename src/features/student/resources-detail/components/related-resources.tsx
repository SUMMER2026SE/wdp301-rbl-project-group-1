'use client';

import Link from 'next/link';
import { Download, Star } from 'lucide-react';
import type { RelatedResource } from '../types';

interface RelatedResourcesProps {
  resources: RelatedResource[];
}

export function RelatedResources({ resources }: RelatedResourcesProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-xl font-bold text-foreground">
        Tài liệu liên quan
      </h3>

      <div className="flex flex-col gap-4">
        {resources.map((resource) => (
          <Link
            key={resource.id}
            href={`/student/resources/${resource.id}`}
            className="group cursor-pointer rounded-xl border border-border p-4 transition-all hover:border-primary hover:bg-muted/50"
          >
            <h4 className="mb-2 line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
              {resource.title}
            </h4>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                {resource.category}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Download className="size-3.5" />
                  {resource.downloads.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-warning text-warning" />
                  {resource.rating}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
