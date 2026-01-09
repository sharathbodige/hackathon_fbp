import type { UserRole } from '@/types/auth.types';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  allowedRoles: UserRole[];
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'Dashboard',
    allowedRoles: ['admin', 'manager', 'user'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'Analytics',
    allowedRoles: ['admin', 'manager'],
  },
  {
    id: 'users',
    label: 'User Management',
    path: '/users',
    icon: 'People',
    allowedRoles: ['admin'],
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'Assessment',
    allowedRoles: ['admin', 'manager'],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/TasksPage',
    icon: 'Task',
    allowedRoles: ['admin', 'manager', 'user'],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    allowedRoles: ['admin', 'manager', 'user'],
  },
];

export const getNavigationForRole = (role: UserRole): NavItem[] => {
  return navigationConfig.filter(item => item.allowedRoles.includes(role));
};
