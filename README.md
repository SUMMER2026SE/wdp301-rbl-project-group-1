This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
edura-web
├─ .agents
│  └─ skills
│     └─ shadcn
│        ├─ agents
│        │  └─ openai.yml
│        ├─ assets
│        │  ├─ shadcn-small.png
│        │  └─ shadcn.png
│        ├─ cli.md
│        ├─ customization.md
│        ├─ evals
│        │  └─ evals.json
│        ├─ mcp.md
│        ├─ rules
│        │  ├─ base-vs-radix.md
│        │  ├─ composition.md
│        │  ├─ forms.md
│        │  ├─ icons.md
│        │  └─ styling.md
│        └─ SKILL.md
├─ AGENTS.md
├─ CLAUDE.md
├─ components.json
├─ eslint.config.mjs
├─ GIT_NAMING_CONVENTION_RULES.md
├─ lib
│  └─ utils.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ rtk-codegen.cjs
├─ scripts
│  └─ generate-api.cjs
├─ skills-lock.json
├─ src
│  ├─ app
│  │  ├─ (private)
│  │  │  ├─ student
│  │  │  │  ├─ courses
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ home
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ layout.tsx
│  │  │  └─ tutor
│  │  │     ├─ home
│  │  │     │  └─ page.tsx
│  │  │     └─ layout.tsx
│  │  ├─ (public)
│  │  │  └─ (auth)
│  │  │     ├─ login
│  │  │     │  └─ page.tsx
│  │  │     └─ register
│  │  │        └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ auth.types.ts
│  │  │  ├─ authApi.ts
│  │  │  ├─ authSlice.ts
│  │  │  ├─ components
│  │  │  │  └─ login-form.tsx
│  │  │  └─ schemas
│  │  │     └─ authSchemas.ts
│  │  └─ landing
│  │     └─ components
│  │        └─ header.tsx
│  ├─ providers
│  │  ├─ app-provider.tsx
│  │  └─ store-provider.tsx
│  └─ shared
│     ├─ components
│     │  ├─ @types
│     │  │  └─ input.ts
│     │  ├─ atoms
│     │  │  ├─ submit-button
│     │  │  │  └─ submit-button.tsx
│     │  │  └─ text-box
│     │  │     ├─ text-box-container.tsx
│     │  │     ├─ text-box-presenter.tsx
│     │  │     ├─ text-box.tsx
│     │  │     └─ type.ts
│     │  ├─ molecules
│     │  │  ├─ menu-button
│     │  │  │  ├─ menu-button.tsx
│     │  │  │  └─ type.ts
│     │  │  ├─ modal
│     │  │  │  ├─ modal-container.tsx
│     │  │  │  ├─ modal-presenter.tsx
│     │  │  │  ├─ modal.tsx
│     │  │  │  └─ type.ts
│     │  │  ├─ notification-popover
│     │  │  │  └─ notification-popover.tsx
│     │  │  ├─ search-box
│     │  │  │  └─ search-box.tsx
│     │  │  ├─ tutor-popover
│     │  │  │  └─ tutor-popover.tsx
│     │  │  └─ user-popover
│     │  │     └─ user-popover.tsx
│     │  ├─ organisms
│     │  │  ├─ input-form
│     │  │  │  ├─ input-form-container.tsx
│     │  │  │  ├─ input-form-presenter.tsx
│     │  │  │  └─ input-form.tsx
│     │  │  └─ navigation-bar
│     │  │     ├─ navigation-bar.tsx
│     │  │     └─ type.ts
│     │  └─ ui
│     │     ├─ accordion.tsx
│     │     ├─ alert-dialog.tsx
│     │     ├─ alert.tsx
│     │     ├─ avatar.tsx
│     │     ├─ badge.tsx
│     │     ├─ button-group.tsx
│     │     ├─ button.tsx
│     │     ├─ card.tsx
│     │     ├─ dialog.tsx
│     │     ├─ input-group.tsx
│     │     ├─ input-otp.tsx
│     │     ├─ input.tsx
│     │     ├─ label.tsx
│     │     ├─ navigation-menu.tsx
│     │     ├─ pagination.tsx
│     │     ├─ popover.tsx
│     │     ├─ separator.tsx
│     │     ├─ sheet.tsx
│     │     ├─ sidebar.tsx
│     │     ├─ skeleton.tsx
│     │     ├─ sonner.tsx
│     │     ├─ spinner.tsx
│     │     ├─ textarea.tsx
│     │     ├─ toggle-group.tsx
│     │     ├─ toggle.tsx
│     │     └─ tooltip.tsx
│     ├─ constants
│     ├─ context
│     │  ├─ modal-context.tsx
│     │  └─ request-correlation-check.tsx
│     ├─ hocs
│     │  ├─ with-form-controller.tsx
│     │  └─ with-modal.tsx
│     ├─ hooks
│     │  └─ use-mobile.ts
│     ├─ lib
│     │  └─ utils.ts
│     ├─ routers
│     ├─ store
│     │  ├─ baseApi.ts
│     │  ├─ hooks.ts
│     │  ├─ storage.ts
│     │  └─ store.ts
│     ├─ types
│     │  ├─ api.ts
│     │  └─ pagination.ts
│     └─ utils
└─ tsconfig.json

```