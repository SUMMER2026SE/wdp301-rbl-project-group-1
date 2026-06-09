# Edura Backend

## Tầm nhìn (Vision)
Trở thành nền tảng **Tutoring Marketplace** (Chợ gia sư) hàng đầu, nơi kết nối nhanh chóng, minh bạch và hiệu quả nhất giữa những Học sinh có nhu cầu học tập và những Gia sư có năng lực. Không chỉ là một nền tảng trung gian, Edura định hướng ứng dụng công nghệ **AI Recommendation** để tối ưu hóa việc ghép nối, giúp mỗi học sinh đều tìm được người thầy phù hợp nhất với phong cách học, ngân sách và lịch trình của mình.

Về khía cạnh Kỹ thuật (Technical Vision), Backend của Edura không chỉ là một RESTful API cung cấp dữ liệu CRUD thông thường. Tầm nhìn của dự án là xây dựng một **"Cỗ máy Điều phối" (Orchestration Engine)** mạnh mẽ, có khả năng:

1. **Quản lý Vòng đời Hợp đồng (Lifecycle):** Xử lý mượt mà và tự động hóa toàn bộ quá trình: Tạo yêu cầu (Tutor Request) -> Đấu thầu (Bidding) -> Đặt lịch (Booking) -> Sinh lịch học (Sessions) -> Điểm danh (Attendance).
2. **Kiến trúc Linh hoạt (Resilient Architecture):** Được thiết kế theo chuẩn Clean Architecture kết hợp CQRS (Command Query Responsibility Segregation). Giúp code dễ dàng scale-up, dễ viết Test và có khả năng chịu tải cao trong tương lai.
3. **AI-Ready:** Kiến trúc tách bạch để sẵn sàng giao tiếp bất đồng bộ với các Microservice chuyên biệt về AI (Python FastAPI worker) thông qua Message Broker (RabbitMQ), thực hiện Vector Search để đưa ra gợi ý (Recommendation) chính xác nhất.
