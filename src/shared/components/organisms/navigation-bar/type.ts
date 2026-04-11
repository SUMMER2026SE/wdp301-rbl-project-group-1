export type NavigationBarItemProps = {
  key: string;
  trigger: React.ReactNode;
  href?: string;
  activePrefix?: string;
  content?: [
    {
      href: string;
      element: React.ReactNode;
    },
  ];
};
export type NavigationBarProps = {
  brand?: React.ReactNode;
  onBrandClick?: () => void;
  onAvatarClick?: () => void;
  menu: NavigationBarItemProps[];
  children?: React.ReactNode;
};
