import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import {
  Assignment,
  Add,
  Edit,
  Delete,
  CheckCircle,
  PendingActions,
  HourglassBottom,
} from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';

type Status = 'Todo' | 'In Progress' | 'Completed';
type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: Status;
  priority: Priority;
}

const tasks: Task[] = [
  {
    id: 'T-101',
    title: 'Prepare Q1 Financial Report',
    description: 'Compile revenue, expense and profit data for Q1.',
    assignee: 'Finance Team',
    dueDate: '15 Jan 2026',
    status: 'In Progress',
    priority: 'High',
  },
  {
    id: 'T-102',
    title: 'Client onboarding documentation',
    description: 'Create onboarding guide for new enterprise clients.',
    assignee: 'Sarah Johnson',
    dueDate: '18 Jan 2026',
    status: 'Todo',
    priority: 'Medium',
  },
  {
    id: 'T-103',
    title: 'Production deployment',
    description: 'Deploy version 2.3.0 to production environment.',
    assignee: 'DevOps Team',
    dueDate: '10 Jan 2026',
    status: 'Completed',
    priority: 'High',
  },
  {
    id: 'T-104',
    title: 'Security audit review',
    description: 'Review third-party security audit findings.',
    assignee: 'Security Team',
    dueDate: '22 Jan 2026',
    status: 'Todo',
    priority: 'Low',
  },
];

const statusColor = (status: Status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'warning';
    default:
      return 'default';
  }
};

const priorityColor = (priority: Priority) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    default:
      return 'info';
  }
};

const statusIcon = (status: Status) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle />;
    case 'In Progress':
      return <HourglassBottom />;
    default:
      return <PendingActions />;
  }
};

const TasksPage: React.FC = () => {
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
            Tasks
          </Typography>
          <Typography color="text.secondary">
            Track, manage and monitor work items
          </Typography>
        </Box>

        {(user.role === 'admin' || user.role === 'manager') && (
          <Button
            variant="contained"
            startIcon={<Add />}
          >
            Create Task
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Tasks Grid */}
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} key={task.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  {/* Title */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Assignment color="primary" />
                    <Typography variant="h6">
                      {task.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={task.id}
                      variant="outlined"
                    />
                  </Stack>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>

                  {/* Meta */}
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack direction="row" spacing={2}>
                      <Typography variant="body2">
                        <b>Assignee:</b> {task.assignee}
                      </Typography>
                      <Typography variant="body2">
                        <b>Due:</b> {task.dueDate}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={statusIcon(task.status)}
                        label={task.status}
                        color={statusColor(task.status)}
                      />
                      <Chip
                        label={task.priority}
                        color={priorityColor(task.priority)}
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>

                  {/* Actions */}
                  {(user.role === 'admin' || user.role === 'manager') && (
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        startIcon={<Edit />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer Info */}
      <Box mt={3}>
        {user.role === 'user' && (
          <Typography color="text.secondary">
            You can view and update tasks assigned to you.
          </Typography>
        )}
        {user.role === 'manager' && (
          <Typography color="text.secondary">
            You can manage and track tasks for your team.
          </Typography>
        )}
        {user.role === 'admin' && (
          <Typography color="text.secondary">
            Full control over tasks across the organization.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TasksPage;
