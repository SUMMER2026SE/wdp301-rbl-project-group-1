# EduConnect - Danh sách API Task mở rộng (API Task List)

Dựa trên kế hoạch mở rộng vận hành trong `future-management-expansion.md`, dưới đây là danh sách chi tiết các API Endpoints cần được xây dựng (Thiết kế theo chuẩn RESTful).

---

## PHẦN 1: CÁC LUỒNG VẬN HÀNH CỐT LÕI (CORE OPERATIONS)

### 1. Luồng Điểm danh & Hoàn thành buổi học (Attendance & Escrow)
- [ ] `POST /api/sessions/:sessionId/attendance` 
  - **Role:** Tutor
  - **Body:** `{ status: "PRESENT" | "ABSENT" | "LATE", notes: string }`
  - **Action:** Gia sư điểm danh, đổi trạng thái Session thành `AWAITING_CONFIRMATION`.
- [ ] `PATCH /api/sessions/:sessionId/confirm`
  - **Role:** Student
  - **Action:** Học viên xác nhận buổi học. Đổi trạng thái Session thành `COMPLETED`. Kích hoạt luồng cộng tiền vào Ví Gia sư (Escrow release).
- [ ] `POST /api/sessions/:sessionId/dispute`
  - **Role:** Student
  - **Body:** `{ reason: string }`
  - **Action:** Học viên báo cáo buổi học có vấn đề (gia sư không đến, dạy thiếu giờ). Chuyển sang luồng Dispute.

### 2. Luồng Gia hạn Khóa học (Booking Renewal)
- [ ] `POST /api/bookings/:bookingId/renew`
  - **Role:** Student
  - **Body:** `{ totalSessions: number, message: string }`
  - **Action:** Tạo một Booking mới (clone data từ Booking cũ) với trạng thái `PENDING`.
- [ ] `GET /api/bookings/:bookingId/extensions`
  - **Role:** Student, Tutor
  - **Action:** Lấy lịch sử các lần gia hạn của một hợp đồng gốc.

### 3. Luồng Hủy buổi học & Xếp lịch học bù (Rescheduling & Cancellation)
- [ ] `POST /api/sessions/:sessionId/reschedule`
  - **Role:** Student, Tutor
  - **Body:** `{ proposedStartTime: ISOString, proposedEndTime: ISOString, reason: string }`
  - **Action:** Gửi yêu cầu dời lịch học. Đổi trạng thái Session thành `RESCHEDULE_REQUESTED`.
- [ ] `PATCH /api/sessions/:sessionId/reschedule/approve`
  - **Role:** Người nhận yêu cầu (Tutor hoặc Student)
  - **Action:** Chấp nhận giờ học mới, tự động update `startTime`, `endTime`.
- [ ] `PATCH /api/sessions/:sessionId/cancel`
  - **Role:** Student, Tutor
  - **Body:** `{ reason: string }`
  - **Action:** Hủy buổi học. Hệ thống sẽ tính toán thời gian (trước/sau 24h) để áp dụng chính sách phạt tiền.

### 4. Luồng Báo cáo Tiến độ học tập (Progress Reports)
- [ ] `POST /api/bookings/:bookingId/reports`
  - **Role:** Tutor
  - **Body:** `{ title: string, content: string, score: number }`
  - **Action:** Tạo báo cáo đánh giá định kỳ cho học viên.
- [ ] `GET /api/bookings/:bookingId/reports`
  - **Role:** Student, Tutor
  - **Action:** Xem danh sách các báo cáo tiến độ thuộc Booking.

---

## PHẦN 2: CÁC MODULE QUẢN LÝ MỞ RỘNG (EXPANSION MODULES)

### 5. Quản lý Lớp học nhóm (Classes)
- [ ] `POST /api/classes` (Tutor) - Tạo lớp học nhóm mới.
- [ ] `GET /api/classes` (Public) - Tìm kiếm, lọc lớp học.
- [ ] `POST /api/classes/:classId/enroll` (Student) - Đăng ký và thanh toán tham gia lớp.
- [ ] `GET /api/classes/:classId/students` (Tutor) - Danh sách học viên trong lớp.

### 6. Quản lý Tài chính, Ví & Payout (Wallet & Transactions)
- [ ] `GET /api/wallet/balance` (Tutor) - Xem số dư khả dụng và số dư đang chờ duyệt.
- [ ] `GET /api/wallet/transactions` (Tutor) - Lịch sử dòng tiền (Tiền vào, Tiền ra, Phí).
- [ ] `POST /api/wallet/withdraw` (Tutor) - Yêu cầu rút tiền. `Body: { amount, bankCode, bankAccount }`.
- [ ] `GET /api/admin/withdrawals` (Admin) - Xem danh sách yêu cầu rút tiền.
- [ ] `PATCH /api/admin/withdrawals/:id` (Admin) - Phê duyệt (APPROVED) hoặc Từ chối (REJECTED) yêu cầu rút tiền.

### 7. Quản lý Đánh giá (Reviews)
- [ ] `POST /api/bookings/:bookingId/reviews` (Student) - Viết review sau khi Booking/Session hoàn thành.
- [ ] `GET /api/tutors/:tutorId/reviews` (Public) - Lấy danh sách review của một Gia sư.
- [ ] `DELETE /api/admin/reviews/:id` (Admin) - Xóa review vi phạm chính sách.

### 8. Quản lý Tranh chấp (Disputes)
- [ ] `POST /api/disputes` (Student, Tutor) - Tạo ticket khiếu nại liên quan đến Booking/Session.
- [ ] `POST /api/disputes/:id/messages` (Student, Tutor, Admin) - Chat trong nội bộ ticket khiếu nại.
- [ ] `PATCH /api/admin/disputes/:id/resolve` (Admin) - Phán quyết kết quả khiếu nại (Hoàn tiền hoặc không).

### 9. Quản lý Tài liệu đính kèm (Session Resources)
- [ ] `POST /api/sessions/:sessionId/resources` (Tutor) - Upload và đính kèm `resourceId` vào buổi học.
- [ ] `GET /api/sessions/:sessionId/resources` (Student, Tutor) - Lấy danh sách tài liệu của buổi học.
- [ ] `DELETE /api/sessions/:sessionId/resources/:resourceId` (Tutor) - Gỡ tài liệu khỏi buổi học.

### 10. Quản lý Khuyến mãi (Promotions)
- [ ] `POST /api/admin/promotions` (Admin) - Tạo mã giảm giá.
- [ ] `POST /api/promotions/apply` (Student) - Kiểm tra mã giảm giá có hợp lệ hay không trước khi Checkout.
