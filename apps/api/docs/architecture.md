# Edura Backend - Cấu trúc Kiến trúc (Architecture)

Edura Backend được triển khai dựa trên **Clean Architecture** và thiết kế theo hướng **Domain-Driven Design (DDD)**. Khác với cách thiết kế MVC (Model-View-Controller) truyền thống, kiến trúc này đặt "Domain" (Nghiệp vụ cốt lõi) ở trung tâm và các công nghệ giao tiếp như Database hay HTTP API nằm ở các lớp vòng ngoài.

Kết hợp với đó là pattern **CQRS (Command Query Responsibility Segregation)** phân định rõ ràng quá trình đọc và ghi dữ liệu, một yếu tố cực kỳ quan trọng giúp code không bị "spaghetti" khi các luồng như Booking/Bidding ngày càng phức tạp.

## Cấu trúc thư mục (Directory Structure)

```text
src/
├── modules/              # Chứa các Business Modules (Auth, User, Booking, Tutor...)
│   └── [module-name]/
│       ├── domain/       # Tầng trung tâm: Định nghĩa Entities, Enums, Interfaces. KHÔNG chứa logic framework.
│       ├── application/  # Tầng ứng dụng: Định nghĩa Use Cases. Chia làm Commands và Queries (CQRS).
│       ├── infrastructure/# Tầng hạ tầng: Triển khai các Interface ở Domain. Kết nối Database (Prisma), Cache (Redis), APIs ngoài.
│       └── presentation/ # Tầng giao tiếp: Chứa Controllers xử lý HTTP request/response, Swagger decorators.
│
├── shared/               # Nơi chứa mã dùng chung toàn bộ dự án
│   ├── application/      # Interfaces, Constants, Types dùng chung
│   ├── domain/           # Core Entities, Base Exceptions, Shared Enums
│   ├── infrastructure/   # Database Connections, Redis Service, Configs, Logger
│   └── presentation/     # Global Guards (Auth, Role, Throttler), Filters (Error Handling), Interceptors
│
└── main.ts               # Entry point khởi tạo NestJS + Fastify App
```

## Giải thích luồng dữ liệu CQRS
1. **Request vào (Presentation):** Client gọi API qua `[module].controller.ts` (ví dụ: `POST /bookings`).
2. **Kiểm tra dữ liệu (Validation):** Dữ liệu DTO được kiểm tra định dạng thông qua `Zod` Validation Pipe.
3. **Dispatcher (Application):** Controller không chứa logic, nó chỉ "đẩy" dữ liệu vào `CommandBus` hoặc `QueryBus`.
4. **Xử lý nghiệp vụ (Application Handlers):** Các `Handler` (ví dụ: `create-booking.handler.ts`) bắt lấy Command. Nó sẽ kéo dữ liệu từ `Repository`, thực thi các quy tắc nghiệp vụ trên `Entity`, rồi yêu cầu `Repository` lưu xuống DB.
5. **Giao tiếp DB (Infrastructure):** `RepositoryImpl` (dùng Prisma) sẽ chính thức cập nhật database.

## Ưu điểm của Kiến trúc này:
- **Testable:** Logic nghiệp vụ (Handlers/Entities) hoàn toàn tách biệt khỏi Framework. Bạn có thể Mock Repository để Unit Test cực kỳ dễ dàng.
- **Maintainable:** Bất kỳ Module nào phình to (như hệ thống Booking) đều không làm ảnh hưởng đến Module khác (như Auth).
- **Scalable:** Khi sau này muốn bóc tách một tính năng (ví dụ Chat) ra thành Microservice riêng biệt, kiến trúc Module hóa này giúp bạn bê nguyên thư mục đó ra ngoài mà không gặp nhiều trở ngại.
