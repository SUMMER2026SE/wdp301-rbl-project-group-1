"use client";

import { FilterSidebar } from "@/src/shared/components/organisms/filter-sidebar";
import { useDebounce } from "@/src/shared/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo} from "react";
import { useForm } from "react-hook-form";
import { filterSchema, type FilterFormData } from "@/src/features/student/tutors/schemas/filter.schema";
import { LEVELS, SUBJECTS } from "@/src/features/student/tutors/constants/filter.constants";
import { TutorRequestSearchBar } from "./tutor-request-search-bar";
import { TutorRequestList } from "./tutor-request-list";
import { MOCK_TUTOR_REQUESTS } from "../mocks/tutor-requests.mock";

export function TutorRequestContainer() {
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      subjects: [],
      levels: [],
      priceRange: [50000, 1000000],
      rating: 0,
      search: "",
      sortBy: "rating",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const search = form.watch("search");
  const subjects = form.watch("subjects");
  const levels = form.watch("levels");
  const priceRange = form.watch("priceRange");

  const debouncedSearch = useDebounce(search, 500);

  // Mock filtering
  const filteredRequests = useMemo(() => {
    return MOCK_TUTOR_REQUESTS.filter((req) => {
      // Filter by search
      if (debouncedSearch && !req.title.toLowerCase().includes(debouncedSearch.toLowerCase()) && !req.subject.toLowerCase().includes(debouncedSearch.toLowerCase())) {
        return false;
      }
      // Filter by subjects
      if (subjects.length > 0 && !subjects.includes(req.subject)) {
        return false;
      }
      // Filter by levels
      if (levels.length > 0 && !levels.includes(req.level)) {
        return false;
      }
      // Filter by price
      if (req.pricePerSession < priceRange[0] || req.pricePerSession > priceRange[1]) {
        return false;
      }
      return true;
    });
  }, [debouncedSearch, subjects, levels, priceRange]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <TutorRequestSearchBar
        value={search}
        onChange={(value) => form.setValue("search", value)}
      />

      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 lg:sticky lg:top-24">
            <FilterSidebar
              subjects={{
                items: SUBJECTS,
                selected: subjects,
                onChange: (v) => form.setValue("subjects", v),
              }}
              secondary={{
                label: "Cấp độ",
                items: LEVELS,
                selected: levels,
                onChange: (v) => form.setValue("levels", v),
              }}
              price={{
                label: "Mức giá mong muốn",
                current: priceRange,
                sliderMin: 50000,
                sliderMax: 1000000,
                step: 50000,
                onChange: (min, max) => form.setValue("priceRange", [min, max]),
              }}
              onClear={() =>
                form.reset({
                  subjects: [],
                  levels: [],
                  priceRange: [50000, 1000000],
                  rating: 0,
                  search: "",
                  sortBy: "rating",
                })
              }
            />
          </div>

          <div className="flex-1 w-full min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Hiển thị <span className="text-primary">{filteredRequests.length}</span> yêu cầu phù hợp
              </h2>
            </div>
            <TutorRequestList requests={filteredRequests} />
          </div>
        </div>
      </main>
    </div>
  );
}
