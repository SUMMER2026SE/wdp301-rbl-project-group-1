export type MenuButtonItemProps = {
  key: string;
  trigger: React.ReactNode;
  href?: string;
  content?: [
    {
      href: string;
      element: React.ReactNode;
    },
  ];
};
export type MenuButtonProps = {
  onAvatarClick?: () => void;
  menu: MenuButtonItemProps[];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
