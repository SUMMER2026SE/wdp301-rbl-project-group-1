# Edura Frontend - Cấu trúc Kiến trúc (Architecture)

Dự án áp dụng cấu trúc thư mục được lấy cảm hứng từ **Feature-Sliced Design (FSD)** nhưng đã được tinh giản lại để phù hợp và dễ tiếp cận hơn với Next.js App Router.

Mục tiêu chính của kiến trúc này là **Tách biệt mối quan tâm (Separation of Concerns)**: Code liên quan đến tính năng (Feature) nào sẽ nằm trọn trong thư mục của tính năng đó, tránh việc phải nhảy qua nhảy lại giữa nhiều thư mục gốc xa lạ.

## Cấu trúc thư mục (Directory Structure)

```text
src/
├── app/                  # Chứa hệ thống Routing của Next.js
│   ├── (auth)/           # Các route liên quan đến xác thực (Login, Register...)
│   ├── (private)/        # Các route yêu cầu đăng nhập (Dashboard, Profile...)
│   │   ├── student/      # Layout và pages dành riêng cho Học sinh
│   │   └── tutor/        # Layout và pages dành riêng cho Gia sư
│   ├── api/              # (Tùy chọn) Next.js Route handlers
│   └── layout.tsx        # Root layout chung toàn app
│
├── features/             # Nơi chứa logic NGHIỆP VỤ (Business Logic) chia theo tính năng
│   ├── auth/             # Logic đăng nhập, quên mật khẩu, phân quyền
│   ├── booking/          # Logic tạo booking, đấu thầu, đặt lịch
│   ├── student/          # Logic quản lý profile học sinh, lịch học học sinh
│   └── tutor/            # Logic quản lý profile gia sư, lịch dạy, portfolio
│       ├── components/   # UI component ĐẶC THÙ chỉ dùng cho tính năng này
│       ├── hooks/        # Custom hooks liên quan đến tính năng
│       ├── slices/       # Redux slices (nếu có state phức tạp)
│       └── utils/        # Helper functions riêng của tính năng
│
├── shared/               # Nơi chứa các thành phần DÙNG CHUNG toàn dự án
│   ├── api/              # Cấu hình RTK Query, Axios Base (nếu có)
│   ├── components/       # Các UI Component cơ bản (Atoms, Molecules)
│   │   ├── ui/           # Components từ Shadcn (Button, Input, Dialog...)
│   │   ├── atoms/        # Các thành phần nhỏ giọt (TextBox, Icon...)
│   │   └── organisms/    # Các khối UI lớn (InputForm, Header, Footer)
│   ├── constants/        # Hằng số (Enums, URL paths, config)
│   ├── hooks/            # Custom hooks dùng chung (useWindowSize, useAuth...)
│   └── types/            # TypeScript interfaces/types chung
│
└── providers/            # Các Provider bọc ngoài ứng dụng (Redux, Theme, Toast...)
```

## Các nguyên tắc quy định (Rules)
1. **App layer:** Thư mục `app/` chỉ nên chứa phần khung (`layout.tsx`, `page.tsx`) và gọi các Component logic ở phần `features/`. KHÔNG viết logic gọi API phức tạp trực tiếp trong `page.tsx`.
2. **Features layer:** Một feature KHÔNG được quyền import trực tiếp từ một feature khác để tránh vòng lặp phụ thuộc (Circular Dependency). Nếu 2 feature cần giao tiếp, hãy đẩy phần logic đó xuống `shared/`.
3. **Shared layer:** Tuyệt đối không được import code từ thư mục `features/` ngược xuống thư mục `shared/`. `shared` phải luôn "ngu" và độc lập với nghiệp vụ.
4. **RTK Query Auto-generation:** Sử dụng script `npm run generate:api` để tự động kéo Swagger JSON từ Backend về và sinh ra các hooks như `useGetTutorsQuery()`, `useCreateBookingMutation()`. Các file sinh ra này được lưu ở `shared/api/`.
