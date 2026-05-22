"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb as BreadcrumbPrimitive,
  BreadcrumbSeparator,
} from "@/src/shared/components/ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItemType[];
  className?: string; // Cho phép truyền thêm style từ component cha
}

export function BreadcrumbNav({ items, className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <BreadcrumbPrimitive className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {!isLast && item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {/* Chỉ hiển thị dấu phân cách nếu chưa phải là phần tử cuối */}
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  );
}
