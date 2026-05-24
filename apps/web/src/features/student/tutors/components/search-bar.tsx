"use client";

import { SearchBox } from "@/src/shared/components/molecules/search-box/search-box";
import { Button } from "@/src/shared/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({
  value: externalValue,
  onChange: externalOnChange,
}: SearchBarProps) {
  const [internalSearch, setInternalSearch] = useState("");

  // Use external or internal value
  const search = externalValue ?? internalSearch;
  const handleChange = externalOnChange ?? setInternalSearch;

  const handleSearch = () => {};

  return (
    <div className="bg-primary/10 py-12 px-4 border-b border-primary/20">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Tìm kiếm Gia sư Phù hợp
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Hơn 5000+ gia sư chuyên nghiệp sẵn sàng đồng hành cùng bạn trên con
          đường chinh phục tri thức.
        </p>
        <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <SearchBox
              placeholder="Tên gia sư, môn học, kỹ năng..."
              value={search}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-1 font-bold h-auto"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}
