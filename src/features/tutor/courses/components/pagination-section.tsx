import { Pagination } from "@/src/shared/components/molecules/pagination";

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationSection(props: PaginationSectionProps) {
  return (
    <div className="flex justify-center mt-4">
      <Pagination {...props} />
    </div>
  );
}
