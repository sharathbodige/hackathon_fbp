import React from 'react';
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

const reports: Report[] = [
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
  {
    id: 'R-204',
    title: 'Monthly Sales Overview',
    type: 'Financial',
    owner: 'Sales Team',
    generatedOn: '05 Jan 2026',
    status: 'Failed',
  },
];

const statusColor = (status: ReportStatus) => {
  switch (status) {
    case 'Generated':
      return 'success';
    case 'Pending':
      return 'warning';
    default:
      return 'error';
  }
};

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

const ReportsPage: React.FC = () => {
  const user = useAppSelector(selectUser);

  if (!user) return null;

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
          <Button variant="contained">
            Generate Report
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Reports List */}
      <Grid container spacing={2}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  {/* Title */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Description color="primary" />
                    <Typography variant="h6">
                      {report.title}
                    </Typography>
                    <Chip size="small" label={report.id} />
                  </Stack>

                  {/* Meta */}
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

                  {/* Status */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    {typeIcon(report.type)}
                    <Chip
                      label={report.status}
                      color={statusColor(report.status)}
                    />
                  </Stack>

                  {/* Actions */}
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                    >
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

      {/* Footer Info */}
      <Box mt={3}>
        {user.role === 'manager' && (
          <Typography color="text.secondary">
            You can view and generate reports for your department.
          </Typography>
        )}
        {user.role === 'admin' && (
          <Typography color="text.secondary">
            You have full access to all organizational reports.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ReportsPage;
