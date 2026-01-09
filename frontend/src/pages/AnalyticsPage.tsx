import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { StatCard } from '@/components/dashboard/StatCard';
import { Visibility, TrendingUp, PieChart, BarChart } from '@mui/icons-material';

const pageViewsData = [
  { date: 'Week 1', views: 12400 },
  { date: 'Week 2', views: 15600 },
  { date: 'Week 3', views: 14200 },
  { date: 'Week 4', views: 18900 },
];

const conversionData = [
  { channel: 'Organic', rate: 4.2 },
  { channel: 'Paid', rate: 3.8 },
  { channel: 'Social', rate: 2.9 },
  { channel: 'Email', rate: 5.1 },
  { channel: 'Direct', rate: 6.3 },
];

export const AnalyticsPage: React.FC = () => {
  const user = useAppSelector(selectUser);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          {user?.role === 'admin'
            ? 'Platform-wide analytics and insights'
            : 'Department performance metrics and trends'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Page Views"
          value="61.1K"
          change={{ value: 12.3, trend: 'up' }}
          icon={<Visibility />}
        />
        <StatCard
          title="Bounce Rate"
          value="32.4%"
          change={{ value: 2.1, trend: 'down' }}
          icon={<TrendingUp />}
          variant="success"
        />
        <StatCard
          title="Avg. Session"
          value="4m 32s"
          change={{ value: 8.5, trend: 'up' }}
          icon={<PieChart />}
        />
        <StatCard
          title="Conversion Rate"
          value="4.8%"
          change={{ value: 1.2, trend: 'up' }}
          icon={<BarChart />}
          variant="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget
          title="Page Views Trend"
          type="area"
          data={pageViewsData}
          dataKey="views"
          xAxisKey="date"
        />
        <ChartWidget
          title="Conversion by Channel"
          type="bar"
          data={conversionData}
          dataKey="rate"
          xAxisKey="channel"
          color="hsl(160, 84%, 39%)"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
