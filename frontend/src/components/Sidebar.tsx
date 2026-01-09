import { NavLink } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectUserRole } from '@/store/slices/authSlice';
import { getNavigationForRole } from '@/config/navigation';

// Optional: icon mapping (Material UI icons)
import {
  Dashboard,
  Analytics,
  People,
  Assessment,
  Task,
  Settings,
} from '@mui/icons-material';

const iconMap: Record<string, JSX.Element> = {
  Dashboard: <Dashboard />,
  Analytics: <Analytics />,
  People: <People />,
  Assessment: <Assessment />,
  Task: <Task />,
  Settings: <Settings />,
};

const Sidebar = () => {
  const role = useAppSelector(selectUserRole);

  if (!role) return null;

  const navItems = getNavigationForRole(role);

  return (
    <aside className="w-64 border-r bg-background p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
              ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`
            }
          >
            {iconMap[item.icon]}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
