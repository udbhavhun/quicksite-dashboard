
// Define the SiteMetrics type
export type SiteMetrics = {
  id: string;
  name: string;
  url: string;
  status: string;
  plan: string;
  launchDate: string | null;
  uptime: number;
  responseTime: number;
  visitorsToday: number;
  pageLoadTime: number;
  serverLocation?: string;
  sslExpiry?: string;
  bounceRate?: number;
  averageSessionDuration?: number;
  pageViews?: number;
  visitorsThisMonth?: number;
  deviceBreakdown?: Array<{device: string, percentage: number}>;
  trafficSources?: Array<{source: string, percentage: number}>;
};

// Export performance data
export const performanceData = [
  {
    id: '1',
    metric: 'Page Load Time',
    value: '1.5s',
    change: '-0.2s',
    trend: 'improving',
    timestamp: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    metric: 'Server Response Time',
    value: '0.3s',
    change: '-0.1s',
    trend: 'improving',
    timestamp: '2023-01-15T00:00:00Z'
  },
  {
    id: '3',
    metric: 'Uptime',
    value: '99.95%',
    change: '+0.1%',
    trend: 'improving',
    timestamp: '2023-01-15T00:00:00Z'
  },
  {
    id: '4',
    metric: 'First Contentful Paint',
    value: '0.8s',
    change: '-0.3s',
    trend: 'improving',
    timestamp: '2023-01-20T00:00:00Z'
  },
  {
    id: '5',
    metric: 'Time to Interactive',
    value: '2.1s',
    change: '-0.4s',
    trend: 'improving',
    timestamp: '2023-01-20T00:00:00Z'
  }
];

// Export bug reports
export const bugReports = [
  {
    id: '1',
    title: 'Mobile menu not displaying correctly',
    description: 'On iPhone SE the mobile menu overlaps with content',
    status: 'open',
    priority: 'medium',
    reportedBy: 'user@example.com',
    reportedAt: '2023-01-10T14:35:00Z'
  },
  {
    id: '2',
    title: 'Payment form validation error',
    description: 'Credit card validation doesn\'t accept valid cards',
    status: 'investigating',
    priority: 'high',
    reportedBy: 'admin@example.com',
    reportedAt: '2023-01-12T09:22:00Z'
  },
  {
    id: '3',
    title: 'Image upload timeout',
    description: 'Large image uploads time out after 30 seconds',
    status: 'fixed',
    priority: 'medium',
    reportedBy: 'user@example.com',
    reportedAt: '2023-01-14T16:45:00Z'
  },
  {
    id: '4',
    title: 'Checkout fails on Safari',
    description: 'Users on Safari browser cannot complete checkout',
    status: 'open',
    priority: 'high',
    reportedBy: 'support@example.com',
    reportedAt: '2023-01-15T11:20:00Z'
  }
];

// Export feature requests
export const featureRequests = [
  {
    id: '1',
    title: 'Dark mode support',
    description: 'Add dark mode theme option for the dashboard',
    status: 'under-review',
    votes: 42,
    requestedBy: 'user@example.com',
    requestedAt: '2023-01-05T11:15:00Z'
  },
  {
    id: '2',
    title: 'Export dashboard data to CSV',
    description: 'Allow exporting analytics data to CSV format',
    status: 'planned',
    votes: 28,
    requestedBy: 'admin@example.com',
    requestedAt: '2023-01-08T16:45:00Z'
  },
  {
    id: '3',
    title: 'Bulk image uploads',
    description: 'Allow users to upload multiple images at once',
    status: 'in-progress',
    votes: 36,
    requestedBy: 'user@example.com',
    requestedAt: '2023-01-11T09:30:00Z'
  },
  {
    id: '4',
    title: 'API integration options',
    description: 'Provide integration with popular third-party APIs',
    status: 'under-review',
    votes: 19,
    requestedBy: 'developer@example.com',
    requestedAt: '2023-01-13T14:20:00Z'
  },
  {
    id: '5',
    title: 'Custom dashboard widgets',
    description: 'Allow users to customize their dashboard with widgets',
    status: 'planned',
    votes: 25,
    requestedBy: 'admin@example.com',
    requestedAt: '2023-01-14T10:10:00Z'
  }
];

