export const PROFILE_TABS = [
  {
    id: "info",
    label: "Thông tin cá nhân",
    href: "/student/profile/information",
    activePrefix: "/student/profile/information",
  },
  {
    id: "history",
    label: "Lịch sử học tập",
    href: "/student/profile/history",
    activePrefix: "/student/profile/history",
  },
  {
    id: "settings",
    label: "Cài đặt tài khoản",
    href: "/student/profile/settings",
    activePrefix: "/student/profile/settings",
  },
] as const;

export type ProfileTabId = (typeof PROFILE_TABS)[number]["id"];
