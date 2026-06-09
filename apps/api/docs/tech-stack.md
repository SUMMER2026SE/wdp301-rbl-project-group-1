# Edura Backend - Tech Stack

Dự án Backend `edura-api` sử dụng bộ công nghệ (Tech Stack) mạnh mẽ bậc nhất trong hệ sinh thái Node.js hiện tại, hướng tới hiệu năng cao và kiến trúc doanh nghiệp.

## 1. Core Framework
- **NestJS (v11):** Framework chính cho phép xây dựng ứng dụng theo hướng module hóa, cung cấp Dependency Injection (DI) hoàn hảo, rất phù hợp cho dự án quy mô vừa và lớn.
- **Fastify:** Thay vì dùng Express.js mặc định, dự án sử dụng `platform-fastify` bên dưới NestJS để tăng tốc độ xử lý HTTP Request lên mức tối đa.
- **TypeScript:** Đảm bảo type safety toàn bộ dự án từ đầu đến cuối.

## 2. Architecture & Design Patterns
- **Clean Architecture:** Phân tách rõ ràng các tầng Domain, Application, Infrastructure và Presentation.
- **CQRS (Command Query Responsibility Segregation):** Sử dụng `@nestjs/cqrs` để tách bạch rõ ràng logic Ghi (Command) và Đọc (Query), giúp code base dễ maintain và tối ưu hóa hiệu năng truy vấn.

## 3. Database & ORM
- **PostgreSQL:** Cơ sở dữ liệu quan hệ mạnh mẽ, hỗ trợ extension `pgvector` phục vụ trực tiếp cho các tác vụ AI (Vector similarity search).
- **Prisma ORM (v7.x):** Công cụ tương tác Database type-safe hoàn hảo nhất hiện tại. Dễ dàng thực hiện các thao tác relations phức tạp và quản lý schema bằng file `schema.prisma`.
- **Redis (ioredis):** Sử dụng làm In-memory Cache, lưu trữ OTP, JWT Refresh tokens và Rate Limiting nhằm giảm tải triệt để cho Postgres.

## 4. API Documentation & Validation
- **Swagger / OpenAPI 3.0:** Tự động hóa sinh tài liệu API (được tích hợp sãn thông qua `@nestjs/swagger`). Đây là nguồn Single-source-of-truth cho Frontend kéo Data types về.
- **Zod & nestjs-zod:** Thư viện validation cực mạnh. Đảm bảo dữ liệu từ HTTP Request (Body, Params, Query) được kiểm duyệt nghiêm ngặt (Data transfer validation) trước khi đi vào hệ thống.

## 5. Security & Authentication
- **Passport-JWT & Bcrypt:** Băm mật khẩu và mã hóa Token (Access/Refresh/Reset Tokens).
- **Google OAuth:** Tích hợp trực tiếp thông qua thư viện `google-auth-library`.

## 6. Bổ trợ & Tích hợp (Third-parties)
- **RabbitMQ:** Message broker phục vụ cho giao tiếp bất đồng bộ giữa Node.js và AI Python service.
- **Nodemailer:** Gửi email (OTP, Notifications) kết hợp Handlebars (`nodemailer-express-handlebars`) cho Email templates.
- **Cloudinary / Supabase Storage:** Dịch vụ lưu trữ file, avatar, tài liệu.
- **PayOS:** Tích hợp cổng thanh toán trực tuyến và Webhook.
