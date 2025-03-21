
export interface SiteMetrics {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  status: 'online' | 'issues' | 'offline' | 'maintenance';
  uptime: number;
  responseTime: number;
  visitorsToday: number;
  visitorsThisMonth: number;
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  trafficSources: {
    source: string;
    percentage: number;
  }[];
  deviceBreakdown: {
    device: string;
    percentage: number;
  }[];
  pageLoadTime: number;
  serverLocation: string;
  sslExpiry: string;
  lastUpdated: string;
  orderId: string;
}

// Mock data
export const mockSites: SiteMetrics[] = [
  {
    id: 'site-1',
    name: 'Acme E-Commerce',
    url: 'acme-ecommerce.com',
    status: 'online',
    uptime: 99.98,
    responseTime: 267,
    visitorsToday: 342,
    visitorsThisMonth: 8745,
    pageViews: 32890,
    bounceRate: 25.4,
    averageSessionDuration: 195,
    trafficSources: [
      { source: 'Organic', percentage: 45 },
      { source: 'Direct', percentage: 30 },
      { source: 'Social', percentage: 15 },
      { source: 'Referral', percentage: 10 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 55 },
      { device: 'Mobile', percentage: 35 },
      { device: 'Tablet', percentage: 10 }
    ],
    pageLoadTime: 2.3,
    serverLocation: 'US East',
    sslExpiry: '2024-09-15',
    lastUpdated: '2023-12-05T15:30:00',
    orderId: 'ORD-2023-001'
  },
  {
    id: 'site-2',
    name: 'Wilson Travel',
    url: 'wilson-travel.com',
    status: 'issues',
    uptime: 98.75,
    responseTime: 425,
    visitorsToday: 217,
    visitorsThisMonth: 5631,
    pageViews: 18752,
    bounceRate: 32.7,
    averageSessionDuration: 165,
    trafficSources: [
      { source: 'Organic', percentage: 35 },
      { source: 'Direct', percentage: 25 },
      { source: 'Social', percentage: 25 },
      { source: 'Referral', percentage: 15 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 40 },
      { device: 'Mobile', percentage: 50 },
      { device: 'Tablet', percentage: 10 }
    ],
    pageLoadTime: 3.7,
    serverLocation: 'Europe (London)',
    sslExpiry: '2024-07-22',
    lastUpdated: '2023-12-05T14:45:00',
    orderId: 'ORD-2023-002'
  },
  {
    id: 'site-3',
    name: 'Brown Medical',
    url: 'brown-medical.com',
    status: 'online',
    uptime: 99.95,
    responseTime: 189,
    visitorsToday: 156,
    visitorsThisMonth: 3412,
    pageViews: 9875,
    bounceRate: 18.2,
    averageSessionDuration: 250,
    trafficSources: [
      { source: 'Organic', percentage: 60 },
      { source: 'Direct', percentage: 30 },
      { source: 'Social', percentage: 5 },
      { source: 'Referral', percentage: 5 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 70 },
      { device: 'Mobile', percentage: 25 },
      { device: 'Tablet', percentage: 5 }
    ],
    pageLoadTime: 1.9,
    serverLocation: 'US West',
    sslExpiry: '2024-11-10',
    lastUpdated: '2023-12-05T16:15:00',
    orderId: 'ORD-2023-003'
  }
];
