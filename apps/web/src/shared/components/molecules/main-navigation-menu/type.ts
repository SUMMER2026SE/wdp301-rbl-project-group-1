export type MainNavigationMenuItem = {
  key: string;
  trigger: React.ReactNode;
  href?: string;
  activePrefix?: string;
  content?: Array<{
    href: string;
    element: React.ReactNode;
  }>;
};

export type MainNavigationMenuProps = {
  menu: MainNavigationMenuItem[];
  className?: string;
  listClassName?: string;
  activeClassName?: string;
  itemClassName?: string;
};
