import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  TextField,
  Divider,
  Button,
  Grid,
} from '@mui/material';
import {
  Person,
  Notifications,
  Security,
  Save,
} from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';

const SettingsPage: React.FC = () => {
  const user = useAppSelector(selectUser);

  if (!user) return null;

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Settings
        </Typography>
        <Typography color="text.secondary">
          Manage your account and application preferences
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Person color="primary" />
                  <Typography variant="h6">
                    Profile Settings
                  </Typography>
                </Stack>

                <TextField
                  label="First Name"
                  value={user.firstName}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={`${user.firstName.toLowerCase()}@company.com`}
                  disabled
                  fullWidth
                />

                <Button
                  variant="contained"
                  startIcon={<Save />}
                  disabled
                >
                  Update Profile
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Notifications color="warning" />
                  <Typography variant="h6">
                    Notifications
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>Email Notifications</Typography>
                  <Switch defaultChecked />
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>SMS Alerts</Typography>
                  <Switch />
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>Weekly Summary</Typography>
                  <Switch defaultChecked />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Security color="error" />
                  <Typography variant="h6">
                    Security
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Last password change: 15 days ago
                </Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Button variant="outlined">
                    Change Password
                  </Button>
                  <Button variant="outlined">
                    Enable Two-Factor Authentication
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Information */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1">
                Role Information
              </Typography>
              <Typography color="text.secondary">
                You are logged in as <b>{user.role.toUpperCase()}</b>.  
                {user.role === 'admin' &&
                  ' You have full administrative access.'}
                {user.role === 'manager' &&
                  ' You can manage teams and reports.'}
                {user.role === 'user' &&
                  ' You can manage your assigned tasks.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
