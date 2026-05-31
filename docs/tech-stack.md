# Edura Frontend - Tech Stack

Dự án Frontend `edura-web` được xây dựng dựa trên các công nghệ hiện đại, ưu tiên hiệu năng, khả năng bảo trì và trải nghiệm người dùng (UX/UI) cao cấp.

## 1. Core Framework
- **Next.js 16.x (App Router):** Xử lý Server-Side Rendering (SSR), tối ưu hóa SEO và cung cấp cơ chế routing thư mục trực quan.
- **React 19.x:** Tận dụng các hooks và features mới nhất của React để quản lý DOM hiệu quả.
- **TypeScript:** Ràng buộc kiểu dữ liệu chặt chẽ (Strict typing), giảm thiểu bug runtime và cung cấp trải nghiệm Developer Experience (DX) tuyệt vời.

## 2. State Management & API Client
- **Redux Toolkit (RTK):** Quản lý Global State (những state phức tạp dùng chung giữa các component).
- **RTK Query:** Data fetching và caching layer cực kỳ mạnh mẽ. Giao tiếp trực tiếp với OpenAPI/Swagger của Backend thông qua công cụ tự động sinh code (`@rtk-query/codegen-openapi`). Điều này đảm bảo TypeScript types giữa Frontend và Backend luôn đồng bộ 100%.

## 3. Styling & UI Components
- **Tailwind CSS v4:** Utility-first CSS framework với engine mới nhất, giúp build siêu tốc và viết CSS trực tiếp trên class name một cách mạnh mẽ.
- **Shadcn/ui & Radix UI:** Hệ thống component vô hình (Headless UI) cung cấp các component có tính tương tác cao (Modals, Dropdowns, Tabs, Forms...) với khả năng truy cập (Accessibility) hoàn hảo. Có thể custom giao diện thoải mái thông qua Tailwind.
- **Lucide React:** Bộ icon mã nguồn mở, sắc nét và nhẹ.

## 4. Forms & Validation
- **React Hook Form:** Quản lý form state tối ưu, không gây re-render dư thừa.
- **Zod:** Thư viện validation schema. Kết hợp hoàn hảo với React Hook Form qua `@hookform/resolvers` để validate dữ liệu từ Client-side.

## 5. Bổ trợ (Utilities)
- **Date-fns:** Thư viện xử lý ngày giờ (format, tính toán khoảng thời gian) nhẹ và module hóa tốt hơn Moment.js.
- **Sonner:** Thư viện hiển thị thông báo (Toasts/Alerts) mượt mà và đẹp mắt.
- **Zustand (Tùy chọn):** Nếu có nhu cầu quản lý local state nhỏ gọn cho các module tách biệt, có thể linh hoạt sử dụng.
- **Next-themes:** Quản lý chế độ giao diện Dark/Light mode dễ dàng.
