
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Search, 
  Server, 
  Globe, 
  ArrowUpRight, 
  Clock, 
  Shield, 
  Users, 
  TrendingUp,
  Activity,
  ArrowRight,
  ArrowLeft,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { mockSites, type SiteMetrics } from '@/lib/site-data';
import { ORDERS } from '@/lib/data';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SitePerformance = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedSite, setSelectedSite] = useState<SiteMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Filter sites based on search query
  const filteredSites = mockSites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (site: SiteMetrics) => {
    setSelectedSite(site);
    setCurrentView('detail');
    setActiveTab('overview');
    // Scroll to top when viewing details
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSite(null);
  };

  // Format bytes to human-readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format milliseconds to seconds with 2 decimal places
  const formatLoadTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + 's';
  };

  // Generate sample daily traffic data
  const generateDailyTrafficData = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.floor(Math.random() * 500) + 500
      };
    });
  };

  // Generate hourly traffic data for the current day
  const generateHourlyTrafficData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      value: Math.floor(Math.random() * 200) + 50
    }));
  };

  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <SidebarTrigger className="mr-2 sm:hidden" />
                {currentView === 'detail' && (
                  <Button
                    variant="ghost"
                    className="mr-3 flex items-center"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to all sites
                  </Button>
                )}
                <h1 className="text-3xl font-bold text-gradient">
                  {currentView === 'list' ? 'Site Performance' : selectedSite?.name}
                </h1>
              </div>
              
              {currentView === 'list' && (
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              )}
              
              {currentView === 'detail' && selectedSite && (
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedSite.status === 'online' ? 'bg-green-100 text-green-800' :
                    selectedSite.status === 'issues' ? 'bg-yellow-100 text-yellow-800' :
                    selectedSite.status === 'offline' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedSite.status.charAt(0).toUpperCase() + selectedSite.status.slice(1)}
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Visit Website
                  </Button>
                </div>
              )}
            </div>
            
            {currentView === 'list' && (
              <>
                <div className="glass-card p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        placeholder="Search sites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSites.map((site) => (
                    <motion.div
                      key={site.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{site.name}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Globe className="h-3 w-3 mr-1" />
                                {site.url}
                              </CardDescription>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              site.status === 'online' ? 'bg-green-100 text-green-800' :
                              site.status === 'issues' ? 'bg-yellow-100 text-yellow-800' :
                              site.status === 'offline' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 flex-grow">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded p-3">
                              <div className="text-sm text-gray-500 mb-1">Uptime</div>
                              <div className="text-xl font-semibold">{site.uptime}%</div>
                            </div>
                            <div className="bg-gray-50 rounded p-3">
                              <div className="text-sm text-gray-500 mb-1">Response</div>
                              <div className="text-xl font-semibold">{site.responseTime}ms</div>
                            </div>
                            <div className="bg-gray-50 rounded p-3">
                              <div className="text-sm text-gray-500 mb-1">Visitors Today</div>
                              <div className="text-xl font-semibold">{site.visitorsToday}</div>
                            </div>
                            <div className="bg-gray-50 rounded p-3">
                              <div className="text-sm text-gray-500 mb-1">Page Load</div>
                              <div className="text-xl font-semibold">{site.pageLoadTime}s</div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                          <Button 
                            variant="outline" 
                            className="w-full flex items-center justify-center"
                            onClick={() => handleViewDetails(site)}
                          >
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                {filteredSites.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">No sites found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </>
            )}
            
            {currentView === 'detail' && selectedSite && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Uptime</p>
                          <h3 className="text-2xl font-bold">{selectedSite.uptime}%</h3>
                        </div>
                        <div className={`p-3 rounded-full ${
                          selectedSite.uptime > 99 ? 'bg-green-100' : 
                          selectedSite.uptime > 95 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Activity className={`h-5 w-5 ${
                            selectedSite.uptime > 99 ? 'text-green-600' : 
                            selectedSite.uptime > 95 ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedSite.uptime > 99 ? 'bg-green-500' : 
                            selectedSite.uptime > 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedSite.uptime}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Response Time</p>
                          <h3 className="text-2xl font-bold">{selectedSite.responseTime}ms</h3>
                        </div>
                        <div className={`p-3 rounded-full ${
                          selectedSite.responseTime < 300 ? 'bg-green-100' : 
                          selectedSite.responseTime < 500 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Clock className={`h-5 w-5 ${
                            selectedSite.responseTime < 300 ? 'text-green-600' : 
                            selectedSite.responseTime < 500 ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">28ms faster than last week</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Page Load Time</p>
                          <h3 className="text-2xl font-bold">{selectedSite.pageLoadTime}s</h3>
                        </div>
                        <div className={`p-3 rounded-full ${
                          selectedSite.pageLoadTime < 2.5 ? 'bg-green-100' : 
                          selectedSite.pageLoadTime < 4 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <TrendingUp className={`h-5 w-5 ${
                            selectedSite.pageLoadTime < 2.5 ? 'text-green-600' : 
                            selectedSite.pageLoadTime < 4 ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">0.3s improvement</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Visitors Today</p>
                          <h3 className="text-2xl font-bold">{selectedSite.visitorsToday}</h3>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedSite.visitorsToday > 300 ? '+12% from yesterday' : '-8% from yesterday'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="glass-card mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="traffic">Traffic</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Visitors</CardTitle>
                            <CardDescription>Daily visitor count over the past week</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={generateDailyTrafficData()}
                                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="#3B82F6" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Page Load Times</CardTitle>
                            <CardDescription>Average load time over the past 30 days</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={Array.from({ length: 30 }, (_, i) => ({
                                    name: `Day ${i + 1}`,
                                    value: Math.random() * 2 + 1
                                  }))}
                                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Device Breakdown</CardTitle>
                            <CardDescription>Visitor device types</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={selectedSite.deviceBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="percentage"
                                    nameKey="device"
                                    label={({ device, percentage }) => `${device}: ${percentage}%`}
                                  >
                                    {selectedSite.deviceBreakdown.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            
                            <div className="mt-4">
                              {selectedSite.deviceBreakdown.map((item, index) => (
                                <div key={index} className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span>{item.device}</span>
                                  </div>
                                  <span>{item.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Traffic Sources</CardTitle>
                            <CardDescription>Where your visitors come from</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {selectedSite.trafficSources.map((source, index) => (
                                <div key={index}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{source.source}</span>
                                    <span className="text-sm">{source.percentage}%</span>
                                  </div>
                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full"
                                      style={{ 
                                        width: `${source.percentage}%`,
                                        backgroundColor: COLORS[index % COLORS.length]
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <dl className="space-y-4">
                              <div className="flex justify-between">
                                <dt className="text-sm font-medium text-gray-500">Bounce Rate</dt>
                                <dd className="text-sm font-semibold">{selectedSite.bounceRate}%</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm font-medium text-gray-500">Avg. Session Duration</dt>
                                <dd className="text-sm font-semibold">{selectedSite.averageSessionDuration}s</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm font-medium text-gray-500">Page Views</dt>
                                <dd className="text-sm font-semibold">{selectedSite.pageViews.toLocaleString()}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm font-medium text-gray-500">Monthly Visitors</dt>
                                <dd className="text-sm font-semibold">{selectedSite.visitorsThisMonth.toLocaleString()}</dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="performance">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Page Load Time Breakdown</CardTitle>
                          <CardDescription>Average timing for each phase of page load</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { name: 'DNS Lookup', value: Math.random() * 50 + 10 },
                              { name: 'TCP Connection', value: Math.random() * 50 + 20 },
                              { name: 'TLS Negotiation', value: Math.random() * 70 + 30 },
                              { name: 'Time to First Byte', value: Math.random() * 100 + 50 },
                              { name: 'Content Download', value: Math.random() * 300 + 100 },
                              { name: 'DOM Processing', value: Math.random() * 200 + 50 },
                              { name: 'Render', value: Math.random() * 100 + 50 }
                            ].map((item, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">{item.name}</span>
                                  <span className="text-sm">{item.value.toFixed(2)}ms</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500"
                                    style={{ width: `${(item.value / 500) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Asset Performance</CardTitle>
                          <CardDescription>Load times for key assets</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr>
                                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load Time</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {[
                                  { name: 'main.css', size: Math.random() * 100000 + 50000, load: Math.random() * 100 + 20 },
                                  { name: 'app.js', size: Math.random() * 500000 + 200000, load: Math.random() * 200 + 50 },
                                  { name: 'vendor.js', size: Math.random() * 800000 + 300000, load: Math.random() * 300 + 80 },
                                  { name: 'hero-image.jpg', size: Math.random() * 2000000 + 500000, load: Math.random() * 400 + 100 },
                                  { name: 'fonts.woff2', size: Math.random() * 100000 + 20000, load: Math.random() * 150 + 30 }
                                ].map((asset, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium">{asset.name}</td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">{formatBytes(asset.size)}</td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">{formatLoadTime(asset.load)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle>Speed Index Over Time</CardTitle>
                          <CardDescription>Website performance score trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={Array.from({ length: 30 }, (_, i) => ({
                                  name: `Day ${i + 1}`,
                                  mobile: Math.floor(Math.random() * 40) + 60,
                                  desktop: Math.floor(Math.random() * 20) + 75
                                }))}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="mobile" stroke="#8884d8" name="Mobile Score" />
                                <Line type="monotone" dataKey="desktop" stroke="#82ca9d" name="Desktop Score" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="traffic">
                    <div className="grid grid-cols-1 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Hourly Traffic Today</CardTitle>
                          <CardDescription>Visitors per hour</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={generateHourlyTrafficData()}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3B82F6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Popular Pages</CardTitle>
                            <CardDescription>Most visited pages</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[
                                { page: 'Home', visits: Math.floor(Math.random() * 1000) + 2000 },
                                { page: 'Products', visits: Math.floor(Math.random() * 1000) + 1000 },
                                { page: 'About Us', visits: Math.floor(Math.random() * 500) + 500 },
                                { page: 'Contact', visits: Math.floor(Math.random() * 300) + 200 },
                                { page: 'Blog', visits: Math.floor(Math.random() * 800) + 800 }
                              ].map((item, index) => (
                                <div key={index}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{item.page}</span>
                                    <span className="text-sm">{item.visits.toLocaleString()} visits</span>
                                  </div>
                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-500"
                                      style={{ width: `${(item.visits / 3000) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Referral Sources</CardTitle>
                            <CardDescription>Top referrers to your site</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[
                                { name: 'Google', visits: Math.floor(Math.random() * 1000) + 2000 },
                                { name: 'Facebook', visits: Math.floor(Math.random() * 500) + 500 },
                                { name: 'Twitter', visits: Math.floor(Math.random() * 300) + 300 },
                                { name: 'LinkedIn', visits: Math.floor(Math.random() * 200) + 200 },
                                { name: 'Instagram', visits: Math.floor(Math.random() * 150) + 150 }
                              ].map((item, index) => (
                                <div key={index}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-sm">{item.visits.toLocaleString()} visits</span>
                                  </div>
                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-500"
                                      style={{ width: `${(item.visits / 3000) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Technical Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4">
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Server Location</dt>
                              <dd className="text-sm font-semibold">{selectedSite.serverLocation}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">SSL Certificate Expiry</dt>
                              <dd className="text-sm font-semibold">{new Date(selectedSite.sslExpiry).toLocaleDateString()}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">DNS Provider</dt>
                              <dd className="text-sm font-semibold">Cloudflare</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Web Server</dt>
                              <dd className="text-sm font-semibold">Nginx 1.21.4</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">CDN</dt>
                              <dd className="text-sm font-semibold">Cloudflare</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                              <dd className="text-sm font-semibold">192.168.1.1</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Server Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { name: 'CPU Usage', value: Math.floor(Math.random() * 40) + 20, max: 100 },
                              { name: 'Memory Usage', value: Math.floor(Math.random() * 60) + 30, max: 100 },
                              { name: 'Disk Usage', value: Math.floor(Math.random() * 50) + 30, max: 100 },
                              { name: 'Network I/O', value: Math.floor(Math.random() * 70) + 20, max: 100 }
                            ].map((item, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">{item.name}</span>
                                  <span className="text-sm">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      item.value < 50 ? 'bg-green-500' : 
                                      item.value < 80 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${(item.value / item.max) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle>Recent Errors</CardTitle>
                          <CardDescription>Last 5 errors detected</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedSite.status === 'issues' || selectedSite.status === 'offline' ? (
                                [
                                  { time: '2 hours ago', type: '404', message: 'Page not found', url: '/missing-page' },
                                  { time: '4 hours ago', type: 'JavaScript', message: 'Uncaught TypeError: Cannot read property', url: '/product/detail' },
                                  { time: '1 day ago', type: '500', message: 'Internal server error', url: '/api/data' },
                                  { time: '1 day ago', type: 'Connection', message: 'Failed to fetch API data', url: '/dashboard' },
                                  { time: '2 days ago', type: 'CSS', message: 'Failed to load resource', url: '/styles/main.css' }
                                ].map((error, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">{error.time}</td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-red-500">{error.type}</td>
                                    <td className="px-2 py-3 text-sm text-gray-500">{error.message}</td>
                                    <td className="px-2 py-3 text-sm text-gray-500">{error.url}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4} className="px-2 py-8 text-center text-gray-500">No errors detected in the last 7 days</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default SitePerformance;
