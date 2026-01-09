import type { UserRole } from '@/types/auth.types';

export interface WidgetConfig {
  id: string;
  type: 'stats' | 'chart' | 'table' | 'list' | 'activity';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  allowedRoles: UserRole[];
  refreshInterval?: number; // in seconds
  dataSource?: string;
}

export const dashboardWidgets: WidgetConfig[] = [
  // Admin-only widgets
  {
    id: 'system-health',
    type: 'stats',
    title: 'System Health',
    size: 'small',
    allowedRoles: ['admin'],
  },
  {
    id: 'total-users',
    type: 'stats',
    title: 'Total Users',
    size: 'small',
    allowedRoles: ['admin'],
  },
  {
    id: 'user-activity-chart',
    type: 'chart',
    title: 'User Activity',
    size: 'large',
    allowedRoles: ['admin'],
    refreshInterval: 60,
  },
  {
    id: 'system-logs',
    type: 'list',
    title: 'System Logs',
    size: 'medium',
    allowedRoles: ['admin'],
  },

  // Manager widgets
  {
    id: 'team-performance',
    type: 'chart',
    title: 'Team Performance',
    size: 'large',
    allowedRoles: ['admin', 'manager'],
  },
  {
    id: 'pending-approvals',
    type: 'stats',
    title: 'Pending Approvals',
    size: 'small',
    allowedRoles: ['admin', 'manager'],
  },
  {
    id: 'department-stats',
    type: 'stats',
    title: 'Department Stats',
    size: 'medium',
    allowedRoles: ['admin', 'manager'],
  },

  // User widgets
  {
    id: 'my-tasks',
    type: 'list',
    title: 'My Tasks',
    size: 'medium',
    allowedRoles: ['admin', 'manager', 'user'],
  },
  {
    id: 'recent-activity',
    type: 'activity',
    title: 'Recent Activity',
    size: 'medium',
    allowedRoles: ['admin', 'manager', 'user'],
  },
  {
    id: 'revenue',
    type: 'stats',
    title: 'Revenue',
    size: 'small',
    allowedRoles: ['admin', 'manager', 'user'],
  },
  {
    id: 'sales-chart',
    type: 'chart',
    title: 'Sales Overview',
    size: 'large',
    allowedRoles: ['admin', 'manager', 'user'],
  },
];

export const getWidgetsForRole = (role: UserRole): WidgetConfig[] => {
  return dashboardWidgets.filter(widget => widget.allowedRoles.includes(role));
};
