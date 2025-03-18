
import React from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, RefreshCw, Zap, Eye } from 'lucide-react';

interface StatusBadgeProps {
  status: "completed" | "in-progress" | "pending" | "not-started" | "live" | "review" | "delayed" | "testing" | "approved" | "rejected";
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const statusConfig = {
  "completed": {
    label: "Completed",
    color: "bg-quicksite-success/10 text-quicksite-success",
    icon: CheckCircle2
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-quicksite-blue/10 text-quicksite-blue",
    icon: RefreshCw
  },
  "pending": {
    label: "Pending Input",
    color: "bg-quicksite-warning/10 text-quicksite-warning",
    icon: Clock
  },
  "not-started": {
    label: "Not Started",
    color: "bg-gray-100 text-gray-500",
    icon: Clock
  },
  "live": {
    label: "Live",
    color: "bg-quicksite-success/10 text-quicksite-success",
    icon: Zap
  },
  "review": {
    label: "Under Review",
    color: "bg-quicksite-pending/10 text-quicksite-pending",
    icon: Eye
  },
  "delayed": {
    label: "Delayed",
    color: "bg-red-100 text-red-600",
    icon: AlertTriangle
  },
  "testing": {
    label: "Testing",
    color: "bg-purple-100 text-purple-600",
    icon: RefreshCw
  },
  "approved": {
    label: "Approved",
    color: "bg-green-100 text-green-600",
    icon: CheckCircle2
  },
  "rejected": {
    label: "Rejected",
    color: "bg-red-100 text-red-600",
    icon: AlertTriangle
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
  className,
  animated = true
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-medium", 
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {(status === "in-progress" || status === "live" || status === "testing") && animated ? (
        <span className="mr-1.5 relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
            status === "in-progress" ? "bg-quicksite-blue" : 
            status === "testing" ? "bg-purple-600" : "bg-quicksite-success"
          } opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            status === "in-progress" ? "bg-quicksite-blue" : 
            status === "testing" ? "bg-purple-600" : "bg-quicksite-success"
          }`}></span>
        </span>
      ) : (
        <Icon className="mr-1.5 h-3 w-3" />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
