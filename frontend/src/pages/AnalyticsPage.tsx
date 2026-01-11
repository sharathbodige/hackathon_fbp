import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  Visibility,
  TrendingUp,
  PieChart,
  BarChart,
} from '@mui/icons-material';

import { getAnalytics } from '@/services/analytics.api';

export const AnalyticsPage: React.FC = () => {
  const user = useAppSelector(selectUser);

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError('Unable to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="py-10 text-center">Loading analytics...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  if (!analytics) return null;

  const { overview, pageViewsTrend, conversionByChannel } = analytics;

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
          value={overview.pageViews.value}
          change={overview.pageViews}
          icon={<Visibility />}
        />
        <StatCard
          title="Bounce Rate"
          value={overview.bounceRate.value}
          change={overview.bounceRate}
          icon={<TrendingUp />}
          variant="success"
        />
        <StatCard
          title="Avg. Session"
          value={overview.avgSession.value}
          change={overview.avgSession}
          icon={<PieChart />}
        />
        <StatCard
          title="Conversion Rate"
          value={overview.conversionRate.value}
          change={overview.conversionRate}
          icon={<BarChart />}
          variant="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWidget
          title="Page Views Trend"
          type="area"
          data={pageViewsTrend}
          dataKey="views"
          xAxisKey="date"
        />
        <ChartWidget
          title="Conversion by Channel"
          type="bar"
          data={conversionByChannel}
          dataKey="rate"
          xAxisKey="channel"
          color="hsl(160, 84%, 39%)"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
