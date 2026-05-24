import {
  Card,
  CardContent,
} from "@/src/shared/components/ui/card";
import { Input } from "@/src/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Search } from "lucide-react";

export function TutorApprovalFilters() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-96">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên gia sư..."
            className="pl-9"
            type="search"
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto">
          <Select defaultValue="all-subjects">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Môn học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-subjects">Tất cả Môn học</SelectItem>
              <SelectItem value="math">Toán học</SelectItem>
              <SelectItem value="physics">Vật lý</SelectItem>
              <SelectItem value="english">Tiếng Anh</SelectItem>
              <SelectItem value="literature">Ngữ văn</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-levels">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Cấp độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-levels">Tất cả Cấp độ</SelectItem>
              <SelectItem value="primary">Cấp 1</SelectItem>
              <SelectItem value="secondary">Cấp 2</SelectItem>
              <SelectItem value="high-school">Cấp 3</SelectItem>
              <SelectItem value="university">Đại học</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
