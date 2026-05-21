import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbNavProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="size-4 text-muted-foreground/60" />
          )}
        </div>
      ))}
    </div>
  );
}
