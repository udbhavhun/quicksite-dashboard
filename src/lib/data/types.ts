
import { ReactNode } from 'react';

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  image: string;
}

export interface ProjectStatus {
  id: string;
  label: string;
  color: "blue" | "success" | "warning" | "error" | "pending";
}

export interface DetailedSubStep {
  id: string;
  name: string;
  description?: string;
  status: "completed" | "in-progress" | "pending" | "not-started" | "delayed" | "testing" | "approved" | "rejected";
  percentComplete: number;
  assignedTo?: string;
  dueDate?: string;
}

export interface StageUpdate {
  title: string;
  description: string;
  date: string;
  type: 'message' | 'file' | 'update';
  link?: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "not-started";
  percentComplete: number;
  subSteps?: DetailedSubStep[];
  updates?: StageUpdate[];
}

export interface CustomerRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  fulfilled: boolean;
  feedback?: string;
}

export interface FeedbackAttachment {
  name: string;
  url: string;
  type: string;
}

export interface FeedbackItem {
  sender: 'client' | 'team';
  message: string;
  timestamp: string;
  attachments?: FeedbackAttachment[];
}

export interface ProjectRating {
  score: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  package: Package;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  orderDate: string;
  stages: ProjectStage[];
  status: ProjectStatus;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  estimatedDelivery: string;
  requirements?: CustomerRequirement[];
  feedback?: FeedbackItem[];
  rating?: ProjectRating;
}
