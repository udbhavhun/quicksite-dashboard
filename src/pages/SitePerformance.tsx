
import React from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { Gauge, BarChart3, ArrowUp, ArrowDown, Search, Clock, Zap, Users, Globe, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const performanceData = [
  { name: 'Mon', desktop: 95, mobile: 78 },
  { name: 'Tue', desktop: 92, mobile: 82 },
  { name: 'Wed', desktop: 88, mobile: 74 },
  { name: 'Thu', desktop: 91, mobile: 76 },
  { name: 'Fri', desktop: 93, mobile: 80 },
  { name: 'Sat', desktop: 96, mobile: 85 },
  { name: 'Sun', desktop: 94, mobile: 83 },
];

const trafficData = [
  { name: 'Jan', users: 400, pageViews: 1200 },
  { name: 'Feb', users: 500, pageViews: 1500 },
  { name: 'Mar', users: 600, pageViews: 1800 },
  { name: 'Apr', users: 800, pageViews: 2400 },
  { name: 'May', users: 1200, pageViews: 3600 },
  { name: 'Jun', users: 1500, pageViews: 4500 },
];

const SitePerformance = () => {
  const { userName, userType } = useUserStore();
  
  const metrics = [
    { 
      name: 'Performance Score', 
      value: 92, 
      unit: '/100', 
      trend: 'up', 
      percent: '+5%', 
      icon: Gauge,
      color: 'bg-green-500'
    },
    { 
      name: 'Load Time', 
      value: 1.2, 
      unit: 's', 
      trend: 'down', 
      percent: '-0.3s', 
      icon: Clock,
      color: 'bg-blue-500'
    },
    { 
      name: 'TTFB', 
      value: 220, 
      unit: 'ms', 
      trend: 'down', 
      percent: '-40ms', 
      icon: Zap,
      color: 'bg-purple-500'
    },
    { 
      name: 'SEO Score', 
      value: 88, 
      unit: '/100', 
      trend: 'up', 
      percent: '+12%', 
      icon: Search,
      color: 'bg-orange-500'
    },
  ];
  
  return (
    <div className="min-h-screen w-full flex">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header userName={userName} />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-2 sm:hidden" />
                    <h1 className="text-3xl font-bold text-gradient">Site Performance</h1>
                  </div>
                  <p className="text-gray-600">Monitor your website's speed and performance metrics</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <select className="rounded-md border border-gray-300 p-2 text-sm">
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                  </select>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{metric.name}</p>
                      <div className="flex items-baseline mt-1">
                        <h3 className="text-2xl font-bold">{metric.value}{metric.unit}</h3>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full flex items-center ${
                          metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {metric.trend === 'up' ? (
                            <ArrowUp size={12} className="mr-0.5" />
                          ) : (
                            <ArrowDown size={12} className="mr-0.5" />
                          )}
                          {metric.percent}
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
                      <metric.icon className={`h-5 w-5 ${metric.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Performance Score</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="desktop" 
                        stroke="#0080ff" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                        name="Desktop"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mobile" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                        name="Mobile"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Traffic Overview</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        yAxisId="left" 
                        dataKey="users" 
                        fill="#0080ff" 
                        name="Unique Visitors"
                        radius={[4, 4, 0, 0]} 
                      />
                      <Bar 
                        yAxisId="right" 
                        dataKey="pageViews" 
                        fill="#10b981" 
                        name="Page Views"
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="glass-card p-6 md:col-span-1"
              >
                <h2 className="text-xl font-semibold mb-4">Page Insights</h2>
                <div className="space-y-4">
                  {[
                    { page: 'Homepage', score: 95 },
                    { page: 'About Us', score: 88 },
                    { page: 'Services', score: 92 },
                    { page: 'Contact', score: 90 },
                    { page: 'Blog', score: 86 },
                  ].map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm truncate mr-2">{page.page}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${page.score}%`,
                              backgroundColor: page.score >= 90 ? '#10b981' : page.score >= 80 ? '#0080ff' : '#f59e0b'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{page.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="glass-card p-6 md:col-span-2"
              >
                <h2 className="text-xl font-semibold mb-4">Optimization Suggestions</h2>
                <div className="space-y-4">
                  {[
                    { 
                      title: 'Optimize Images', 
                      description: 'Compress and resize images to improve page load times.', 
                      priority: 'High',
                      impact: 'Medium'
                    },
                    { 
                      title: 'Enable Browser Caching', 
                      description: 'Set proper cache headers to speed up repeat visits.', 
                      priority: 'Medium',
                      impact: 'High'
                    },
                    { 
                      title: 'Minify JavaScript', 
                      description: 'Reduce JavaScript file size to improve parsing time.', 
                      priority: 'Medium',
                      impact: 'Low'
                    },
                    { 
                      title: 'Implement Lazy Loading', 
                      description: 'Defer loading of non-critical resources until needed.', 
                      priority: 'Low',
                      impact: 'Medium'
                    },
                  ].map((suggestion, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white border border-gray-100">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            suggestion.priority === 'High' ? 'bg-red-100 text-red-700' : 
                            suggestion.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {suggestion.priority}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            suggestion.impact === 'High' ? 'bg-blue-100 text-blue-700' : 
                            suggestion.impact === 'Medium' ? 'bg-indigo-100 text-indigo-700' : 
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {suggestion.impact} Impact
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default SitePerformance;
