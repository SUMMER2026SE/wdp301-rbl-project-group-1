import { IconStatCard } from "@/src/shared/components/molecules/icon-stat-card/icon-stat-card";
import { Folder } from "../types";

interface FoldersSectionProps {
  folders: Folder[];
}

const iconColorConfig: Record<Folder["iconColor"], string> = {
  blue: "bg-info-soft text-info",
  orange: "bg-warning-soft text-warning",
  green: "bg-emerald-soft text-success",
};

export function FoldersSection({ folders }: FoldersSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground">Thư mục</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <IconStatCard
            key={folder.id}
            title={folder.name}
            subtitle={`${folder.fileCount} tập tin`}
            icon={
              <span className="material-symbols-outlined text-[24px] leading-none">
                {folder.icon}
              </span>
            }
            iconWrapperClassName={iconColorConfig[folder.iconColor]}
          />
        ))}
      </div>
    </section>
  );
}
