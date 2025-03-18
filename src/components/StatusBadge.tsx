
import React from 'react';
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "completed" | "in-progress" | "pending" | "not-started" | "live" | "review";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig = {
  "completed": {
    label: "Completed",
    color: "bg-quicksite-success/10 text-quicksite-success"
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-quicksite-blue/10 text-quicksite-blue"
  },
  "pending": {
    label: "Pending Input",
    color: "bg-quicksite-warning/10 text-quicksite-warning"
  },
  "not-started": {
    label: "Not Started",
    color: "bg-gray-100 text-gray-500"
  },
  "live": {
    label: "Live",
    color: "bg-quicksite-success/10 text-quicksite-success"
  },
  "review": {
    label: "Under Review",
    color: "bg-quicksite-pending/10 text-quicksite-pending"
  }
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5"
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className
}) => {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-medium", 
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {status === "in-progress" && (
        <span className="mr-1.5 relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-quicksite-blue opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-quicksite-blue"></span>
        </span>
      )}
      {status === "live" && (
        <span className="mr-1.5 relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-quicksite-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-quicksite-success"></span>
        </span>
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
