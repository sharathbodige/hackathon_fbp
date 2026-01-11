import React, { useEffect, useState } from 'react';
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

/* ================= TYPES ================= */
interface UserSettings {
  emailNotifications: boolean;
  smsAlerts: boolean;
  weeklySummary: boolean;
}

/* ================= FAKE SETTINGS ================= */
const fakeSettings: UserSettings = {
  emailNotifications: true,
  smsAlerts: false,
  weeklySummary: true,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SettingsPage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [settings, setSettings] = useState<UserSettings>(fakeSettings);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD SETTINGS (API + FAKE) ================= */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        if (!res.ok) throw new Error();
        const apiSettings = await res.json();
        setSettings(apiSettings);
      } catch {
        // API fail → fakeSettings already shown
        console.warn('Settings API failed, using fake data');
      }
    };

    loadSettings();
  }, []);

  if (!user) return null;

  /* ================= SAVE SETTINGS ================= */
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error();

      const savedSettings = await res.json();
      setSettings(savedSettings);
      alert('Settings updated successfully');
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

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
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifications: e.target.checked,
                      })
                    }
                  />
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>SMS Alerts</Typography>
                  <Switch
                    checked={settings.smsAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smsAlerts: e.target.checked,
                      })
                    }
                  />
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>Weekly Summary</Typography>
                  <Switch
                    checked={settings.weeklySummary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        weeklySummary: e.target.checked,
                      })
                    }
                  />
                </Stack>

                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
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
                You are logged in as <b>{user.role.toUpperCase()}</b>.{' '}
                {user.role === 'admin' &&
                  'You have full administrative access.'}
                {user.role === 'manager' &&
                  'You can manage teams and reports.'}
                {user.role === 'user' &&
                  'You can manage your assigned tasks.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
