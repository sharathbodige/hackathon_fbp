import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectSidebarCollapsed } from '@/store/slices/uiSlice';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

export const AppLayout: React.FC = () => {
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <AppHeader />
      <main
        className={`transition-all duration-300 pt-header ${
          sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'
        }`}
      >
        <div className="min-h-[calc(100vh-var(--header-height))] p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
