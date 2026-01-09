import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import { selectSidebarCollapsed, toggleSidebar } from '@/store/slices/uiSlice';
import { getNavigationForRole } from '@/config/navigation';
import {
  Dashboard,
  Analytics,
  People,
  Assessment,
  Task,
  Settings,
  ChevronLeft,
  ChevronRight,
  Business,
} from '@mui/icons-material';
import type { UserRole } from '@/types/auth.types';

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <Dashboard />,
  Analytics: <Analytics />,
  People: <People />,
  Assessment: <Assessment />,
  Task: <Task />,
  Settings: <Settings />,
};

const roleColors: Record<UserRole, string> = {
  admin: 'role-badge-admin',
  manager: 'role-badge-manager',
  user: 'role-badge-user',
};

export const AppSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isCollapsed = useAppSelector(selectSidebarCollapsed);
  const location = useLocation();

  if (!user) return null;

  const navItems = getNavigationForRole(user.role);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ${
        isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      }`}
    >
      {/* Logo Section */}
      <div className="flex h-header items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Business className="text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-sidebar-foreground">Enterprise</h1>
              <p className="text-xs text-sidebar-foreground/60">Management System</p>
            </div>
          )}
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden rounded-lg p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:block"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={isActive ? 'nav-item-active' : 'nav-item'}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{iconMap[item.icon]}</span>
              {!isCollapsed && (
                <span className="animate-fade-in truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border p-3">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.firstName} {user.lastName}
              </p>
              <span className={`role-badge ${roleColors[user.role]} mt-1`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
