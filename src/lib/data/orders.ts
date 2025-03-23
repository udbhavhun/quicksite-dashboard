
import { Order } from './types';
import { PACKAGES } from './packages';
import { PROJECT_STATUSES } from './project-statuses';

// Sample orders
export const ORDERS: Order[] = [
  {
    id: "ORD-2023-001",
    package: PACKAGES[0],
    customer: {
      id: "CUS-001",
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
      id: "CUS-002",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678"
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
      id: "CUS-003",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789"
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
  },
  {
    id: "ORD-2023-004",
    package: PACKAGES[0],
    customer: {
      id: "CUS-004",
      name: "Jennifer Lee",
      email: "jennifer@example.com",
      phone: "+1 (555) 456-7890"
    },
    orderDate: "2023-11-22",
    status: PROJECT_STATUSES[1],
    totalAmount: 19999,
    paymentStatus: "pending",
    estimatedDelivery: "2023-12-28",
    stages: [
      {
        id: "domain-hosting",
        name: "Domain & Hosting Setup",
        description: "Registering domain and setting up hosting environment",
        status: "in-progress",
        percentComplete: 70,
      },
      {
        id: "design",
        name: "UI/UX Design",
        description: "Creating wireframes and design mockups",
        status: "pending",
        percentComplete: 20,
      },
      {
        id: "frontend",
        name: "Frontend Development",
        description: "Building the user interface and experience",
        status: "not-started",
        percentComplete: 0,
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Setting up server, database, and APIs",
        status: "not-started",
        percentComplete: 0,
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
    id: "ORD-2023-005",
    package: PACKAGES[2],
    customer: {
      id: "CUS-005",
      name: "David Rodriguez",
      email: "david@example.com",
      phone: "+1 (555) 567-8901"
    },
    orderDate: "2023-11-25",
    status: PROJECT_STATUSES[1],
    totalAmount: 59999,
    paymentStatus: "paid",
    estimatedDelivery: "2023-12-30",
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
        status: "in-progress",
        percentComplete: 80,
      },
      {
        id: "frontend",
        name: "Frontend Development",
        description: "Building the user interface and experience",
        status: "pending",
        percentComplete: 10,
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Setting up server, database, and APIs",
        status: "not-started",
        percentComplete: 0,
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
