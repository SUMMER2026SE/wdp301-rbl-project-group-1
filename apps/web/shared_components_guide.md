# Shared Components — Edura FE

> **Đường dẫn gốc:** `src/shared/components/`  
> **Kiến trúc:** Atomic Design (ui → atoms → molecules → organisms)

---

## Tổng quan kiến trúc

```
shared/components/
├── @types/         ← Shared TypeScript types cho input system
├── ui/             ← Primitives (shadcn/radix), KHÔNG dùng trực tiếp trong feature
├── atoms/          ← Đơn vị UI nhỏ nhất, có thể tái sử dụng độc lập
├── molecules/      ← Kết hợp nhiều atoms, có logic nhỏ
└── organisms/      ← Các block phức tạp, thường quản lý state/context
```

### Quy tắc sử dụng
1. **Ưu tiên** dùng `atoms/`, `molecules/`, `organisms/` thay vì dùng thẳng `ui/`
2. Các component trong `ui/` là primitive được wrap bởi layers trên — chỉ dùng `ui/` khi cần customize sâu mà layers trên chưa hỗ trợ
3. Import path luôn dùng alias `@/src/shared/components/...`

---

## Pattern kiến trúc Component

Nhiều components theo pattern **Container / Presenter**:

```
ComponentName.tsx          ← Entry point, thường wrap HOC (withFormController)
ComponentName-container.tsx ← Logic layer (state, context consumption)
ComponentName-presenter.tsx ← Pure UI layer (không có logic)
type.ts                    ← TypeScript interfaces
```

### HOC `withFormController`

Form atoms (`TextBox`, `SelectBox`, `CheckboxField`) được wrap bởi `withFormController`. HOC này tự inject `field` và `fieldState` từ `react-hook-form` Controller.

```tsx
// HOC tự inject các props react-hook-form, bạn chỉ cần truyền "name" + metadata
<TextBox
  name="email"           // ← name field trong form schema
  label="Email"
  placeholder="Enter email"
  type="email"
  icon="email"           // ← material-symbols icon name, hoặc ReactNode
/>
```

> **Lưu ý:** TextBox, SelectBox, CheckboxField phải được dùng bên trong `<InputForm>` (có `FormProvider`).

---

## @types/input.ts — Base Types

Các types dùng chung cho toàn bộ input system:

| Type | Mô tả |
|------|-------|
| `InputComponentMetaData` | Base type: `{ id, name, label?, type?, placeholder?, default?, validation? }` |
| `Option` | `{ label: string; value: string \| number }` — dùng cho Select, Checkbox |
| `InputFieldDetail` | Union type của tất cả input types |
| `InputFormContainerProps<TForm>` | Props cho `InputForm` organism |
| `ValidationsType` | Record các rule validation (`Required`, `MaxLength`, `FileSize`, `Regex`…) |

---

## LAYER 1 — Atoms

### `Avatar`
**Import:** `@/src/shared/components/atoms/avatar/avatar`

```tsx
<Avatar
  src={user.avatarUrl}     // string | null | undefined
  fallback={user.fullName} // ← tự tạo initials (e.g. "Nguyen Van A" → "NV")
  size="md"                // "xs"|"sm"|"md"|"lg"|"xl"|"2xl"|"3xl"
  status="online"          // "online"|"offline"|"busy"|"away"
  showStatus={true}        // hiện indicator dot
  className="..."          // override wrapper class
/>
```

**Sizes:** `xs`=24px, `sm`=32px, `md`=40px, `lg`=64px, `xl`=80px, `2xl`=128-160px, `3xl`=160-192px

---

### `TextBox`
**Import:** `@/src/shared/components/atoms/text-box/text-box`  
**Yêu cầu:** Phải dùng trong `<InputForm>` (FormProvider context)

