'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Download,
  Star,
  FolderOpen,
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';
import type { ResourceDetail } from '../types';

interface ResourceInfoProps {
  resource: ResourceDetail;
  onViewProfile?: () => void;
}

export function ResourceInfo({ resource, onViewProfile }: ResourceInfoProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="mb-2 text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {resource.title}
          </h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSaved(!isSaved)}
          title={isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}
          className={isSaved ? 'border-primary text-primary' : ''}
        >
          {isSaved ? (
            <BookmarkCheck className="size-5" />
          ) : (
            <Bookmark className="size-5" />
          )}
        </Button>
      </div>

      {/* Metadata */}
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>Đăng ngày {resource.publishDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Download className="size-4" />
          <span>{resource.downloads.toLocaleString()} lượt tải</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="size-4 fill-warning text-warning" />
          <span className="font-medium text-foreground">{resource.rating}</span>
          <span>({resource.totalRatings} đánh giá)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderOpen className="size-4" />
          <span>{resource.category}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-foreground">
          Mô tả tài liệu
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          {resource.description}
        </p>
      </div>

      {/* Author Info */}
      <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
        <div className="flex items-center gap-4">
          <div className="relative size-12 overflow-hidden rounded-full">
            <Image
              src={resource.author.avatar}
              alt={resource.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Được đăng bởi</p>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-foreground">
                {resource.author.name}
              </h4>
              {resource.author.isVerified && (
                <BadgeCheck className="size-4 text-info" />
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onViewProfile}>
          Xem hồ sơ
        </Button>
      </div>
    </div>
  );
}
