"use client";

import { SearchBox } from "@/src/shared/components/molecules/search-box/search-box";
import { Button } from "@/src/shared/components/ui/button";
import { useState } from "react";

interface TutorRequestSearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TutorRequestSearchBar({
  value: externalValue,
  onChange: externalOnChange,
}: TutorRequestSearchBarProps) {
  const [internalSearch, setInternalSearch] = useState("");

  const search = externalValue ?? internalSearch;
  const handleChange = externalOnChange ?? setInternalSearch;

  const handleSearch = () => {
    // Optionally trigger a manual search if needed
  };

  return (
    <div className="bg-primary/5 py-12 px-4 border-b border-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-6 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Danh sách Yêu cầu Tìm Gia sư
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Khám phá và ứng tuyển vào các lớp học phù hợp với chuyên môn của bạn. Hàng trăm học sinh đang chờ đón sự hướng dẫn từ bạn.
        </p>
        
        <div className="w-full max-w-3xl flex flex-col sm:flex-row mt-6">
          <div className="flex-1 shadow-sm rounded-xl overflow-hidden bg-background">
            <SearchBox
              placeholder="Tìm theo môn học, lớp, hoặc yêu cầu cụ thể..."
              value={search}
              onChange={(e) => handleChange(e.target.value)}
              className="h-14 [&>input]:h-full [&>input]:border-0 [&>input]:focus-visible:ring-0 [&>input]:shadow-none [&>input]:text-base"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="h-14 px-8 bg-primary text-primary-foreground font-bold text-base rounded-xl shadow-md hover:-translate-y-0.5 transition-transform"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}