```tsx
<TextBox
  name="fullName"           // ← field name trong Zod schema
  label="Họ và tên"
  placeholder="Nhập họ và tên"
  type="text"               // html input type
  icon="person"             // material-symbols string hoặc <ReactNode />
  className="col-span-2"   // wrapper div class
  inputClassName="h-14"    // input element class
/>
```

**Props quan trọng (`TextBoxPresenterProps`):**
- `icon`: Nếu là `string` → dùng `material-symbols-outlined`; nếu là `ReactNode` → render trực tiếp
- `error`: tự inject từ react-hook-form fieldState

---

### `SelectBox`
**Import:** `@/src/shared/components/atoms/select-box/select-box`  
**Yêu cầu:** Phải dùng trong `<InputForm>`

```tsx
const options = [
  { label: "Toán học", value: "math" },
  { label: "Vật lý",   value: "physics" },
];

<SelectBox
  name="subject"
  label="Môn học"
  placeholder="Chọn môn học"
  options={options}
  className="..."
  triggerClassName="h-14"
/>
```

---

### `CheckboxField`
**Import:** `@/src/shared/components/atoms/checkbox-field/checkbox-field`  
**Yêu cầu:** Phải dùng trong `<InputForm>`

```tsx
<CheckboxField
  name="agreeTerms"
  id="agreeTerms"
  label="Điều khoản"
>
  Tôi đồng ý với <Link href="/terms">điều khoản sử dụng</Link>
</CheckboxField>
```

---

### `SubmitButton`
**Import:** `@/src/shared/components/atoms/submit-button/submit-button`  
**Dùng:** Nút submit trong form, tự hiện `<Spinner>` khi loading

```tsx
<SubmitButton isLoading={isPending}>
  Đăng ký
</SubmitButton>
```

---

### `TabNav`
**Import:** `@/src/shared/components/atoms/tab-nav/tab-nav`  
**Dùng:** Tab điều hướng dạng link (Next.js `<Link>`)

```tsx
const tabs: TabNavItem[] = [
  { label: "Tổng quan", href: "/course/1", isActive: true },
  { label: "Bài học",   href: "/course/1/lessons", isActive: false },
];

<TabNav tabs={tabs} />
```

---

### `SkillsBadges`
**Import:** `@/src/shared/components/atoms/skills-badge/skills-badges`

```tsx
<SkillsBadges
  skills={["React", "TypeScript", "NestJS"]}
  className="mt-4"
/>
```

---

### `ProgressCircle`
**Import:** `@/src/shared/components/atoms/progress-circle/progress-circle`  
**Dùng:** Hiển thị tiến độ học tập dạng vòng tròn SVG (hardcoded text "Hoàn thành", "Tiếp tục bài học")

```tsx
<ProgressCircle
  progress={65}              // 0-100
  completedLessons={13}
  totalLessons={20}
/>
```

---

### `PriceRangeSlider`
**Import:** `@/src/shared/components/atoms/price-range-slider/price-range-slider`  
**Dùng:** Slider 2 đầu để lọc giá (VND)

```tsx
const [priceRange, setPriceRange] = useState({ min: 50000, max: 500000 });

<PriceRangeSlider
  min={priceRange.min}
  max={priceRange.max}
  onChange={(min, max) => setPriceRange({ min, max })}
  sliderMin={50000}      // giá trị nhỏ nhất của slider
  sliderMax={1000000}    // giá trị lớn nhất
  step={50000}
  minLabel="Từ:"         // mặc định "Từ:"
  maxLabel="Đến:"        // mặc định "Đến:"
/>
```

---

## LAYER 2 — Molecules

### `Modal`
**Import:** `@/src/shared/components/molecules/modal/modal`  
**Yêu cầu:** Phải wrap trong `ModalProvider` (HOC `WithModal`)

