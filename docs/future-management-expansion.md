# EduConnect - Kế hoạch Mở rộng Module Quản lý & Vận hành (Management & Operations Expansion)

Dựa trên tầm nhìn (Vision) của dự án EduConnect và hiện trạng thiết kế cơ sở dữ liệu (`schema.prisma`), dưới đây là danh sách chi tiết các luồng (flows) và module cần thiết để hệ thống vận hành trơn tru trong thực tế.

---

## PHẦN 1: CÁC LUỒNG VẬN HÀNH CỐT LÕI (CORE OPERATIONS - ĐANG THIẾU)

### 1. Luồng Điểm danh & Hoàn thành buổi học (Attendance & Session Completion)
Hiện tại Database đã có bảng `SessionAttendance`, nhưng luồng vận hành (Flow) vẫn chưa đầy đủ. Để tránh tranh chấp, chúng ta cần cơ chế xác nhận chéo.
- [ ] **Gia sư điểm danh:** Sau khi buổi học (`Session`) kết thúc, Gia sư bắt buộc phải vào hệ thống đánh dấu điểm danh (PRESENT, ABSENT, LATE) và note lại nội dung.
- [ ] **Học viên xác nhận (Approve):** Hệ thống gửi thông báo cho Học viên yêu cầu xác nhận buổi học đã diễn ra đúng như Gia sư báo cáo. (Nếu sau 24h học viên không phản hồi, tự động chuyển thành Đã xác nhận).
- [ ] **Mở khóa tiền (Escrow Release):** Sau khi buổi học được xác nhận là COMPLETED, hệ thống tự động giải ngân (cộng tiền) tương ứng của 1 buổi học vào `Ví` của Gia sư, trừ đi phí nền tảng.

### 2. Luồng Gia hạn Khóa học (Booking Renewal / Extension)
Xử lý tình huống Học viên đã học hết lộ trình (ví dụ 10 buổi) và muốn tiếp tục học với Gia sư hiện tại mà không cần tạo lại Request/Bid từ đầu.
- [ ] **Nút "Gia hạn" (Renew Booking):** Cho phép Học viên tạo một hợp đồng gia hạn từ Booking cũ (Giữ nguyên Subject, Grade, Tutor).
- [ ] Thiết kế model `BookingExtension` hoặc đơn giản là tạo ra một `Booking` mới nối tiếp `Booking` cũ (`previousBookingId`).
- [ ] **Thanh toán Gia hạn:** Tạo ra một hóa đơn (`Payment`) mới cho đợt gia hạn này. Gia sư nhận được thông báo để xác nhận tiếp tục nhận dạy.
- [ ] **Tạo lịch mới:** Sau khi thanh toán, hệ thống tự động sinh ra các `Session` mới dựa trên lịch học hiện tại (Schedule Rules).

### 3. Luồng Hủy buổi học & Xếp lịch học bù (Cancellation & Rescheduling)
Trong thực tế, việc bận đột xuất là không tránh khỏi.
- [ ] **Yêu cầu dời lịch (Reschedule Request):** Học viên/Gia sư có thể yêu cầu dời lịch 1 `Session` sang ngày khác (cần sự đồng ý của bên kia).
- [ ] **Chính sách hủy (Cancellation Policy):** Xử lý logic nếu Hủy trước 24h thì không sao. Nếu hủy sát giờ, hệ thống áp dụng phạt (ví dụ: Học viên mất 50% tiền buổi đó, hoặc Gia sư bị trừ điểm uy tín).
- [ ] Tự động cập nhật `startTime` và `endTime` của `Session` nếu dời lịch thành công.

### 4. Luồng Báo cáo Tiến độ học tập (Progress Reports)
Để đảm bảo chất lượng, đặc biệt với các Booking dài hạn.
- [ ] Thiết kế model `ProgressReport` (Báo cáo đánh giá năng lực).
- [ ] Yêu cầu Gia sư phải điền Báo cáo tiến độ sau mỗi mốc nhất định (ví dụ: sau mỗi 4 buổi học hoặc khi kết thúc Booking).
- [ ] Học viên (hoặc Phụ huynh) có thể xem báo cáo này ngay trên nền tảng.

---

## PHẦN 2: CÁC MODULE QUẢN LÝ MỞ RỘNG (EXPANSION MODULES)

### 5. Quản lý Lớp học nhóm (Classes / Group Tutoring)
Bổ sung tính năng cho phép Gia sư tạo các lớp học nhóm cố định (thay vì chỉ Booking 1-1).
- [ ] Thiết kế model `Class` (Tên lớp, mô tả, số lượng tối đa, giá vé, lịch học).
- [ ] Thiết kế model `ClassEnrollment` (Ghi nhận học viên đăng ký tham gia lớp học).
- [ ] Thiết kế model `ClassSession` (Các buổi học cụ thể của lớp nhóm).

### 6. Quản lý Tài chính, Ví & Payout (Financial & Wallet Management)
Thiết lập luồng dòng tiền minh bạch: Học viên thanh toán -> Hệ thống giữ tiền (Escrow) cắt hoa hồng -> Gia sư rút tiền.
- [ ] Thiết kế model `Wallet` (Quản lý số dư của Gia sư).
- [ ] Thiết kế model `Transaction` (Lịch sử biến động: Nạp, Rút, Nhận tiền dạy, Phí nền tảng).
- [ ] Thiết kế model `WithdrawalRequest` (Yêu cầu rút tiền từ Gia sư).
- [ ] Luồng Admin phê duyệt và xử lý các yêu cầu rút tiền.

### 7. Quản lý Đánh giá & Phản hồi (Review & Rating System)
Theo dõi chất lượng thực tế của Gia sư dựa trên phản hồi của học viên.
- [ ] Thiết kế model `Review` (`bookingId`, `studentId`, `tutorId`, `rating` 1-5, `comment`).
- [ ] Cập nhật rating trung bình cho model `Tutor` tự động (trigger/middleware).
- [ ] Đẩy dữ liệu Review cho AI Recommendation.

### 8. Quản lý Tranh chấp và Khiếu nại (Dispute Resolution)
Giải quyết rủi ro (Gia sư bỏ dạy, học viên đòi hoàn tiền).
- [ ] Thiết kế model `DisputeTicket` (Trạng thái: OPEN, IN_REVIEW, RESOLVED) liên kết với `Booking` hoặc `Session`.
- [ ] Luồng Chat/Đối chất trong Ticket giữa Admin, Tutor và Student.
- [ ] Xây dựng luồng hoàn tiền (Refund) một phần hoặc toàn bộ.

### 9. Quản lý Tài liệu đính kèm (Resource Attachment)
Tổ chức tài liệu học tập theo buổi học.
- [ ] Thiết kế model `SessionResource` (Liên kết `Session` và `Resource`).
- [ ] Giao diện cho phép Gia sư upload tài liệu (PDF, bài tập) vào buổi học.

### 10. Quản lý Marketing & Khuyến mãi (Voucher / Promotion)
- [ ] Thiết kế model `Promotion` (Mã giảm giá, loại giảm, ngày hết hạn).
- [ ] Bổ sung logic áp mã giảm giá vào luồng thanh toán `Payment`.
