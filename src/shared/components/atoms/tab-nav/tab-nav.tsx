import Link from "next/link";

export interface TabNavItem {
  label: string;
  href: string;
  isActive: boolean;
}

export interface TabNavProps {
  tabs: TabNavItem[];
}

export function TabNav({ tabs }: TabNavProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
            tab.isActive
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