```tsx
// Modal tự quản lý open/close state qua ModalContext
<Modal
  trigger={<Button>Mở modal</Button>}  // element kích hoạt
  title="Xác nhận"
  description="Bạn có chắc không?"
  confirmText="Xác nhận"               // nếu bỏ qua → không hiện nút confirm
  cancelText="Hủy"
  formId="input-form"                  // form id để submit button trigger
>
  {/* Form content */}
  <InputForm ...>
    ...
  </InputForm>
</Modal>
```

**Cơ chế:**
- `open` / `isSubmitting` lấy từ `useModalContext()`
- Nút "Xác nhận" có `type="submit" form={formId}` — tự submit form khi click
- Nút "Hủy" tự `closeModal()`

> ⚠️ Nếu dùng Modal mà không có `ModalProvider`, sẽ throw: `"Modal must be used within ModalProvider"`

---

### `FormField`
**Import:** `@/src/shared/components/molecules/form-field/form-field`  
**Dùng:** Wrapper react-hook-form Controller với render prop pattern

```tsx
// Dùng khi cần custom input KHÔNG phải TextBox/SelectBox
<FormField<FormSchema, "fieldName">
  name="fieldName"
  render={({ field, fieldState }) => (
    <FormFieldWrapper
      label="Label"
      error={fieldState.error?.message}
    >
      <CustomInput {...field} />
    </FormFieldWrapper>
  )}
/>
```

### `FormFieldWrapper`
**Import:** `@/src/shared/components/molecules/form-field/form-field-wrapper`  
**Dùng:** Layout wrapper cho custom form fields (label + children + error message)

```tsx
<FormFieldWrapper
  label="Tiêu đề"
  error={errors.title?.message}
  className="col-span-2"
>
  <Textarea ... />
</FormFieldWrapper>
```

---

### `Pagination`
**Import:** `@/src/shared/components/molecules/pagination/pagination`  
**Client component.** Tự ẩn nếu `totalPages <= 1`. Có ellipsis thông minh.

```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(newPage) => setPage(newPage)}
  className="mt-6"
/>
```

---

### `SearchBox`
**Import:** `@/src/shared/components/molecules/search-box/search-box`  
**Client component.** Extends `InputHTMLAttributes<HTMLInputElement>`, hỗ trợ `ref`.

```tsx
<SearchBox
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Tìm kiếm gia sư..."
  icon={<Filter className="size-4" />}  // override icon mặc định (Search icon)
  className="w-64"
/>
```

---

### `SortSelect`
**Import:** `@/src/shared/components/molecules/sort-select/sort-select`  
**Client component.** Có default options sắp xếp (rating, price-low, price-high, experience).

```tsx
const [sort, setSort] = useState("rating");

<SortSelect
  value={sort}
  onChange={setSort}
  options={[              // override default options nếu cần
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
  ]}
  className="ml-auto"
/>
```

---

### `StatBadge`
**Import:** `@/src/shared/components/molecules/stat-badge/stat-badge`  
**Dùng:** Hiển thị 1 metric với icon + value + label (ví dụ: số học viên, rating)

```tsx
import { Users } from "lucide-react";

<StatBadge
  icon={<Users className="size-5" />}
  iconBgColor="bg-blue-500/20"    // mặc định "bg-info/20"
  iconColor="text-blue-500"       // mặc định "text-info"
  value={1240}
  label="Học viên"
  subtext="người"                 // text nhỏ sau value (optional)
/>
```

---

## LAYER 3 — Organisms

### `InputForm`
**Import:** `@/src/shared/components/organisms/input-form/input-form`  
**Dùng:** Form wrapper tích hợp `react-hook-form` + `zodResolver`

```tsx
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

<InputForm<FormValues>
  id="login-form"              // ← form id (dùng cho Modal's confirmText button)
  resolver={zodResolver(schema)}
  defaultValues={{ email: "", password: "" }}
  onSubmit={(data) => handleLogin(data)}
  className="space-y-4"
>
  <TextBox name="email" label="Email" type="email" />
  <TextBox name="password" label="Mật khẩu" type="password" />
  <SubmitButton isLoading={isPending}>Đăng nhập</SubmitButton>
</InputForm>
```

