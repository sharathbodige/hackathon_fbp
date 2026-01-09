import React from 'react';
import { CheckCircle, RadioButtonUnchecked, Flag } from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
}

interface TaskListWidgetProps {
  title: string;
  tasks: Task[];
  onToggleTask?: (taskId: string) => void;
}

const priorityColors = {
  high: 'text-destructive',
  medium: 'text-warning',
  low: 'text-muted-foreground',
};

export const TaskListWidget: React.FC<TaskListWidgetProps> = ({
  title,
  tasks,
  onToggleTask,
}) => {
  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
        <button className="btn-secondary py-1.5 px-3 text-xs">Add Task</button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
          >
            <button
              onClick={() => onToggleTask?.(task.id)}
              className={`flex-shrink-0 ${
                task.completed ? 'text-success' : 'text-muted-foreground'
              }`}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <RadioButtonUnchecked className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  task.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
            </div>
            <Flag className={`h-4 w-4 ${priorityColors[task.priority]}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListWidget;
