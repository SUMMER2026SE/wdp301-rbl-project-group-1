"use client";

import { IconStatCard } from "@/src/shared/components/molecules/icon-stat-card/icon-stat-card";
import { BookOpen, HelpCircle, Lightbulb } from "lucide-react";
import { CATEGORIES } from "../mock-data";
import type { Category } from "../types";

const colorClasses: Record<Category["color"], string> = {
  blue: "bg-info-soft text-info",
  purple: "bg-purple-soft text-purple",
  emerald: "bg-emerald-soft text-success",
};

const iconMap: Record<string, React.ReactNode> = {
  menu_book: <BookOpen className="size-6" />,
  quiz: <HelpCircle className="size-6" />,
  lightbulb: <Lightbulb className="size-6" />,
};

export function CategoryGrid() {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-foreground">
        Danh mục tài liệu
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <IconStatCard
            key={category.id}
            href="#"
            title={category.name}
            subtitle={`${category.count}+ cuốn`}
            icon={iconMap[category.icon]}
            iconWrapperClassName={colorClasses[category.color]}
          />
        ))}
      </div>
    </section>
  );
}
