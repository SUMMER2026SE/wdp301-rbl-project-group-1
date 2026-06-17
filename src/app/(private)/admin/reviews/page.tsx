"use client";

import { useDeleteReviewByAdminMutation } from "@/src/features/admin/adminApi";
import { useGetTutorReviewsQuery } from "@/src/features/student/tutors/tutorApi";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [tutorIdInput, setTutorIdInput] = useState("");
  const [tutorId, setTutorId] = useState("");

  const {
    data: reviewsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetTutorReviewsQuery(
    { tutorId, page: "1", limit: "20", sortBy: "createdAt", sortOrder: "desc" },
    { skip: !tutorId },
  );
  const [deleteReviewByAdmin, { isLoading: isDeleting }] =
    useDeleteReviewByAdminMutation();

  const reviews = reviewsResponse?.data || [];

  const handleSearch = () => {
    if (!tutorIdInput.trim()) {
      toast.error("Vui lòng nhập tutorId");
      return;
    }
    setTutorId(tutorIdInput.trim());
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReviewByAdmin({ id: reviewId }).unwrap();
      toast.success("Đã xóa đánh giá");
      refetch();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Không thể xóa đánh giá";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-bold text-foreground">
          Tìm đánh giá theo Tutor ID
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            value={tutorIdInput}
            onChange={(event) => setTutorIdInput(event.target.value)}
            placeholder="Nhập tutorId..."
          />
          <Button onClick={handleSearch}>Tải danh sách</Button>
        </div>
      </div>

      {tutorId && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h3 className="text-base font-semibold text-foreground">
            Danh sách đánh giá của tutor: {tutorId}
          </h3>

          {isLoading && (
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          )}
          {isError && (
            <p className="mt-4 text-destructive">
              Không thể tải danh sách đánh giá.
            </p>
          )}

          {!isLoading && !isError && reviews.length === 0 && (
            <p className="mt-4 text-muted-foreground">Không có đánh giá nào.</p>
          )}

          {!isLoading && !isError && reviews.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="p-3 font-medium">Học viên</th>
                    <th className="p-3 font-medium">Số sao</th>
                    <th className="p-3 font-medium">Nội dung</th>
                    <th className="p-3 font-medium">Thời gian</th>
                    <th className="p-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="p-3">
                        {review.student.nickname || "Học viên"}
                      </td>
                      <td className="p-3">{review.rating}</td>
                      <td className="p-3">
                        {review.comment || "(Không có nội dung)"}
                      </td>
                      <td className="p-3">
                        {new Date(review.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
