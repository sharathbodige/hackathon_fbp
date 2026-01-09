import React from 'react';
import { Construction } from '@mui/icons-material';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          {description || 'This page is under construction. Check back soon!'}
        </p>
      </div>
    </div>
  );
};

// Export specific placeholder pages
// export const ReportsPage: React.FC = () => (
//   <PlaceholderPage
//     title="Reports"
//     description="Generate and view comprehensive reports for your organization."
//   />
// );




// export const SettingsPage: React.FC = () => (
//   <PlaceholderPage
//     title="Settings"
//     description="Configure your account preferences and application settings."
//   />
// );

export default PlaceholderPage;
