"use client";

import { BookOpen, HelpCircle, Lightbulb } from "lucide-react";
import { CATEGORIES } from "../mock-data";
import type { Category } from "../types";

const colorClasses: Record<Category["color"], string> = {
  blue: "bg-info-soft text-info",
  purple: "bg-purple-soft text-purple",
  emerald: "bg-emerald-soft text-success",
};

const iconMap: Record<string, React.ReactNode> = {
  menu_book: <BookOpen className="size-8" />,
  quiz: <HelpCircle className="size-8" />,
  lightbulb: <Lightbulb className="size-8" />,
};

export function CategoryGrid() {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-foreground">
        Danh mục tài liệu
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            href="#"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div
              className={`${colorClasses[category.color]} rounded-xl p-3 transition-transform group-hover:scale-110`}
            >
              {iconMap[category.icon]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.count}+ cuốn
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
