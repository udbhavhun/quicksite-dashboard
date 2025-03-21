
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/userStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Activity, 
  ArrowRight, 
  ArrowUpRight, 
  Clock, 
  DownloadCloud, 
  ExternalLink, 
  Eye, 
  Filter, 
  Globe, 
  HardDrive, 
  Search, 
  Server, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Zap,
  Laptop,
  Smartphone,
  Tablet,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  ArrowLeft
} from 'lucide-react';
import { ORDERS } from '@/lib/data';

// Types
interface SiteMetrics {
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

interface PerformanceData {
  date: string;
  uptime: number;
  responseTime: number;
  visitors: number;
  pageViews: number;
  bounceRate: number;
}

// Mock data
const mockSites: SiteMetrics[] = [
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

// Mock historical data for charts
const mockHistoricalData: PerformanceData[] = [
  { date: 'Nov 1', uptime: 99.9, responseTime: 280, visitors: 320, pageViews: 1250, bounceRate: 26.3 },
  { date: 'Nov 2', uptime: 100, responseTime: 275, visitors: 345, pageViews: 1320, bounceRate: 25.8 },
  { date: 'Nov 3', uptime: 100, responseTime: 260, visitors: 332, pageViews: 1190, bounceRate: 24.5 },
  { date: 'Nov 4', uptime: 99.7, responseTime: 295, visitors: 310, pageViews: 1100, bounceRate: 27.2 },
  { date: 'Nov 5', uptime: 99.8, responseTime: 270, visitors: 328, pageViews: 1230, bounceRate: 26.1 },
  { date: 'Nov 6', uptime: 99.9, responseTime: 250, visitors: 350, pageViews: 1340, bounceRate: 24.9 },
  { date: 'Nov 7', uptime: 100, responseTime: 240, visitors: 370, pageViews: 1420, bounceRate: 24.2 },
  { date: 'Nov 8', uptime: 100, responseTime: 245, visitors: 365, pageViews: 1380, bounceRate: 24.0 },
  { date: 'Nov 9', uptime: 99.9, responseTime: 255, visitors: 348, pageViews: 1290, bounceRate: 25.3 },
  { date: 'Nov 10', uptime: 100, responseTime: 262, visitors: 342, pageViews: 1270, bounceRate: 25.6 },
  { date: 'Nov 11', uptime: 99.8, responseTime: 280, visitors: 330, pageViews: 1210, bounceRate: 26.8 },
  { date: 'Nov 12', uptime: 99.9, responseTime: 270, visitors: 338, pageViews: 1240, bounceRate: 26.0 },
  { date: 'Nov 13', uptime: 100, responseTime: 260, visitors: 352, pageViews: 1350, bounceRate: 25.1 },
  { date: 'Nov 14', uptime: 100, responseTime: 258, visitors: 360, pageViews: 1410, bounceRate: 24.7 },
  { date: 'Nov 15', uptime: 99.9, responseTime: 265, visitors: 340, pageViews: 1260, bounceRate: 25.7 },
  { date: 'Nov 16', uptime: 99.7, responseTime: 290, visitors: 318, pageViews: 1180, bounceRate: 27.5 },
  { date: 'Nov 17', uptime: 99.8, responseTime: 275, visitors: 325, pageViews: 1200, bounceRate: 26.4 },
  { date: 'Nov 18', uptime: 99.9, responseTime: 262, visitors: 345, pageViews: 1280, bounceRate: 25.5 },
  { date: 'Nov 19', uptime: 100, responseTime: 250, visitors: 365, pageViews: 1370, bounceRate: 24.8 },
  { date: 'Nov 20', uptime: 100, responseTime: 245, visitors: 375, pageViews: 1430, bounceRate: 24.3 },
  { date: 'Nov 21', uptime: 99.9, responseTime: 252, visitors: 362, pageViews: 1360, bounceRate: 24.6 },
  { date: 'Nov 22', uptime: 99.8, responseTime: 260, visitors: 350, pageViews: 1330, bounceRate: 25.0 },
  { date: 'Nov 23', uptime: 99.9, responseTime: 265, visitors: 340, pageViews: 1290, bounceRate: 25.4 },
  { date: 'Nov 24', uptime: 100, responseTime: 255, visitors: 355, pageViews: 1340, bounceRate: 25.2 },
  { date: 'Nov 25', uptime: 100, responseTime: 248, visitors: 368, pageViews: 1400, bounceRate: 24.5 },
  { date: 'Nov 26', uptime: 99.9, responseTime: 252, visitors: 360, pageViews: 1370, bounceRate: 24.7 },
  { date: 'Nov 27', uptime: 99.8, responseTime: 258, visitors: 352, pageViews: 1330, bounceRate: 25.0 },
  { date: 'Nov 28', uptime: 99.9, responseTime: 250, visitors: 358, pageViews: 1350, bounceRate: 24.8 },
  { date: 'Nov 29', uptime: 100, responseTime: 245, visitors: 370, pageViews: 1390, bounceRate: 24.4 },
  { date: 'Nov 30', uptime: 99.95, responseTime: 248, visitors: 365, pageViews: 1380, bounceRate: 24.5 }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Helper components
const StatusBadge = ({ status }: { status: SiteMetrics['status'] }) => {
  const statusStyles = {
    online: 'bg-green-100 text-green-800',
    issues: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-red-100 text-red-800',
    maintenance: 'bg-blue-100 text-blue-800'
  };
  
  const statusText = {
    online: 'Online',
    issues: 'Issues Detected',
    offline: 'Offline',
    maintenance: 'Maintenance'
  };
  
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  subtext,
  iconBackgroundColor = 'bg-blue-100',
  iconColor = 'text-blue-600'
}: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: { value: number; isPositive: boolean };
  subtext?: string;
  iconBackgroundColor?: string;
  iconColor?: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-center mt-1">
              <h3 className="text-2xl font-semibold">{value}</h3>
              {change && (
                <span className={`text-xs font-medium ml-2 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
              )}
            </div>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
          </div>
          <div className={`p-3 rounded-full ${iconBackgroundColor} ${iconColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SitePerformance = () => {
  const { toast } = useToast();
  const { userType } = useUserStore();
  const [sites, setSites] = useState<SiteMetrics[]>(mockSites);
  const [selectedSite, setSelectedSite] = useState<SiteMetrics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [chartType, setChartType] = useState('line');
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isEditSiteOpen, setIsEditSiteOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  
  // Filter sites based on search
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get order name from order ID
  const getOrderNameFromId = (orderId: string) => {
    const order = ORDERS.find(o => o.id === orderId);
    return order ? order.package.name : 'Unknown';
  };

  // Handle viewing site details
  const handleViewSite = (site: SiteMetrics) => {
    setSelectedSite(site);
  };

  // Format time in seconds to minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format large numbers with comma separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {!selectedSite ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-2 sm:hidden" />
                    <h1 className="text-3xl font-bold text-gradient">Site Performance</h1>
                  </div>
                  
                  {userType === 'admin' && (
                    <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-quicksite-blue hover:bg-quicksite-dark-blue">
                          Add New Site
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Site to Monitor</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {/* Form fields for adding a site would go here */}
                          <p className="text-sm text-gray-500">
                            Form implementation for adding sites would go here in a real application.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                <div className="glass-card p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        placeholder="Search sites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sites</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="issues">Issues</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="icon">
                        <Filter size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSites.map((site, index) => (
                    <motion.div
                      key={site.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="p-6 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="mb-1">{site.name}</CardTitle>
                              <CardDescription className="flex items-center">
                                <Globe size={14} className="mr-1" />
                                {site.url}
                              </CardDescription>
                            </div>
                            <StatusBadge status={site.status} />
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-3 pb-3">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Uptime</p>
                              <p className="font-semibold text-sm">{site.uptime}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Response Time</p>
                              <p className="font-semibold text-sm">{site.responseTime}ms</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Today's Visitors</p>
                              <p className="font-semibold text-sm">{site.visitorsToday}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Page Load Time</p>
                              <p className="font-semibold text-sm">{site.pageLoadTime}s</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-1">Performance Score</p>
                            <div className="flex items-center">
                              <div className="w-full mr-2">
                                <Progress value={
                                  site.status === 'online' ? 90 : 
                                  site.status === 'issues' ? 65 :
                                  site.status === 'maintenance' ? 50 : 30
                                } className="h-2" />
                              </div>
                              <span className="text-xs font-medium">
                                {site.status === 'online' ? '90' : 
                                 site.status === 'issues' ? '65' :
                                 site.status === 'maintenance' ? '50' : '30'}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-xs text-gray-500">
                            <p>Related Order: <span className="font-medium">{site.orderId}</span></p>
                            <p className="truncate">{getOrderNameFromId(site.orderId)}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 border-t border-gray-100 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleViewSite(site)}
                          >
                            View Details
                            <ArrowRight size={14} className="ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {filteredSites.length === 0 && (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-500">No sites found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSite(null)}
                    className="mr-4"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to All Sites
                  </Button>
                  
                  <div>
                    <h1 className="text-2xl font-bold">{selectedSite.name}</h1>
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe size={14} className="mr-1" />
                      <a 
                        href={`https://${selectedSite.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-quicksite-blue flex items-center"
                      >
                        {selectedSite.url}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                      <span className="mx-2">•</span>
                      <StatusBadge status={selectedSite.status} />
                    </div>
                  </div>
                  
                  {userType === 'admin' && (
                    <div className="ml-auto">
                      <Dialog open={isEditSiteOpen} onOpenChange={setIsEditSiteOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Edit Site Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Site Settings</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {/* Form fields for editing site would go here */}
                            <p className="text-sm text-gray-500">
                              Form implementation for editing site settings would go here in a real application.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="mb-6 glass-card p-1 bg-white/50 overflow-x-auto flex whitespace-nowrap">
                      <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white flex items-center">
                        <Activity size={16} className="mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="visitors" className="rounded-lg data-[state=active]:bg-white flex items-center">
                        <Users size={16} className="mr-2" />
                        Visitors
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="rounded-lg data-[state=active]:bg-white flex items-center">
                        <Zap size={16} className="mr-2" />
                        Performance
                      </TabsTrigger>
                      <TabsTrigger value="uptime" className="rounded-lg data-[state=active]:bg-white flex items-center">
                        <TrendingUp size={16} className="mr-2" />
                        Uptime
                      </TabsTrigger>
                      <TabsTrigger value="technical" className="rounded-lg data-[state=active]:bg-white flex items-center">
                        <Server size={16} className="mr-2" />
                        Technical
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 mr-2">Date Range:</p>
                          <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7d">Last 7 days</SelectItem>
                              <SelectItem value="30d">Last 30 days</SelectItem>
                              <SelectItem value="90d">Last 90 days</SelectItem>
                              <SelectItem value="6m">Last 6 months</SelectItem>
                              <SelectItem value="1y">Last year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500 mr-2">Chart Type:</p>
                          <div className="flex border rounded-md overflow-hidden">
                            <Button 
                              variant={chartType === 'line' ? 'default' : 'ghost'} 
                              size="sm"
                              className="rounded-none h-8 px-3"
                              onClick={() => setChartType('line')}
                            >
                              <LineChartIcon size={16} />
                            </Button>
                            <Button 
                              variant={chartType === 'bar' ? 'default' : 'ghost'} 
                              size="sm"
                              className="rounded-none h-8 px-3 border-l border-r"
                              onClick={() => setChartType('bar')}
                            >
                              <BarChartIcon size={16} />
                            </Button>
                            <Button 
                              variant={chartType === 'area' ? 'default' : 'ghost'} 
                              size="sm"
                              className="rounded-none h-8 px-3"
                              onClick={() => setChartType('area')}
                            >
                              <PieChartIcon size={16} />
                            </Button>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <DownloadCloud size={14} className="mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <MetricCard
                          title="Uptime"
                          value={`${selectedSite.uptime}%`}
                          icon={<TrendingUp size={20} />}
                          change={{ value: 0.2, isPositive: true }}
                          subtext="Last 30 days"
                          iconBackgroundColor="bg-green-100"
                          iconColor="text-green-600"
                        />
                        <MetricCard
                          title="Response Time"
                          value={`${selectedSite.responseTime} ms`}
                          icon={<Clock size={20} />}
                          change={{ value: 5.3, isPositive: false }}
                          subtext="Average"
                          iconBackgroundColor="bg-amber-100"
                          iconColor="text-amber-600"
                        />
                        <MetricCard
                          title="Visitors Today"
                          value={formatNumber(selectedSite.visitorsToday)}
                          icon={<Users size={20} />}
                          change={{ value: 12.7, isPositive: true }}
                          subtext="vs. yesterday"
                          iconBackgroundColor="bg-purple-100"
                          iconColor="text-purple-600"
                        />
                        <MetricCard
                          title="Page Load Time"
                          value={`${selectedSite.pageLoadTime} s`}
                          icon={<Zap size={20} />}
                          change={{ value: 8.1, isPositive: true }}
                          subtext="Average"
                          iconBackgroundColor="bg-blue-100"
                          iconColor="text-blue-600"
                        />
                      </div>
                    </div>
                    
                    <TabsContent value="overview" className="space-y-6">
                      <Card className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>Visitors Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              {chartType === 'line' ? (
                                <LineChart
                                  data={mockHistoricalData}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
                                  <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" />
                                </LineChart>
                              ) : chartType === 'bar' ? (
                                <BarChart
                                  data={mockHistoricalData}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="visitors" fill="#8884d8" />
                                  <Bar dataKey="pageViews" fill="#82ca9d" />
                                </BarChart>
                              ) : (
                                <AreaChart
                                  data={mockHistoricalData}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="visitors" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                  <Area type="monotone" dataKey="pageViews" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                                </AreaChart>
                              )}
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Traffic Sources</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={selectedSite.trafficSources}
                                    dataKey="percentage"
                                    nameKey="source"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {selectedSite.trafficSources.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Device Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={selectedSite.deviceBreakdown}
                                    dataKey="percentage"
                                    nameKey="device"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#82ca9d"
                                    label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {selectedSite.deviceBreakdown.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            
                            <div className="flex justify-center mt-4 space-x-6">
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                                  <Laptop size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Desktop</p>
                                  <p className="text-xs text-gray-500">{selectedSite.deviceBreakdown[0].percentage}%</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-2">
                                  <Smartphone size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Mobile</p>
                                  <p className="text-xs text-gray-500">{selectedSite.deviceBreakdown[1].percentage}%</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-2">
                                  <Tablet size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Tablet</p>
                                  <p className="text-xs text-gray-500">{selectedSite.deviceBreakdown[2].percentage}%</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Engagement Metrics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <p className="text-sm text-gray-500">Bounce Rate</p>
                                  <p className="text-sm font-medium">{selectedSite.bounceRate}%</p>
                                </div>
                                <Progress value={selectedSite.bounceRate} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <p className="text-sm text-gray-500">Avg. Session Duration</p>
                                  <p className="text-sm font-medium">{formatTime(selectedSite.averageSessionDuration)}</p>
                                </div>
                                <Progress value={(selectedSite.averageSessionDuration / 600) * 100} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <p className="text-sm text-gray-500">Pages Per Session</p>
                                  <p className="text-sm font-medium">3.7</p>
                                </div>
                                <Progress value={74} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Top Pages</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">/home</p>
                                  <p className="text-xs text-gray-500">42% of total views</p>
                                </div>
                                <p className="text-sm font-medium">13,245</p>
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">/products</p>
                                  <p className="text-xs text-gray-500">28% of total views</p>
                                </div>
                                <p className="text-sm font-medium">8,923</p>
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">/about</p>
                                  <p className="text-xs text-gray-500">15% of total views</p>
                                </div>
                                <p className="text-sm font-medium">4,762</p>
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">/contact</p>
                                  <p className="text-xs text-gray-500">10% of total views</p>
                                </div>
                                <p className="text-sm font-medium">3,185</p>
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">/blog</p>
                                  <p className="text-xs text-gray-500">5% of total views</p>
                                </div>
                                <p className="text-sm font-medium">1,592</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Technical Info</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                                  <Server size={16} />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Server Location</p>
                                  <p className="text-sm font-medium">{selectedSite.serverLocation}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                                  <ShieldCheck size={16} />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">SSL Certificate</p>
                                  <p className="text-sm font-medium">Valid until {new Date(selectedSite.sslExpiry).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                                  <HardDrive size={16} />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Server Type</p>
                                  <p className="text-sm font-medium">Nginx</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                                  <Globe size={16} />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">DNS Provider</p>
                                  <p className="text-sm font-medium">Cloudflare</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                                  <Eye size={16} />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Last Monitored</p>
                                  <p className="text-sm font-medium">{new Date(selectedSite.lastUpdated).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="visitors">
                      <Card>
                        <CardHeader>
                          <CardTitle>Visitor Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500">Detailed visitor analytics content would go here.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="performance">
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500">Detailed performance metrics content would go here.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="uptime">
                      <Card>
                        <CardHeader>
                          <CardTitle>Uptime Monitoring</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500">Detailed uptime monitoring content would go here.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="technical">
                      <Card>
                        <CardHeader>
                          <CardTitle>Technical Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500">Detailed technical information would go here.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default SitePerformance;
