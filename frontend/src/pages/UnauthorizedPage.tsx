import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Block, ArrowBack } from '@mui/icons-material';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <Block className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary mt-6 inline-flex items-center gap-2"
        >
          <ArrowBack className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
