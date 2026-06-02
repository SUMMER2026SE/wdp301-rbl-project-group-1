# Edura Backend - Lộ trình phát triển (Roadmap)

Dưới đây là tiến trình triển khai API cho nền tảng Edura, đảm bảo khớp tuyệt đối với tiến độ Frontend và tư duy phát triển Agile.

## Giai đoạn 1: Nền tảng cốt lõi (Core Foundation & MVP Booking)
*Mục tiêu: Đảm bảo các luồng chức năng tối quan trọng (Users, Booking, Bidding) hoạt động trơn tru.*

- [x] **Xây dựng khung Architecture:** Tích hợp Prisma, NestJS CQRS, Redis, Zod, Swagger.
- [x] **Auth & Security:** 
  - Đăng ký/Đăng nhập (Local/Google). 
  - Token refresh, JWT Guards, Phân quyền (RoleGuard).
  - Tích hợp Redis thay Postgres để quản lý OTP siêu tốc.
- [x] **User Management:** Quản lý thông tin `Student` và `Tutor`.
- [ ] **Tutor Request & Bidding Flow:**
  - `POST /tutor-requests`, `GET /tutor-requests`: Học sinh đăng bài và lấy danh sách.
  - `POST /tutor-requests/:id/bids`: Gia sư apply, báo giá.
  - `PUT /tutor-bids/:id/accept`: Xử lý logic Backend cực kỳ quan trọng: Tự động đẻ ra `Booking` và danh sách `Session` dựa trên `ScheduleRule`.
- [ ] **Direct Booking Flow:** `POST /bookings/direct` xử lý tương tự như Accept Bid.

## Giai đoạn 2: Tự động hóa & Khớp lệnh thông minh (Payment & AI Matching)
*Mục tiêu: Tích hợp hệ sinh thái tài chính và hệ thống gợi ý phức tạp.*

- [ ] **Tích hợp cổng thanh toán (PayOS / VNPay):**
  - Xây dựng API Checkout sinh URL.
  - Xây dựng hệ thống hứng **Webhook** an toàn (Verify signature, Idempotency key tránh double-payment).
  - Tự động hóa việc trigger chuyển trạng thái `Booking` -> `CONFIRMED`.
- [ ] **Tích hợp RabbitMQ & AI Service Worker:**
  - Thiết lập Message Queue. Bắn events (e.g., `UserCreated`, `TutorBidCreated`) sang Worker Python.
  - Lắng nghe kết quả từ Python (ví dụ: mảng Vector Embeddings) để lưu trữ ngược lại vào PostgreSQL thông qua `pgvector`.
  - Cung cấp API `GET /users/me/recommendations` tốc độ cao lấy từ trường JSON cache.

## Giai đoạn 3: Mở rộng tính năng thời gian thực (Realtime & Group Class)
*Mục tiêu: Đa dạng hóa mô hình dạy học và giao tiếp.*

- [ ] **Hệ thống Lớp học Nhóm (Group Class):**
  - Refactor lại cấu trúc `Session` để hỗ trợ nhiều `SessionAttendance` trong cùng một buổi học thay vì chỉ 1-1.
- [ ] **Hệ thống Chat thời gian thực (Real-time Messaging):**
  - Tích hợp **Socket.io** qua Redis Pub/Sub (nếu chạy multi-instances).
  - Hoặc cân nhắc tách dịch vụ Chat sang một cụm NoSQL (như MongoDB) để tránh làm phình to CSDL quan hệ chính khi lượng tin nhắn tăng mạnh.
- [ ] **Hệ thống Video Call:** Cung cấp API cấp phát Room Token cho ứng dụng WebRTC / Zoom API.
