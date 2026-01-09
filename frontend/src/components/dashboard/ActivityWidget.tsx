import React from 'react';
import { Person, Description, CheckCircle, Warning } from '@mui/icons-material';

interface ActivityItem {
  id: string;
  type: 'user' | 'document' | 'task' | 'alert';
  message: string;
  timestamp: string;
  user?: string;
}

interface ActivityWidgetProps {
  title: string;
  activities: ActivityItem[];
}

const iconMap = {
  user: <Person className="h-4 w-4" />,
  document: <Description className="h-4 w-4" />,
  task: <CheckCircle className="h-4 w-4" />,
  alert: <Warning className="h-4 w-4" />,
};

const iconColorMap = {
  user: 'bg-role-user-bg text-role-user',
  document: 'bg-primary/10 text-primary',
  task: 'bg-success/10 text-success',
  alert: 'bg-warning/10 text-warning',
};

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({ title, activities }) => {
  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                iconColorMap[activity.type]
              }`}
            >
              {iconMap[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                {activity.user && <span>{activity.user}</span>}
                <span>•</span>
                <span>{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityWidget;
