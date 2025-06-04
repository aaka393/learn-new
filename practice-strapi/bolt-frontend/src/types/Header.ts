export interface MenuItem {
  id: number;
  label: string;
  slug: string;
}

export interface HeaderData {
  title: string;
  menu_items: MenuItem[];
}