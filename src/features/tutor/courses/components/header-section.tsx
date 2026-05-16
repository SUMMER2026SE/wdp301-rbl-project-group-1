"use client";

import { CreateClassModal } from "./create-class-modal";

export function HeaderSection() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
          Lớp học của tôi
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
          Quản lý danh sách các lớp học bạn đang phụ trách.
        </p>
      </div>
      <CreateClassModal />
    </div>
  );
}
