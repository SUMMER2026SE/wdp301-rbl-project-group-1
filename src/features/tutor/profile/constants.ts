export const PROFILE_TABS = [
  {
    id: "info",
    label: "Thông tin cá nhân",
    href: "/tutor/profile/information",
    activePrefix: "/tutor/profile/information",
  },
  {
    id: "history",
    label: "Lịch sử giảng dạy",
    href: "/tutor/profile/history",
    activePrefix: "/tutor/profile/history",
  },
  {
    id: "settings",
    label: "Cài đặt tài khoản",
    href: "/tutor/profile/settings",
    activePrefix: "/tutor/profile/settings",
  },
] as const;

export type ProfileTabId = (typeof PROFILE_TABS)[number]["id"];
