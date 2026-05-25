"use client";

import { FileItemInfo } from "@/src/shared/components/molecules/file-item-info/file-item-info";
import { DataTable } from "@/src/shared/components/organisms/table/data-table";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreVertical, Search, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceDocument } from "../types";

interface RecentResourcesTableProps {
  resources: ResourceDocument[];
}

export function RecentResourcesTable({ resources }: RecentResourcesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchSearch = resource.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchClass =
        classFilter === "all" || resource.className === classFilter;
      const matchSubject =
        subjectFilter === "all" || resource.subject === subjectFilter;
      return matchSearch && matchClass && matchSubject;
    });
  }, [resources, searchQuery, classFilter, subjectFilter]);

  const classes = useMemo(() => {
    const uniqueClasses = Array.from(
      new Set(resources.map((r) => r.className).filter(Boolean)),
    );
    return uniqueClasses;
  }, [resources]);

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(resources.map((r) => r.subject).filter(Boolean)),
    );
    return uniqueSubjects;
  }, [resources]);

  const columns: ColumnDef<ResourceDocument>[] = [
    {
      accessorKey: "name",
      header: "Tên tài liệu",
      cell: ({ row }) => (
        <FileItemInfo
          type={row.original.type}
          title={row.original.name}
          subtitle={`${row.original.size} • ${row.original.category}`}
        />
      ),
    },
    {
      accessorKey: "className",
      header: "Lớp học",
      cell: ({ row }) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {row.original.className || "-"}
        </span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Môn học",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.subject || "-"}
        </span>
      ),
    },
    {
      accessorKey: "uploadDate",
      header: "Ngày đăng",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.uploadDate}</span>
      ),
    },
    {
      accessorKey: "views",
      header: "Lượt xem",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="size-4" />
          <span>{row.original.views}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-3 text-primary border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <Share2 className="size-4" />
            Chia sẻ
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4 mt-6">
      <h2 className="text-lg font-bold text-foreground">Quản lý Tài liệu</h2>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Chọn lớp học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lớp học</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls as string} value={cls as string}>
                {cls as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Chọn môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn học</SelectItem>
            {subjects.map((sub) => (
              <SelectItem key={sub as string} value={sub as string}>
                {sub as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredResources} />
    </section>
  );
}
