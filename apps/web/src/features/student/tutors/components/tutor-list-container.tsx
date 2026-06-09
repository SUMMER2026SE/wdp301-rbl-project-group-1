"use client";

import { FilterSidebar } from "@/src/shared/components/organisms/filter-sidebar";
import { Button } from "@/src/shared/components/ui/button";
import { useDebounce } from "@/src/shared/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAllSubjectsQuery, useGetAllGradesQuery } from "@/src/features/academic-catalog/academicCatalogApi";
import { filterSchema, type FilterFormData } from "../schemas/filter.schema";
import { useGetTutorsQuery } from "../tutorEnhance";
import { mapTutorResponseToTutor } from "../utils/map-tutor";
import { SearchBar } from "./search-bar";
import { TutorGrid } from "./tutor-grid";

const ITEMS_PER_PAGE = 9;
export function TutorListContainer() {
  const { data: subjectsResponse } = useGetAllSubjectsQuery();
  const { data: gradesResponse } = useGetAllGradesQuery();

  const subjectsData = subjectsResponse?.data || [];
  const gradesData = gradesResponse?.data || [];

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      subjectIds: [],
      gradeIds: [],
      priceRange: [50000, 1000000],
      rating: 0,
      search: "",
      sortBy: "rating",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const search = form.watch("search");
  const subjectIds = form.watch("subjectIds");
  const gradeIds = form.watch("gradeIds");
  const priceRange = form.watch("priceRange");
  const rating = form.watch("rating");
  const sortBy = form.watch("sortBy");

  const debouncedSearch = useDebounce(search, 500);

  const [currentPage, setCurrentPage] = useState(1);

  const apiSortParams = useMemo(() => {
    switch (sortBy) {
      case "price-low":
        return { sortBy: "pricePerHour", sortOrder: "asc" as const };
      case "price-high":
        return { sortBy: "pricePerHour", sortOrder: "desc" as const };
      case "experience":
        return { sortBy: "experience", sortOrder: "desc" as const };
      case "rating":
      default:
        return { sortBy: "rating", sortOrder: "desc" as const };
    }
  }, [sortBy]);

  const { data, isFetching, isError, refetch } = useGetTutorsQuery({
    page: currentPage.toString(),
    limit: ITEMS_PER_PAGE.toString(),
    search: debouncedSearch || undefined,
    sortBy: apiSortParams.sortBy,
    sortOrder: apiSortParams.sortOrder,
    subjectIds: subjectIds.length ? subjectIds : undefined,
    gradeIds: gradeIds.length ? gradeIds : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minRating: rating || undefined,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, subjectIds, gradeIds, priceRange, rating, sortBy]);

  const tutors = useMemo(
    () => (data?.data ?? []).map(mapTutorResponseToTutor),
    [data],
  );

  const totalCount = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 0;

  const handleSortChange = (value: string) => {
    form.setValue("sortBy", value);
  };

  return (
    <>
      <SearchBar
        value={search}
        onChange={(value) => form.setValue("search", value)}
      />

      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            subjects={{
              items: subjectsData.map((s) => ({ id: s.id, label: s.name })),
              selected: subjectIds,
              onChange: (v) => form.setValue("subjectIds", v),
            }}
            grades={{
              label: "Khối lớp",
              items: gradesData.map((g) => ({ id: g.id, label: g.name })),
              selected: gradeIds,
              onChange: (v) => form.setValue("gradeIds", v),
            }}
            price={{
              label: "Giá tiền",
              current: priceRange,
              sliderMin: 50000,
              sliderMax: 1000000,
              step: 50000,
              onChange: (min, max) => form.setValue("priceRange", [min, max]),
            }}
            rating={{
              value: rating,
              onChange: (v) => form.setValue("rating", v),
            }}
            onClear={() =>
              form.reset({
                subjectIds: [],
                gradeIds: [],
                priceRange: [50000, 1000000],
                rating: 0,
                search: "",
                sortBy: "rating",
              })
            }
          />

          {isError ? (
            <div className="flex-1">
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Không thể tải danh sách gia sư. Vui lòng thử lại.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Thử lại
                </Button>
              </div>
            </div>
          ) : (
            <TutorGrid
              tutors={tutors}
              totalCount={totalCount}
              totalPages={totalPages}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              isServerPaging={true}
              isLoading={isFetching}
            />
          )}
        </div>
      </main>
    </>
  );
}
