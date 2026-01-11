import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Description,
  Download,
  Visibility,
  BarChart,
  PieChart,
  Assessment,
} from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';

/* ================= TYPES ================= */
type ReportStatus = 'Generated' | 'Pending' | 'Failed';
type ReportType = 'Financial' | 'Performance' | 'Security';

interface Report {
  id: string;
  title: string;
  type: ReportType;
  owner: string;
  generatedOn: string;
  status: ReportStatus;
}

/* ================= FAKE REPORTS ================= */
const fakeReports: Report[] = [
  {
    id: 'R-201',
    title: 'Q1 Financial Summary',
    type: 'Financial',
    owner: 'Finance Department',
    generatedOn: '08 Jan 2026',
    status: 'Generated',
  },
  {
    id: 'R-202',
    title: 'Team Performance Report',
    type: 'Performance',
    owner: 'HR Department',
    generatedOn: '07 Jan 2026',
    status: 'Generated',
  },
  {
    id: 'R-203',
    title: 'System Security Audit',
    type: 'Security',
    owner: 'IT Security',
    generatedOn: '06 Jan 2026',
    status: 'Pending',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= HELPERS ================= */
const statusColor = (status: ReportStatus) =>
  status === 'Generated'
    ? 'success'
    : status === 'Pending'
    ? 'warning'
    : 'error';

const typeIcon = (type: ReportType) => {
  switch (type) {
    case 'Financial':
      return <BarChart color="primary" />;
    case 'Performance':
      return <Assessment color="success" />;
    default:
      return <PieChart color="warning" />;
  }
};

/* ================= COMPONENT ================= */
const ReportsPage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [reports, setReports] = useState<Report[]>(fakeReports);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'Financial' as ReportType,
    owner: '',
  });

  /* ================= LOAD REPORTS (API + FAKE) ================= */
  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reports`);
        if (!res.ok) throw new Error();
        const apiReports = await res.json();
        if (Array.isArray(apiReports) && apiReports.length > 0) {
          setReports(apiReports);
        }
      } catch {
        // API fail → fakeReports already shown
        console.warn('Reports API failed, using fake data');
      }
    };

    loadReports();
  }, []);

  if (!user) return null;

  /* ================= GENERATE REPORT (API + UI) ================= */
  const handleGenerateReport = async () => {
    if (!form.title || !form.owner) {
      alert('Please fill all fields');
      return;
    }

    try {
      const payload = {
        title: form.title,
        type: form.type,
        owner: form.owner,
        status: 'Generated',
        generatedOn: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const savedReport: Report = await res.json();

      // 👇 SAME CARD SIZE because same Grid & Card used
      setReports((prev) => [savedReport, ...prev]);

      setForm({ title: '', type: 'Financial', owner: '' });
      setOpen(false);
    } catch {
      alert('Failed to generate report');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Reports
          </Typography>
          <Typography color="text.secondary">
            Generate and analyze organizational reports
          </Typography>
        </Box>

        {(user.role === 'admin' || user.role === 'manager') && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Generate Report
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Reports Grid (SAME CARD SIZE) */}
      <Grid container spacing={2}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Description color="primary" />
                    <Typography variant="h6" noWrap>
                      {report.title}
                    </Typography>
                    <Chip size="small" label={report.id} />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <b>Type:</b> {report.type}
                    </Typography>
                    <Typography variant="body2">
                      <b>Owner:</b> {report.owner}
                    </Typography>
                    <Typography variant="body2">
                      <b>Generated On:</b> {report.generatedOn}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {typeIcon(report.type)}
                    <Chip
                      label={report.status}
                      color={statusColor(report.status)}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" startIcon={<Visibility />}>
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Download />}
                      disabled={report.status !== 'Generated'}
                    >
                      Download
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= GENERATE REPORT MODAL ================= */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <TextField
              label="Report Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              fullWidth
            />

            <TextField
              select
              label="Report Type"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as ReportType })
              }
              fullWidth
            >
              <MenuItem value="Financial">Financial</MenuItem>
              <MenuItem value="Performance">Performance</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
            </TextField>

            <TextField
              label="Owner / Department"
              value={form.owner}
              onChange={(e) =>
                setForm({ ...form, owner: e.target.value })
              }
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGenerateReport}>
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsPage;
