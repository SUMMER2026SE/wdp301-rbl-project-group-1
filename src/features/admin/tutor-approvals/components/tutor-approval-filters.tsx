import { SearchBox } from "@/src/shared/components/molecules/search-box/search-box";
import { SortSelect } from "@/src/shared/components/molecules/sort-select/sort-select";
import { Table } from "@tanstack/react-table";
import type { TutorApplication } from "./tutor-approvals.types";

interface TutorApprovalFiltersProps {
  table?: Table<TutorApplication>;
}

export function TutorApprovalFilters({ table }: TutorApprovalFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
      <div className="w-full md:max-w-96">
        <SearchBox
          placeholder="Tìm kiếm theo email gia sư..."
          value={(table?.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("email")?.setFilterValue(event.target.value)
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SortSelect
          label="Môn học:"
          placeholder="Môn học"
          value={
            (table?.getColumn("subjects")?.getFilterValue() as string) ?? "all"
          }
          onChange={(value) => {
            table
              ?.getColumn("subjects")
              ?.setFilterValue(value === "all" ? "" : value);
          }}
          options={[
            { value: "all", label: "Tất cả Môn học" },
            { value: "Toán học", label: "Toán học" },
            { value: "Vật lý", label: "Vật lý" },
            { value: "Tiếng Anh", label: "Tiếng Anh" },
            { value: "Ngữ văn", label: "Ngữ văn" },
          ]}
        />

        <SortSelect
          label="Cấp độ:"
          placeholder="Cấp độ"
          value="all-levels"
          onChange={() => {}}
          options={[
            { value: "all-levels", label: "Tất cả Cấp độ" },
            { value: "primary", label: "Cấp 1" },
            { value: "secondary", label: "Cấp 2" },
            { value: "high-school", label: "Cấp 3" },
            { value: "university", label: "Đại học" },
          ]}
        />
      </div>
    </div>
  );
}
