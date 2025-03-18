
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

export interface ProjectStage {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "not-started";
  percentComplete: number;
}

export interface Order {
  id: string;
  package: Package;
  customer: {
    name: string;
    email: string;
  };
  orderDate: string;
  stages: ProjectStage[];
  status: ProjectStatus;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  estimatedDelivery: string;
}

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

// Package data
export const PACKAGES: Package[] = [
  {
    id: "online-store",
    name: "Online Store Package",
    price: 19999,
    description: "All-In-One Package for E-Commerce businesses",
    features: [
      "Shopify / Wordpress / Custom",
      "100% Digital Processing",
      "Payment Gateway Integration",
      "Product Management System"
    ],
    image: "/lovable-uploads/397d6940-6a8b-4770-baef-6b00c97aea6d.png",
  },
  {
    id: "e-doctor",
    name: "E-Doctor Package",
    price: 49999,
    description: "Complete solution for medical professionals",
    features: [
      "E-Consultation and Prescription",
      "Patient App and 20+ Add-ons",
      "100% Medical Compliant Setup",
      "Appointment Management"
    ],
    image: "/lovable-uploads/397d6940-6a8b-4770-baef-6b00c97aea6d.png",
  },
  {
    id: "travel-site",
    name: "Travel Site Package",
    price: 59999,
    description: "Comprehensive travel website solution",
    features: [
      "All-In-One Package",
      "DropService Friendly",
      "100% Digital Processing",
      "Booking Management System"
    ],
    image: "/lovable-uploads/397d6940-6a8b-4770-baef-6b00c97aea6d.png",
  },
  {
    id: "ai-tools",
    name: "AI Tools Site Package",
    price: 64999,
    description: "Future-proof AI tools business",
    features: [
      "Beginner Friendly Business",
      "Future Proof Business Setup",
      "100% Ownership Earn Online",
      "AI Integration & API Access"
    ],
    image: "/lovable-uploads/397d6940-6a8b-4770-baef-6b00c97aea6d.png",
  },
  {
    id: "quick-online",
    name: "Quick Online Package",
    price: 14999,
    description: "Basic business website solution",
    features: [
      "Basic Business Site",
      "Auto Blog and 20+ Add-ons",
      "For Online or Offline Business",
      "SEO Optimization"
    ],
    image: "/lovable-uploads/397d6940-6a8b-4770-baef-6b00c97aea6d.png",
  },
  {
    id: "cloud-kitchen",
    name: "Cloud Kitchen Package",
    price: 7999,
    description: "Online presence for food businesses",
    features: [
      "Go Online in 3 Days",
      "Start From Home",
      "Menu and Brand Design",
      "Order Management System"
    ],
    image: "/lovable-uploads/397d6940-6a8b-4770-baef-6b00c97aea6d.png",
  },
];

// Sample orders
export const ORDERS: Order[] = [
  {
    id: "ORD-2023-001",
    package: PACKAGES[0],
    customer: {
      name: "Alex Johnson",
      email: "alex@example.com",
    },
    orderDate: "2023-11-15",
    status: PROJECT_STATUSES[0],
    totalAmount: 19999,
    paymentStatus: "paid",
    estimatedDelivery: "2023-12-15",
    stages: [
      {
        id: "domain-hosting",
        name: "Domain & Hosting Setup",
        description: "Registering domain and setting up hosting environment",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "design",
        name: "UI/UX Design",
        description: "Creating wireframes and design mockups",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "frontend",
        name: "Frontend Development",
        description: "Building the user interface and experience",
        status: "in-progress",
        percentComplete: 75,
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Setting up server, database, and APIs",
        status: "in-progress",
        percentComplete: 40,
      },
      {
        id: "testing",
        name: "Testing & QA",
        description: "Quality assurance and bug fixing",
        status: "not-started",
        percentComplete: 0,
      },
      {
        id: "deployment",
        name: "Deployment & Launch",
        description: "Final deployment and go-live",
        status: "not-started",
        percentComplete: 0,
      },
    ],
  },
  {
    id: "ORD-2023-002",
    package: PACKAGES[2],
    customer: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
    },
    orderDate: "2023-11-10",
    status: PROJECT_STATUSES[4],
    totalAmount: 59999,
    paymentStatus: "paid",
    estimatedDelivery: "2023-12-10",
    stages: [
      {
        id: "domain-hosting",
        name: "Domain & Hosting Setup",
        description: "Registering domain and setting up hosting environment",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "design",
        name: "UI/UX Design",
        description: "Creating wireframes and design mockups",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "frontend",
        name: "Frontend Development",
        description: "Building the user interface and experience",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Setting up server, database, and APIs",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "testing",
        name: "Testing & QA",
        description: "Quality assurance and bug fixing",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "deployment",
        name: "Deployment & Launch",
        description: "Final deployment and go-live",
        status: "completed",
        percentComplete: 100,
      },
    ],
  },
  {
    id: "ORD-2023-003",
    package: PACKAGES[1],
    customer: {
      name: "Michael Brown",
      email: "michael@example.com",
    },
    orderDate: "2023-11-20",
    status: PROJECT_STATUSES[2],
    totalAmount: 49999,
    paymentStatus: "paid",
    estimatedDelivery: "2023-12-25",
    stages: [
      {
        id: "domain-hosting",
        name: "Domain & Hosting Setup",
        description: "Registering domain and setting up hosting environment",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "design",
        name: "UI/UX Design",
        description: "Creating wireframes and design mockups",
        status: "completed",
        percentComplete: 100,
      },
      {
        id: "frontend",
        name: "Frontend Development",
        description: "Building the user interface and experience",
        status: "in-progress",
        percentComplete: 60,
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Setting up server, database, and APIs",
        status: "pending",
        percentComplete: 30,
      },
      {
        id: "testing",
        name: "Testing & QA",
        description: "Quality assurance and bug fixing",
        status: "not-started",
        percentComplete: 0,
      },
      {
        id: "deployment",
        name: "Deployment & Launch",
        description: "Final deployment and go-live",
        status: "not-started",
        percentComplete: 0,
      },
    ],
  }
];
