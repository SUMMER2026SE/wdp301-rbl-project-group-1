import { Button } from "@/src/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Filter } from "lucide-react";

export function ReportsTableToolbar() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="pending">Chưa xử lý</SelectItem>
          <SelectItem value="reviewing">Đang xem xét</SelectItem>
          <SelectItem value="closed">Đã đóng</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="lg">
        <Filter className="size-4" />
        Lọc
      </Button>
    </div>
  );
}
