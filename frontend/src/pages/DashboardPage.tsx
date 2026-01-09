import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import { getWidgetsForRole } from '@/config/dashboardWidgets';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { ActivityWidget } from '@/components/dashboard/ActivityWidget';
import { TaskListWidget } from '@/components/dashboard/TaskListWidget';
import {
  People,
  TrendingUp,
  AttachMoney,
  Assignment,
  Security,
  Speed,
} from '@mui/icons-material';
import type { UserRole } from '@/types/auth.types';

// Mock data for charts
const salesData = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 5000 },
  { month: 'Apr', value: 4500 },
  { month: 'May', value: 6000 },
  { month: 'Jun', value: 5500 },
  { month: 'Jul', value: 7000 },
];

const userActivityData = [
  { day: 'Mon', users: 120 },
  { day: 'Tue', users: 180 },
  { day: 'Wed', users: 150 },
  { day: 'Thu', users: 220 },
  { day: 'Fri', users: 190 },
  { day: 'Sat', users: 80 },
  { day: 'Sun', users: 60 },
];

const teamPerformanceData = [
  { team: 'Sales', score: 85 },
  { team: 'Marketing', score: 72 },
  { team: 'Engineering', score: 90 },
  { team: 'Support', score: 78 },
  { team: 'HR', score: 68 },
];

const recentActivities = [
  { id: '1', type: 'user' as const, message: 'New user registered', user: 'System', timestamp: '2 min ago' },
  { id: '2', type: 'document' as const, message: 'Q4 Report uploaded', user: 'Sarah M.', timestamp: '15 min ago' },
  { id: '3', type: 'task' as const, message: 'Project milestone completed', user: 'Team Alpha', timestamp: '1 hour ago' },
  { id: '4', type: 'alert' as const, message: 'Server maintenance scheduled', user: 'IT Dept', timestamp: '2 hours ago' },
];

const myTasks = [
  { id: '1', title: 'Review Q4 performance metrics', priority: 'high' as const, dueDate: 'Today', completed: false },
  { id: '2', title: 'Update team documentation', priority: 'medium' as const, dueDate: 'Tomorrow', completed: false },
  { id: '3', title: 'Schedule weekly standup', priority: 'low' as const, dueDate: 'Jan 10', completed: true },
  { id: '4', title: 'Prepare client presentation', priority: 'high' as const, dueDate: 'Jan 12', completed: false },
];

const roleWelcomeMessages: Record<UserRole, { title: string; subtitle: string }> = {
  admin: {
    title: 'System Overview',
    subtitle: 'Monitor system health, manage users, and configure platform settings.',
  },
  manager: {
    title: 'Team Dashboard',
    subtitle: 'Track team performance, manage approvals, and view department analytics.',
  },
  user: {
    title: 'My Workspace',
    subtitle: 'View your tasks, track progress, and access assigned resources.',
  },
};

export const DashboardPage: React.FC = () => {
  const user = useAppSelector(selectUser);

  if (!user) return null;

  const widgets = getWidgetsForRole(user.role);
  const welcomeMessage = roleWelcomeMessages[user.role];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-1 text-muted-foreground">{welcomeMessage.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`role-badge role-badge-${user.role}`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </span>
        </div>
      </div>

      {/* Admin-specific stats */}
      {user.role === 'admin' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value="1,284"
            change={{ value: 12.5, trend: 'up' }}
            icon={<People />}
          />
          <StatCard
            title="System Health"
            value="99.9%"
            change={{ value: 0.1, trend: 'up' }}
            icon={<Speed />}
            variant="success"
          />
          <StatCard
            title="Security Score"
            value="A+"
            icon={<Security />}
            variant="primary"
          />
          <StatCard
            title="Active Sessions"
            value="342"
            change={{ value: 8.2, trend: 'up' }}
            icon={<TrendingUp />}
          />
        </div>
      )}

      {/* Manager-specific stats */}
      {user.role === 'manager' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Team Members"
            value="24"
            icon={<People />}
          />
          <StatCard
            title="Pending Approvals"
            value="7"
            change={{ value: 2, trend: 'up' }}
            icon={<Assignment />}
            variant="warning"
          />
          <StatCard
            title="Department Revenue"
            value="$284K"
            change={{ value: 15.3, trend: 'up' }}
            icon={<AttachMoney />}
            variant="success"
          />
          <StatCard
            title="Task Completion"
            value="87%"
            change={{ value: 5.2, trend: 'up' }}
            icon={<TrendingUp />}
          />
        </div>
      )}

      {/* User-specific stats */}
      {user.role === 'user' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="My Tasks"
            value="12"
            change={{ value: 3, trend: 'down' }}
            icon={<Assignment />}
          />
          <StatCard
            title="Completed This Week"
            value="8"
            change={{ value: 25, trend: 'up' }}
            icon={<TrendingUp />}
            variant="success"
          />
          <StatCard
            title="Performance Score"
            value="92%"
            change={{ value: 4, trend: 'up' }}
            icon={<Speed />}
            variant="primary"
          />
        </div>
      )}

      {/* Charts and Widgets */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          {user.role === 'admin' ? (
            <ChartWidget
              title="User Activity (Last 7 Days)"
              type="area"
              data={userActivityData}
              dataKey="users"
              xAxisKey="day"
              color="hsl(243, 75%, 59%)"
            />
          ) : user.role === 'manager' ? (
            <ChartWidget
              title="Team Performance by Department"
              type="bar"
              data={teamPerformanceData}
              dataKey="score"
              xAxisKey="team"
              color="hsl(160, 84%, 39%)"
            />
          ) : (
            <ChartWidget
              title="Sales Overview"
              type="line"
              data={salesData}
              dataKey="value"
              xAxisKey="month"
              color="hsl(199, 89%, 48%)"
            />
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityWidget title="Recent Activity" activities={recentActivities} />
        </div>
      </div>

      {/* Tasks Widget */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TaskListWidget title="My Tasks" tasks={myTasks} />
        
        {/* Second chart for larger screens */}
        <div className="hidden lg:block">
          <ChartWidget
            title="Monthly Revenue"
            type="area"
            data={salesData}
            dataKey="value"
            xAxisKey="month"
            color="hsl(224, 76%, 48%)"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
