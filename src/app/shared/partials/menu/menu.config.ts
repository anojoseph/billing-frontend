export interface MenuItem {
  label: string;
  icon: string;
  roles: string[];
  children: {
    label: string;
    route: string;
    roles: string[];
  }[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Menu',
    icon: 'fa-solid fa-list',
    roles: ['admin', 'superadmin'],
    children: [
      { label: 'Menu List', route: '', roles: ['admin', 'superadmin'] },
    ]
  },
  {
    label: 'Product',
    icon: 'fa-solid fa-store',
    roles: ['admin', 'superadmin'],
    children: [
      { label: 'Product', route: '/admin/product/product', roles: ['admin', 'superadmin'] },
      { label: 'Product Items', route: '/admin/product/productitem', roles: ['admin', 'superadmin'] },
      { label: 'Meal Type', route: '/admin/product/mealtype', roles: ['admin', 'superadmin'] },
    ]
  },
  {
    label: 'Reports',
    icon: 'fa-solid fa-book',
    roles: ['admin', 'superadmin'],
    children: [
      { label: 'Bill Sales Report', route: '/admin/reports/sales-reprt', roles: ['admin', 'superadmin'] },
      { label: 'Item Sales Report', route: '/admin/reports/item-wise-sales-reprt', roles: ['admin', 'superadmin'] },
    ]
  },
  {
    label: 'Table',
    icon: 'fa-solid fa-chair',
    roles: ['admin', 'superadmin'],
    children: [
      { label: 'Table', route: '/admin/table/table', roles: ['admin', 'superadmin'] },
    ]
  },
  {
    label: 'Bill',
    icon: 'fa fa-sticky-note',
    roles: ['superadmin'], // restrict to superadmin only
    children: [
      { label: 'Edit Bill', route: '/admin/bill/bill-edit', roles: ['superadmin'] },
    ]
  },
  {
    label: 'Kitchen',
    icon: 'fa fa-cutlery',
    roles: ['admin', 'superadmin'],
    children: [
      { label: 'Kitchen', route: '/admin/kitchen/kitchen', roles: ['admin', 'superadmin'] },
    ]
  },
  {
    label: 'Menu Permission',
    icon: 'fa fa-cutlery',
    roles: ['admin', 'superadmin'],
    children: [
      { label: 'Menu', route: '/admin/menu', roles: ['admin', 'superadmin'] },
    ]
  }
];