**Tự động cung cấp:**
- `FormProvider` (react-hook-form context) cho toàn bộ children
- `RequestCorrelationCheckProvider` (context kiểm tra duplicate request)

---

### `MultiStepFormContainer`
**Import:** `@/src/shared/components/organisms/multi-step-form/multi-step-form-container`  
**Client component.** Quản lý state `currentStep`.

```tsx
const steps: MultiStepFormStepConfig[] = [
  {
    title: "Thông tin cá nhân",
    content: ({ onNext, onPrevious }) => (
      <PersonalInfoStep onNext={onNext} />
    ),
    sidebar: <PersonalInfoSidebar />,   // optional
  },
  {
    title: "Chuyên môn",
    content: ({ onNext, onPrevious }) => (
      <ExpertiseStep onNext={onNext} onPrevious={onPrevious} />
    ),
  },
];

<MultiStepFormContainer
  title="Đăng ký gia sư"
  steps={steps}
/>
```

**Layout:** Stepper bar ở trên, content bên trái (2/3), sidebar bên phải (1/3) trên màn hình `lg+`.

---

### `NavigationBar`
**Import:** `@/src/shared/components/organisms/navigation-bar/navigation-bar`  
**Client component.** Responsive: desktop hiện full menu, mobile hiện `MenuButton` (hamburger).

```tsx
import NavigationBar from "@/src/shared/components/organisms/navigation-bar/navigation-bar";

<NavigationBar
  menu={navigationItems}       // NavigationMenuItem[] (xem type.ts)
  brand={<Logo />}             // ReactNode cho logo/brand
  onBrandClick={() => router.push("/")}
  onAvatarClick={() => {}}     // chỉ dùng khi KHÔNG có brand
>
  {/* Children hiện ở cuối nav trên desktop */}
  <NotificationPopover />
  <UserPopover />
</NavigationBar>
```

---

### `ScheduleCalendar`
**Import:** `@/src/shared/components/organisms/schedule-calendar/schedule-calendar`  
**Dùng:** Hiển thị lịch học và quản lý thời gian rảnh cố định. Hỗ trợ 2 chế độ: `weekly` (xem lịch theo tuần) và `fixed` (chỉnh sửa lịch rảnh cố định T2-CN).

```tsx
import { ScheduleCalendar } from "@/src/shared/components/organisms/schedule-calendar/schedule-calendar";

// 1. Chế độ Weekly (Hiển thị lưới lịch học hàng tuần, chỉ xem)
<ScheduleCalendar
  mode="weekly"
  classes={scheduleClasses}              // Mảng ScheduleClass[]
  selectedFilter="all"                   // Lọc theo subject/class
  getClassesForDate={getClassesForDate}  // Hàm map data theo ngày
  onClassClick={(cls) => console.log(cls)}
/>

// 2. Chế độ Fixed (Tương tác bật/tắt lịch rảnh cố định)
<ScheduleCalendar
  mode="fixed"
  initialAvailableSlots={{ "0_08:00": true, "2_14:00": true }} // 0 = Thứ 2, 6 = CN
  onAvailableSlotsChange={(slots) => setFixedSlots(slots)}
  getClassesForDate={getFixedClassesForDate} // Hàm map data theo thứ trong tuần
  classes={scheduleClasses}                  // Render lớp học cố định đè lên trên
/>

// 3. Chế độ Fixed Readonly (Chỉ xem lịch rảnh của người khác, e.g. Student xem Tutor)
<ScheduleCalendar
  mode="fixed"
  readonly={true}
  initialAvailableSlots={tutorFixedSlots}
  getClassesForDate={getFixedClassesForDate}
  classes={tutorClasses}
/>
```

