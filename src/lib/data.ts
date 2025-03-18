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
      phone: "+1 (555) 123-4567"
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
        subSteps: [
          {
            id: "domain-registration",
            name: "Domain Registration",
            description: "Register your domain name",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "hosting-setup",
            name: "Hosting Configuration",
            description: "Set up and configure hosting environment",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "dns-setup",
            name: "DNS Configuration",
            description: "Configure DNS records for the domain",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "ssl-setup",
            name: "SSL Certificate Installation",
            description: "Install and configure SSL certificate",
            status: "completed",
            percentComplete: 100
          }
        ],
        updates: [
          {
            title: "Domain Registered",
            description: "Your domain has been successfully registered and is now ready for use.",
            date: "2023-11-16T10:30:00",
            type: "update"
          },
          {
            title: "Hosting Environment Setup",
            description: "We have configured your hosting environment with the latest security patches.",
            date: "2023-11-17T14:20:00",
            type: "update"
          },
          {
            title: "SSL Certificate Installed",
            description: "SSL certificate has been installed and your site is now secure with HTTPS.",
            date: "2023-11-18T09:45:00",
            type: "update",
            link: "https://example.com"
          }
        ]
      },
      {
        id: "design",
        name: "UI/UX Design",
        description: "Creating wireframes and design mockups",
        status: "completed",
        percentComplete: 100,
        subSteps: [
          {
            id: "requirement-gathering",
            name: "Requirement Gathering",
            description: "Collect design requirements from client",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "wireframing",
            name: "Wireframing",
            description: "Create initial wireframes for approval",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "mockup-design",
            name: "Mockup Design",
            description: "Create detailed mockups with branding elements",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "client-review",
            name: "Client Review & Feedback",
            description: "Get client feedback and make revisions",
            status: "completed",
            percentComplete: 100
          }
        ],
        updates: [
          {
            title: "Design Requirements Collected",
            description: "We've gathered all your design preferences and requirements.",
            date: "2023-11-20T11:15:00",
            type: "message"
          },
          {
            title: "Wireframes Ready for Review",
            description: "Initial wireframes are ready for your review. Please check the attached file.",
            date: "2023-11-25T16:30:00",
            type: "file",
            link: "#wireframes"
          },
          {
            title: "Final Design Approved",
            description: "You have approved the final design. We're moving to development phase now.",
            date: "2023-11-30T13:20:00",
            type: "update"
          }
        ]
      },
      {
        id: "frontend",
        name: "Frontend Development",
        description: "Building the user interface and experience",
        status: "in-progress",
        percentComplete: 75,
        subSteps: [
          {
            id: "html-structure",
            name: "HTML Structure",
            description: "Create the basic HTML structure",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "css-styling",
            name: "CSS Styling",
            description: "Implement styling according to design",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "responsive-design",
            name: "Responsive Design",
            description: "Ensure site works well on all devices",
            status: "in-progress",
            percentComplete: 80
          },
          {
            id: "js-interactions",
            name: "JavaScript Interactions",
            description: "Add interactive elements and animations",
            status: "in-progress",
            percentComplete: 60
          },
          {
            id: "frontend-testing",
            name: "Cross-browser Testing",
            description: "Test on different browsers and devices",
            status: "not-started",
            percentComplete: 0
          }
        ],
        updates: [
          {
            title: "Frontend Development Started",
            description: "We've begun implementing the frontend based on approved designs.",
            date: "2023-12-02T09:00:00",
            type: "update"
          },
          {
            title: "Homepage Implementation Complete",
            description: "The homepage has been fully implemented and is ready for review.",
            date: "2023-12-05T15:45:00",
            type: "file",
            link: "#homepage-preview"
          }
        ]
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Setting up server, database, and APIs",
        status: "in-progress",
        percentComplete: 40,
        subSteps: [
          {
            id: "database-setup",
            name: "Database Setup",
            description: "Set up and configure database",
            status: "completed",
            percentComplete: 100
          },
          {
            id: "api-development",
            name: "API Development",
            description: "Create RESTful APIs for frontend",
            status: "in-progress",
            percentComplete: 70
          },
          {
            id: "authentication",
            name: "Authentication System",
            description: "Implement user authentication and authorization",
            status: "in-progress",
            percentComplete: 50
          },
          {
            id: "payment-integration",
            name: "Payment Gateway Integration",
            description: "Integrate payment processing system",
            status: "pending",
            percentComplete: 10,
            assignedTo: "John Smith"
          },
          {
            id: "admin-panel",
            name: "Admin Panel Development",
            description: "Create admin dashboard for content management",
            status: "not-started",
            percentComplete: 0
          }
        ],
        updates: [
          {
            title: "Database Schema Finalized",
            description: "The database schema has been finalized and initial tables created.",
            date: "2023-12-07T10:30:00",
            type: "update"
          },
          {
            title: "API Documentation",
            description: "API documentation has been created for frontend integration.",
            date: "2023-12-10T14:15:00",
            type: "file",
            link: "#api-docs"
          }
        ]
      },
      {
        id: "testing",
        name: "Testing & QA",
        description: "Quality assurance and bug fixing",
        status: "not-started",
        percentComplete: 0,
        subSteps: [
          {
            id: "unit-testing",
            name: "Unit Testing",
            description: "Test individual components",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "integration-testing",
            name: "Integration Testing",
            description: "Test interaction between components",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "user-testing",
            name: "User Acceptance Testing",
            description: "Client testing and feedback",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "performance-testing",
            name: "Performance Testing",
            description: "Test site performance and optimization",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "security-testing",
            name: "Security Testing",
            description: "Test for security vulnerabilities",
            status: "not-started",
            percentComplete: 0
          }
        ]
      },
      {
        id: "deployment",
        name: "Deployment & Launch",
        description: "Final deployment and go-live",
        status: "not-started",
        percentComplete: 0,
        subSteps: [
          {
            id: "pre-launch-checklist",
            name: "Pre-launch Checklist",
            description: "Final checks before deployment",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "content-migration",
            name: "Content Migration",
            description: "Migrate content to production",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "production-deployment",
            name: "Production Deployment",
            description: "Deploy to production environment",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "post-launch-testing",
            name: "Post-launch Testing",
            description: "Verify everything works in production",
            status: "not-started",
            percentComplete: 0
          },
          {
            id: "client-training",
            name: "Client Training",
            description: "Train client on using the platform",
            status: "not-started",
            percentComplete: 0
          }
        ]
      }
    ],
    requirements: [
      {
        id: "req-001",
        title: "Modern, minimalist design",
        description: "The website should have a clean, modern look with plenty of whitespace",
        category: "design",
        priority: "high",
        fulfilled: true
      },
      {
        id: "req-002",
        title: "Mobile responsive layout",
        description: "The site must work perfectly on all devices including phones and tablets",
        category: "design",
        priority: "high",
        fulfilled: true
      },
      {
        id: "req-003",
        title: "Product filtering and search",
        description: "Users should be able to filter products by category, price, etc.",
        category: "functionality",
        priority: "medium",
        fulfilled: false
      },
      {
        id: "req-004",
        title: "Secure checkout process",
        description: "The checkout process should be secure and easy to use",
        category: "functionality",
        priority: "high",
        fulfilled: false
      },
      {
        id: "req-005",
        title: "Integration with Instagram",
        description: "Display Instagram feed on the homepage",
        category: "integration",
        priority: "low",
        fulfilled: false
      }
    ],
    feedback: [
      {
        sender: "team",
        message: "Hello Alex! We've started working on your online store project. We'll be updating you regularly about the progress.",
        timestamp: "2023-11-16T09:30:00"
      },
      {
        sender: "client",
        message: "Thanks for the update. I'm excited to see the design mockups when they're ready.",
        timestamp: "2023-11-16T10:15:00"
      },
      {
        sender: "team",
        message: "We've completed the design phase and need your approval on the mockups. Please check your email for the files.",
        timestamp: "2023-11-25T14:00:00",
        attachments: [
          {
            name: "Homepage_Design_v1.pdf",
            url: "#",
            type: "pdf"
          }
        ]
      },
      {
        sender: "client",
        message: "The designs look great! I've sent some minor feedback via email. Looking forward to the development phase.",
        timestamp: "2023-11-26T09:45:00"
      }
    ]
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
