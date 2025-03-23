
import { ProjectStatus } from './types';

// Project statuses
export const PROJECT_STATUSES: ProjectStatus[] = [
  {
    id: "in-progress",
    label: "In Progress",
    color: "blue",
  },
  {
    id: "completed",
    label: "Completed",
    color: "success",
  },
  {
    id: "pending-input",
    label: "Pending Input",
    color: "warning",
  },
  {
    id: "delayed",
    label: "Delayed",
    color: "error",
  },
  {
    id: "live",
    label: "Live",
    color: "success",
  },
  {
    id: "review",
    label: "Under Review",
    color: "pending",
  },
];
