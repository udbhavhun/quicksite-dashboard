import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import ProgressTracker from '@/components/ProgressTracker';
import DetailedProgressTracker from '@/components/DetailedProgressTracker';
import OrderSummary from '@/components/OrderSummary';
import ProjectTimeline from '@/components/ProjectTimeline';
import PackageCard from '@/components/PackageCard';
import CustomerRequirements from '@/components/CustomerRequirements';
import ProjectFeedback from '@/components/ProjectFeedback';
import { ORDERS, PACKAGES } from '@/lib/data';
import { Clock, Package as PackageIcon, RefreshCw, Zap, Layers, Users, FileText, MessageSquare, AlertTriangle, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState(ORDERS[0]);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimateIn(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const [viewType, setViewType] = useState<'customer' | 'admin'>('customer');
  
  const toggleView = () => {
    setAnimateIn(false);
    
    setTimeout(() => {
      setViewType(viewType === 'customer' ? 'admin' : 'customer');
      setAnimateIn(true);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-quicksite-blue border-t-transparent animate-spin mb-4"></div>
            <span className="text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header userType={viewType} userName={viewType === 'admin' ? 'Admin User' : 'John Doe'} />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {viewType === 'customer' ? 'My Dashboard' : 'Admin Dashboard'}
              </h1>
              <p className="text-gray-600">
                {viewType === 'customer' 
                  ? 'Track your website build progress and manage your orders' 
                  : 'Monitor customer orders and project progress'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button 
                onClick={toggleView}
                className="flex items-center justify-center py-2 px-4 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <RefreshCw size={16} className="mr-2" />
                Switch to {viewType === 'customer' ? 'Admin' : 'Customer'} View
              </button>
              
              <button
                onClick={() => ORDERS.length > 0 && navigate(`/orders/${ORDERS[0].id}`)}
                className="flex items-center justify-center py-2 px-4 bg-quicksite-blue text-white rounded-lg shadow-sm text-sm font-medium hover:bg-quicksite-dark-blue transition-colors duration-200"
              >
                <FileText size={16} className="mr-2" />
                View Order Details
              </button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <PackageIcon size={20} className="text-quicksite-blue" />, label: "Active Orders", value: viewType === 'customer' ? 1 : 5, bgColor: "bg-quicksite-blue/10" },
              { icon: <Zap size={20} className="text-quicksite-success" />, label: "Completed Projects", value: viewType === 'customer' ? 1 : 48, bgColor: "bg-quicksite-success/10" },
              { icon: <Clock size={20} className="text-quicksite-warning" />, label: "Pending Action", value: viewType === 'customer' ? 1 : 3, bgColor: "bg-quicksite-warning/10" },
              { icon: <MessageSquare size={20} className="text-gray-500" />, label: "New Messages", value: viewType === 'customer' ? 2 : 12, bgColor: "bg-gray-100" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex items-center transition-transform duration-300 hover:translate-y-[-5px]"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mr-3`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <h3 className="text-xl font-semibold">{stat.value}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          
          {viewType === 'customer' ? (
            <>
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Progress</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">Current Project</h2>
                      <div className="mt-2 md:mt-0">
                        <StatusBadge status={activeOrder.stages.some(s => s.status === 'in-progress') ? 'in-progress' : 'completed'} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1">
                        <OrderSummary order={activeOrder} />
                      </div>
                      <div className="lg:col-span-2">
                        <ProgressTracker stages={activeOrder.stages} />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Project Timeline</h2>
                    <ProjectTimeline order={activeOrder} />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Explore More Packages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {PACKAGES.slice(0, 3).map((pkg, index) => (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        >
                          <PackageCard package={pkg} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="detailed">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Detailed Project Progress</h2>
                    <DetailedProgressTracker stages={activeOrder.stages} />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="requirements">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Project Requirements</h2>
                    <CustomerRequirements order={activeOrder} userType="customer" />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="communication">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Project Communication</h2>
                    <ProjectFeedback order={activeOrder} userType="customer" />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Recent Orders</h2>
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-quicksite-blue hover:text-quicksite-dark-blue flex items-center"
                  >
                    View All Orders <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {ORDERS.map((order, index) => (
                          <motion.tr 
                            key={order.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 10 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.customer.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.package.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={
                                order.stages.every(s => s.status === 'completed') ? 'completed' :
                                order.stages.some(s => s.status === 'in-progress') ? 'in-progress' :
                                'pending'
                              } size="sm" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              ₹{order.totalAmount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button className="text-quicksite-blue hover:text-quicksite-dark-blue transition-colors duration-150">
                                View Details
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
              
              <Tabs defaultValue="projectProgress" className="mb-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="projectProgress">Project Progress</TabsTrigger>
                  <TabsTrigger value="customerFeedback">Customer Feedback</TabsTrigger>
                  <TabsTrigger value="packageManagement">Packages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="projectProgress">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Active Project Progress</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1">
                        <OrderSummary order={ORDERS[0]} />
                      </div>
                      <div className="lg:col-span-2">
                        <DetailedProgressTracker stages={ORDERS[0].stages} />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <CustomerRequirements order={ORDERS[0]} userType="admin" />
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="customerFeedback">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Customer Communication</h2>
                    <ProjectFeedback order={ORDERS[0]} userType="admin" />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="packageManagement">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold">Manage Packages</h2>
                      <button className="py-2 px-4 bg-quicksite-blue text-white rounded-lg hover:bg-quicksite-dark-blue transition-colors duration-200 flex items-center">
                        <span className="mr-2">+</span> Add Package
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {PACKAGES.map((pkg, index) => (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <PackageCard key={pkg.id} package={pkg} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-bold text-quicksite-blue">quicksite</span>
            <p className="text-sm text-gray-600 mt-1">powered by Clear Business</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-quicksite-blue transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-quicksite-blue transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-sm text-gray-600 hover:text-quicksite-blue transition-colors duration-200">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