// Export mock sites data with expanded properties
export const mockSites: SiteMetrics[] = [
  {
    id: '1',
    name: 'Fashion Boutique',
    url: 'https://fashionboutique.example.com',
    status: 'online',
    plan: 'Standard',
    launchDate: '2023-01-01T00:00:00Z',
    uptime: 99.8,
    responseTime: 245,
    visitorsToday: 342,
    pageLoadTime: 2.3,
    serverLocation: 'US East',
    sslExpiry: '2024-01-01T00:00:00Z',
    bounceRate: 35,
    averageSessionDuration: 120,
    pageViews: 15432,
    visitorsThisMonth: 8734,
    deviceBreakdown: [
      { device: 'Mobile', percentage: 65 },
      { device: 'Desktop', percentage: 30 },
      { device: 'Tablet', percentage: 5 }
    ],
    trafficSources: [
      { source: 'Organic Search', percentage: 45 },
      { source: 'Direct', percentage: 30 },
      { source: 'Social Media', percentage: 15 },
      { source: 'Referral', percentage: 10 }
    ]
  },
  {
    id: '2',
    name: 'Tech Blog',
    url: 'https://techblog.example.com',
    status: 'issues',
    plan: 'Premium',
    launchDate: null,
    uptime: 98.5,
    responseTime: 320,
    visitorsToday: 215,
    pageLoadTime: 3.1,
    serverLocation: 'EU West',
    sslExpiry: '2024-02-15T00:00:00Z',
    bounceRate: 42,
    averageSessionDuration: 95,
    pageViews: 9876,
    visitorsThisMonth: 5423,
    deviceBreakdown: [
      { device: 'Desktop', percentage: 60 },
      { device: 'Mobile', percentage: 35 },
      { device: 'Tablet', percentage: 5 }
    ],
    trafficSources: [
      { source: 'Organic Search', percentage: 55 },
      { source: 'Direct', percentage: 25 },
      { source: 'Referral', percentage: 15 },
      { source: 'Social Media', percentage: 5 }
    ]
  },
  {
    id: '3',
    name: 'Restaurant Menu',
    url: 'https://restaurant.example.com',
    status: 'online',
    plan: 'Premium',
    launchDate: '2023-01-15T00:00:00Z',
    uptime: 99.9,
    responseTime: 180,
    visitorsToday: 567,
    pageLoadTime: 1.8,
    serverLocation: 'US West',
    sslExpiry: '2024-03-10T00:00:00Z',
    bounceRate: 28,
    averageSessionDuration: 150,
    pageViews: 18934,
    visitorsThisMonth: 12340,
    deviceBreakdown: [
      { device: 'Mobile', percentage: 75 },
      { device: 'Desktop', percentage: 20 },
      { device: 'Tablet', percentage: 5 }
    ],
    trafficSources: [
      { source: 'Direct', percentage: 40 },
      { source: 'Organic Search', percentage: 35 },
      { source: 'Social Media', percentage: 20 },
      { source: 'Referral', percentage: 5 }
    ]
  },
  {
    id: '4',
    name: 'Fitness Studio',
    url: 'https://fitness.example.com',
    status: 'offline',
    plan: 'Standard',
    launchDate: '2022-11-10T00:00:00Z',
    uptime: 95.2,
    responseTime: 450,
    visitorsToday: 112,
    pageLoadTime: 4.2,
    serverLocation: 'Asia Pacific',
    sslExpiry: '2024-04-05T00:00:00Z',
    bounceRate: 48,
    averageSessionDuration: 85,
    pageViews: 5678,
    visitorsThisMonth: 3421,
    deviceBreakdown: [
      { device: 'Mobile', percentage: 70 },
      { device: 'Desktop', percentage: 25 },
      { device: 'Tablet', percentage: 5 }
    ],
    trafficSources: [
      { source: 'Social Media', percentage: 40 },
      { source: 'Organic Search', percentage: 30 },
      { source: 'Direct', percentage: 20 },
      { source: 'Referral', percentage: 10 }
    ]
  },
  {
    id: '5',
    name: 'Photography Portfolio',
    url: 'https://photography.example.com',
    status: 'online',
    plan: 'Basic',
    launchDate: null,
    uptime: 99.5,
    responseTime: 290,
    visitorsToday: 234,
    pageLoadTime: 2.7,
    serverLocation: 'EU Central',
    sslExpiry: '2024-05-20T00:00:00Z',
    bounceRate: 32,
    averageSessionDuration: 180,
    pageViews: 12345,
    visitorsThisMonth: 6789,
    deviceBreakdown: [
      { device: 'Desktop', percentage: 50 },
      { device: 'Mobile', percentage: 30 },
      { device: 'Tablet', percentage: 20 }
    ],
    trafficSources: [
      { source: 'Referral', percentage: 35 },
      { source: 'Social Media', percentage: 30 },
      { source: 'Organic Search', percentage: 25 },
      { source: 'Direct', percentage: 10 }
    ]
  }
];
