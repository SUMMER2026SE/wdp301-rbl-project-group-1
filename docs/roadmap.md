# Edura Frontend - Lộ trình phát triển (Roadmap)

Lộ trình phát triển của hệ thống Edura được chia thành các Giai đoạn (Phases) rõ ràng để đảm bảo tính khả thi và ra mắt nhanh chóng (Go-to-market).

## Giai đoạn 1: Hệ thống Cốt lõi & Luồng Booking (MVP)
*Mục tiêu: Đảm bảo các luồng chức năng tối quan trọng hoạt động trơn tru. Hệ thống có thể hoạt động thực tế với các luồng cơ bản.*

- **Quản lý Tài khoản (Auth & Profile):**
  - Đăng ký, Đăng nhập (Google OAuth & Credentials).
  - Phân quyền theo Role (`STUDENT`, `TUTOR`, `ADMIN`).
  - Trang cá nhân: Cho phép Gia sư cập nhật chứng chỉ, học vấn, lịch rảnh. Học sinh cập nhật nhu cầu học tập.
- **Luồng tìm kiếm (Search & Filter):**
  - Lướt danh sách gia sư theo Môn học, Giá cả, Đánh giá.
- **Luồng Đặt lịch Trực tiếp (Direct Booking):**
  - Cho phép học sinh chọn lịch và gửi yêu cầu Đặt lịch ngay cho một Gia sư cụ thể.
- **Luồng Đăng Nhu cầu & Đấu thầu (Tutor Request & Bidding):**
  - Học sinh đăng bài tìm gia sư.
  - Gia sư lướt xem danh sách các bài đăng (Job Board) và gửi Báo giá (Apply/Bid).
  - Học sinh duyệt danh sách báo giá và Chấp nhận.
- **Quản lý Lịch học (Schedule Management):**
  - Giao diện Calendar hiển thị trực quan các buổi học (`Session`) sắp tới cho cả 2 bên.
  - Chức năng Điểm danh buổi học cơ bản.

## Giai đoạn 2: Tự động hóa Thanh toán & AI Recommendation
*Mục tiêu: Hoàn thiện tính năng thương mại và áp dụng công nghệ thông minh để tối ưu hóa.*

- **Thanh toán trực tuyến (Payments):**
  - Tích hợp cổng thanh toán (VNPay / PayOS).
  - Tự động thay đổi trạng thái hợp đồng sau khi Webhook từ cổng thanh toán gọi về.
- **Hệ thống Gợi ý AI (AI Recommendation Engine):**
  - Hiển thị danh mục "Gia sư phù hợp nhất với bạn" dựa trên độ tương đồng về lịch rảnh, môn học, budget.
- **Nhắn tin trực tiếp (Chat System):**
  - Tích hợp tính năng Chat (WebSocket) giữa học sinh và gia sư sau khi kết nối thành công.

## Giai đoạn 3: Scale-up & Lớp học Nhóm (Group Class)
*Mục tiêu: Đa dạng hóa mô hình kinh doanh.*

- **Lớp học Nhóm (Group Classes):**
  - Gia sư chủ động tạo các Khóa học dạng Lớp Nhóm (1 gia sư - nhiều học sinh).
  - Học sinh đăng ký tham gia (Enroll).
- **Hệ thống Đánh giá & Báo cáo nâng cao:**
  - Rating, Review hiển thị công khai.
  - Cổng thông tin (Dashboard) thống kê thu nhập hàng tháng cho Gia sư.
  - Quản trị viên (Admin Dashboard) kiểm duyệt hồ sơ và xử lý Report/Khiếu nại.
- **Tích hợp Video Call trực tuyến:**
  - Nhúng hệ thống Video Call (Zoom API hoặc WebRTC) ngay trên nền tảng.
