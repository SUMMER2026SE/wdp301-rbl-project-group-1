# 🚀 Frontend AI Instruction – Edura Web

## 🧠 Overview

You are a **senior frontend engineer** working on a **Next.js App Router project**.

Tech stack:

* Next.js (App Router)
* TypeScript (strict mode)
* Feature-based architecture
* Atomic Design (atoms → molecules → organisms)
* Redux Toolkit + RTK Query
* shadcn/ui + TailwindCSS

⚠️ You MUST follow all rules below when generating or modifying code.

---

## 🏗️ Architecture Rules

### 1. Feature-based structure

* All business logic MUST live inside `src/features`
* Each feature is self-contained:

  * API (RTK Query)
  * slice (state)
  * types
  * components (feature-specific)

Example:

```
src/features/auth/
```

---

### 2. Shared layer

Use `src/shared` ONLY for reusable logic:

* components → reusable UI (atomic design)
* hooks → shared hooks
* hocs → higher-order components
* context → global context
* store → Redux base config
* utils → helper functions
* types → shared types

❌ DO NOT put business logic here
❌ DO NOT create feature-specific code here

---

### 3. App Router structure

Pages must be placed in:

```
src/app/
```

Rules:

* `(public)` → unauthenticated pages
* `(private)` → authenticated pages
* Separate layout by role (student, tutor)

Page responsibility:

* Call hooks
* Render UI components

❌ NO business logic in pages
❌ NO API calls in pages

---

## 🧩 Component Design

### Atomic Design (STRICT)

All reusable UI must follow:

* atoms → smallest UI (button, input)
* molecules → combine atoms
* organisms → complex UI blocks

Location:

```
src/shared/components/
```

---

### Container / Presenter Pattern

For complex components:

* container → logic (hooks, state, API)
* presenter → UI only

Example:

```
modal/
  modal-container.tsx
  modal-presenter.tsx
```

---

### Component Rules

* NEVER mix UI and business logic
* UI components must be reusable
* Prefer composition over inheritance
* Keep components small and focused

---

## 🎨 UI Rules (shadcn)

* Always use components from:

```
src/shared/components/ui
```

* DO NOT rewrite existing components
* Extend using composition

Styling:

* Use Tailwind CSS only
* Follow existing patterns
* Avoid inline styles

---

## 🔄 State Management

### Redux Toolkit

Global store:

```
src/shared/store/
```

Rules:

* Use RTK Query for API calls
* Use slice ONLY for client state
* Keep state minimal and normalized

---

### RTK Query

* APIs must be defined inside feature folder
* Use shared `baseApi`

Example:

```
authApi.ts
```

❌ DO NOT call fetch/axios directly in components

---

## 📦 Forms

* Use schema validation (Zod or similar)
* Place schemas in:

```
feature/schemas/
```

* Use HOC:

```
with-form-controller
```

---

## 🔐 Authentication

* All auth logic must be inside:

```
src/features/auth
```

* Use `(private)` route group
* Do NOT hardcode auth logic in components

---

## ⚙️ Naming Convention

* Folder: kebab-case
* File: kebab-case.tsx
* Types: *.types.ts
* Hooks: use-*.ts
* Slice: *.slice.ts
* API: *.api.ts

---

## 🚫 Anti-patterns (FORBIDDEN)

* ❌ API calls inside components
* ❌ Business logic in shared/
* ❌ Duplicate UI components
* ❌ Mixing container and presenter
* ❌ Accessing store without hooks
* ❌ Putting logic inside pages

---

## ✅ Best Practices

* Write clean, scalable TypeScript
* Use reusable components
* Keep feature isolation
* Prefer composition over duplication
* Extract logic into hooks
* Maintain clear separation of concerns

---

## 🧪 Code Generation Rules (IMPORTANT)

When generating code, ALWAYS:

1. Place code in correct layer (feature/shared/app)
2. Follow atomic design
3. Use existing UI components (shadcn)
4. Use RTK Query for API
5. Separate container & presenter if needed
6. Keep code consistent with existing structure

---

## 🧭 Mental Model

* features = business logic
* shared = reusable building blocks
* app = routing layer
* UI = pure presentation
* logic = hooks / containers

---

## 🎯 Goal

Produce code that is:

* Scalable
* Maintainable
* Consistent with the existing architecture
* Easy to extend

---

## 🔥 Priority Order (when in doubt)

1. Follow architecture
2. Follow atomic design
3. Reuse existing components
4. Keep logic separated
5. Keep code simple and clean
