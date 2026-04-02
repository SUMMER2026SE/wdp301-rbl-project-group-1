# GIT NAMING CONVENTION

Tài liệu quy định quy tắc đặt tên Branch và Commit message cho dự án. Yêu cầu tất cả thành viên tuân thủ để đảm bảo tính nhất quán và hỗ trợ tốt cho việc tracking, automation (CI/CD).

## 1. BRANCH NAME (Tên nhánh)

### Cấu trúc (Syntax)
> **prefix/issue-id-short-description**

* **prefix**: Loại công việc (xem danh sách bên dưới).
* **issue-id**: Mã ticket từ hệ thống quản lý (Jira, Linear, Trello...). Ví dụ: `EDU-01`.
* **short-description**: Mô tả ngắn gọn, viết thường, ngăn cách bởi dấu gạch ngang (`-`).

### Danh sách Prefix cho Branch

| Prefix | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| **feat** | Phát triển tính năng mới | `feat/EDU-01-login-page` |
| **fix** | Sửa lỗi (bug) trong quá trình dev/test | `fix/EDU-12-submit-button-error` |
| **hotfix** | Sửa lỗi gấp trên môi trường Production | `hotfix/EDU-99-payment-crash` |
| **style** | Chỉnh sửa UI/UX, format code (không đổi logic) | `style/EDU-45-update-brand-color` |
| **refactor** | Tối ưu code, tái cấu trúc (không đổi logic) | `refactor/EDU-30-user-controller` |
| **conf** | Thay đổi cấu hình, biến môi trường, setup | `conf/EDU-60-update-env-vars` |
| **deployed** | Cấu hình build, CI/CD, Docker | `deployed/EDU-88-upgrade-docker` |
| **docs** | Thêm/sửa tài liệu dự án | `docs/EDU-05-api-documentation` |

### Quy tắc bổ sung
1.  Luôn viết thường toàn bộ (lowercase).
2.  Không sử dụng tiếng Việt có dấu, ký tự đặc biệt (ngoại trừ `-` và `/`).
3.  Không đặt tên branch quá dài, chỉ lấy ý chính.

---

## 2. COMMIT MESSAGE (Nội dung Commit)

### Cấu trúc (Syntax)
> **prefix(issue-id): description**

* **prefix**: Giống với prefix của Branch.
* **issue-id**: Mã ticket, đặt trong dấu ngoặc đơn `()`.
* **description**: Mô tả thay đổi. Có 1 khoảng trắng sau dấu hai chấm `:`.

### Các trường hợp thực tế và Ví dụ

#### A. Feature (Tính năng mới)
Sử dụng khi thêm chức năng, màn hình, logic mới.
* `feat(EDU-01): init login screen layout`
* `feat(EDU-01): integrate authentication api`

#### B. Bug Fix (Sửa lỗi)
Sử dụng khi fix bug thông thường (Dev/QA environment).
* `fix(EDU-12): handle null exception on user profile`
* `fix(EDU-12): correct date format display`

#### C. Hotfix (Lỗi nghiêm trọng)
Sử dụng cho các lỗi trên Production cần merge gấp.
* `hotfix(EDU-99): fix payment gateway timeout`

#### D. Style (Giao diện/Format)
Sử dụng cho thay đổi CSS, format code, indent, xóa khoảng trắng thừa.
* `style(EDU-45): update primary button color`
* `style(EDU-45): format code with prettier`

#### E. Refactor (Tái cấu trúc)
Sử dụng khi sửa code cho sạch hơn, tách hàm, tối ưu hiệu năng mà không thay đổi tính năng.
* `refactor(EDU-30): extract validation logic to utils`
* `refactor(EDU-30): remove unused variables`

#### F. Configuration (Cấu hình dự án)
Sử dụng cho các thay đổi file config, biến môi trường, hằng số hệ thống.
* `conf(EDU-60): update base url in .env`
* `conf(EDU-60): add new constants for app settings`

#### G. Deployment / CI
Sử dụng khi thay đổi liên quan đến quy trình build, Docker, CI/CD.
* `deployed(EDU-88): upgrade node version to 18`
* `deployed(EDU-88): add build script for staging`

#### H. Documentation (Tài liệu)
Sử dụng khi viết README, Swagger, Wiki.
* `docs(EDU-05): update installation guide`
* `docs(EDU-05): fix typo in api description`

### Quy tắc bổ sung
1.  **Imperative mood**: Dùng động từ ở thể mệnh lệnh (Ví dụ: "add" thay vì "added" hay "adding").
2.  Mô tả ngắn gọn, đi thẳng vào vấn đề.
3.  Luôn phải có Issue ID để link với hệ thống quản lý task (Jira).