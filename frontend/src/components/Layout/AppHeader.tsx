import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, logoutUser } from '@/store/slices/authSlice';
import { selectSidebarCollapsed, toggleMobileSidebar } from '@/store/slices/uiSlice';
import {
  Menu,
  Notifications,
  Person,
  Logout,
  Search,
  KeyboardArrowDown,
} from '@mui/icons-material';

export const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 h-header border-b border-border bg-card transition-all duration-300 ${
        sidebarCollapsed ? 'left-sidebar-collapsed' : 'left-sidebar'
      }`}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleMobileSidebar())}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <Menu />
          </button>

          {/* Search */}
          <div className="hidden items-center gap-2 rounded-lg bg-muted px-4 py-2 md:flex">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground lg:inline">
              K
            </kbd>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Notifications />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {user?.firstName[0]}
                {user?.lastName[0]}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <KeyboardArrowDown className="h-5 w-5 text-muted-foreground" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 animate-slide-in-up rounded-lg border border-border bg-card py-2 shadow-lg">
                  <div className="border-b border-border px-4 pb-3 pt-1">
                    <p className="text-sm font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent"
                    >
                      <Person className="h-5 w-5" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-accent"
                    >
                      <Logout className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