**Đặc điểm nổi bật:**
- Tự động chia ca (Sáng: 7h-12h, Chiều: 13h-18h, Tối: 18h-23h).
- Ở chế độ `fixed`, ô bị bận sẽ có **họa tiết sọc chéo** trực quan để dễ phân biệt với ô rảnh (màu trắng).
- Dùng chung cho cả Tutor và Student thông qua các wrapper riêng biệt (`features/.../components/schedule-calendar`).

---

## Hướng dẫn tạo Feature Form (Pattern chuẩn)

Ví dụ: Form đăng ký trong một feature modal:

```tsx
// features/my-feature/components/my-feature-modal.tsx
"use client";

import Modal from "@/src/shared/components/molecules/modal/modal";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import SelectBox from "@/src/shared/components/atoms/select-box/select-box";
import SubmitButton from "@/src/shared/components/atoms/submit-button/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  category: z.string().min(1, "Chọn danh mục"),
});

type FormValues = z.infer<typeof schema>;

export function MyFeatureModal() {
  const { mutate, isPending } = useCreateSomething();

  const handleSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <Modal
      trigger={<Button>Tạo mới</Button>}
      title="Tạo nội dung mới"
      description="Điền thông tin bên dưới"
      confirmText="Tạo"
      formId="my-feature-form"
    >
      <InputForm<FormValues>
        id="my-feature-form"
        resolver={zodResolver(schema)}
        defaultValues={{ title: "", category: "" }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <TextBox name="title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
        <SelectBox
          name="category"
          label="Danh mục"
          options={categoryOptions}
          placeholder="Chọn danh mục"
        />
      </InputForm>
    </Modal>
  );
}
```

> ⚠️ Modal phải được bọc trong `ModalProvider` ở component cha. Xem `WithModal` HOC.

---

## Quick Reference Table

| Component | Layer | Client? | Cần context? | Import path |
|-----------|-------|---------|-------------|-------------|
| `Avatar` | atom | ❌ | ❌ | `atoms/avatar/avatar` |
| `TextBox` | atom | ❌ | FormProvider | `atoms/text-box/text-box` |
| `SelectBox` | atom | ❌ | FormProvider | `atoms/select-box/select-box` |
| `CheckboxField` | atom | ❌ | FormProvider | `atoms/checkbox-field/checkbox-field` |
| `SubmitButton` | atom | ❌ | ❌ | `atoms/submit-button/submit-button` |
| `TabNav` | atom | ❌ | ❌ | `atoms/tab-nav/tab-nav` |
| `SkillsBadges` | atom | ❌ | ❌ | `atoms/skills-badge/skills-badges` |
| `ProgressCircle` | atom | ❌ | ❌ | `atoms/progress-circle/progress-circle` |
| `PriceRangeSlider` | atom | ✅ | ❌ | `atoms/price-range-slider/price-range-slider` |
| `Modal` | molecule | ❌ | ModalProvider | `molecules/modal/modal` |
| `FormField` | molecule | ❌ | FormProvider | `molecules/form-field/form-field` |
| `FormFieldWrapper` | molecule | ✅ | ❌ | `molecules/form-field/form-field-wrapper` |
| `Pagination` | molecule | ✅ | ❌ | `molecules/pagination/pagination` |
| `SearchBox` | molecule | ✅ | ❌ | `molecules/search-box/search-box` |
| `SortSelect` | molecule | ✅ | ❌ | `molecules/sort-select/sort-select` |
| `StatBadge` | molecule | ❌ | ❌ | `molecules/stat-badge/stat-badge` |
| `InputForm` | organism | ❌ | ❌ (tự tạo) | `organisms/input-form/input-form` |
| `MultiStepFormContainer` | organism | ✅ | ❌ | `organisms/multi-step-form/multi-step-form-container` |
| `NavigationBar` | organism | ✅ | ❌ | `organisms/navigation-bar/navigation-bar` |
| `ScheduleCalendar` | organism | ✅ | ❌ | `organisms/schedule-calendar/schedule-calendar` |
