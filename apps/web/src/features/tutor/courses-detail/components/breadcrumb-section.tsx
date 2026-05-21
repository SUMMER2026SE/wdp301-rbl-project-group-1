import { BreadcrumbNav } from "@/src/shared/components/atoms/breadcrumb-nav/breadcrumb-nav";

interface BreadcrumbSectionProps {
  courseName: string;
}

export function BreadcrumbSection({ courseName }: BreadcrumbSectionProps) {
  return (
    <BreadcrumbNav
      courseName={courseName}
      parentLabel="Lớp học của tôi"
      parentHref="/tutor/courses"
    />
  );
}
