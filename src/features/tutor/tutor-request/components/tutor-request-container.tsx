"use client";

import { FilterSidebar } from "@/src/shared/components/organisms/filter-sidebar";
import { useDebounce } from "@/src/shared/hooks/use-debounce";
import { useMemo, useState } from "react";
import { TutorRequestSearchBar } from "./tutor-request-search-bar";
import { TutorRequestList } from "./tutor-request-list";
import { useGetTutorRequestsQuery } from "@/src/features/tutor-request/tutorRequestApi";
import { ExtendedTutorRequest } from "./tutor-request-list";
import { TutorBidModal } from "./tutor-bid-modal";
import { Loader2 } from "lucide-react";

export function TutorRequestContainer() {
  const [search, setSearch] = useState("");
  const [modes, setModes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([10000, 1000000]);
  
  const debouncedSearch = useDebounce(search, 500);

  // Fetch open requests from API
  const { data: apiResponse, isLoading, isFetching } = useGetTutorRequestsQuery({
    page: "1",
    limit: "50",
    status: "OPEN",
    search: debouncedSearch || undefined,
  });

  const rawRequests = useMemo(() => {
    return (apiResponse?.data as unknown as ExtendedTutorRequest[]) || [];
  }, [apiResponse]);

  // Local filtering for mode and budget
  const filteredRequests = useMemo(() => {
    return rawRequests.filter((req) => {
      // Filter by mode
      if (modes.length > 0 && !modes.includes(req.mode)) {
        return false;
      }
      
      // Filter by budget (if requested budget is specified, must fall within range)
      // If student didn't specify budget (null), we might still want to show it or hide it.
      // We'll show requests if their budget falls in the range, or if they have no budget (Thoả thuận)
      if (req.budget !== null && req.budget !== undefined) {
        if (req.budget < priceRange[0] || req.budget > priceRange[1]) {
          return false;
        }
      }
      
      return true;
    });
  }, [rawRequests, modes, priceRange]);

  // Bidding modal state
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleApply = (id: string) => {
    setSelectedRequestId(id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <TutorRequestSearchBar
        value={search}
        onChange={setSearch}
      />

      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 lg:sticky lg:top-24">
            <FilterSidebar
              secondary={{
                label: "Hình thức học",
                items: [
                  { id: "ONLINE", label: "Học trực tuyến" },
                  { id: "AT_HOME", label: "Học tại nhà" },
                ],
                selected: modes,
                onChange: setModes,
              }}
              price={{
                label: "Mức giá học viên đề xuất",
                current: priceRange,
                sliderMin: 10000,
                sliderMax: 1000000,
                step: 10000,
                onChange: (min, max) => setPriceRange([min, max]),
              }}
              onClear={() => {
                setSearch("");
                setModes([]);
                setPriceRange([10000, 1000000]);
              }}
            />
          </div>

          <div className="flex-1 w-full min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <span>
                  Hiển thị <span className="text-primary">{filteredRequests.length}</span> yêu cầu
                </span>
                {isFetching && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              </h2>
            </div>
            <TutorRequestList 
              requests={filteredRequests} 
              isLoading={isLoading} 
              onApply={handleApply} 
            />
          </div>
        </div>
      </main>

      <TutorBidModal 
        isOpen={!!selectedRequestId} 
        onOpenChange={(open) => !open && setSelectedRequestId(null)} 
        requestId={selectedRequestId} 
      />
    </div>
  );
}
