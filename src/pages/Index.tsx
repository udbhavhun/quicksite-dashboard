
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import StatusBadge from '@/components/StatusBadge';
import ProgressTracker from '@/components/ProgressTracker';
import OrderSummary from '@/components/OrderSummary';
import { ORDERS } from '@/lib/data';
import { Package as PackageIcon, RefreshCw, FileText, Bell, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "@/hooks/use-toast";
import { useUserStore } from '@/stores/userStore';

const Index = () => {
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState(ORDERS[0]);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const { userType, userName } = useUserStore();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimateIn(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const showNotification = () => {
    toast({
      title: "New update available",
      description: "The design mockups are ready for your review.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="glass-card p-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-quicksite-blue border-t-transparent animate-spin mb-4"></div>
            <span className="text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header userName={userName} />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-2 sm:hidden" />
                    <h1 className="text-3xl font-bold text-gradient">
                      {userType === 'customer' ? 'My Dashboard' : 'Admin Dashboard'}
                    </h1>
                  </div>
                  <p className="text-gray-600">
                    {userType === 'customer' 
                      ? 'Track your website build progress and manage your orders' 
                      : 'Monitor customer orders and project progress'}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={showNotification}
                    className="relative micro-bounce"
                  >
                    <Bell size={16} className="mr-2" />
                    Notifications
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-quicksite-blue text-white text-xs rounded-full flex items-center justify-center">
                      2
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {userType === 'customer' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass-card p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gradient">Current Project</h2>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <StatusBadge status={activeOrder.stages.some(s => s.status === 'in-progress') ? 'in-progress' : 'completed'} />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2 text-xs glass-button"
                        onClick={() => navigate('/orders/' + activeOrder.id)}
                      >
                        <FileText size={14} className="mr-1" />
                        Detailed View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <OrderSummary order={activeOrder} />
                    </div>
                    <div className="lg:col-span-2">
                      <ProjectProgressAnimation stages={activeOrder.stages} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="mb-8">
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gradient">Recent Orders</h2>
                    <button
                      onClick={() => navigate('/orders')}
                      className="text-quicksite-blue hover:text-quicksite-dark-blue flex items-center"
                    >
                      View All Orders <ExternalLink size={16} className="ml-1" />
                    </button>
                  </div>
                  {/* Admin orders table */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-100">
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
                              className="hover:bg-white/20 transition-colors duration-150"
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="glass-card p-6 mt-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold text-gradient">quicksite</span>
              <p className="text-sm text-gray-600 mt-1">powered by Clear Business</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-quicksite-blue transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-quicksite-blue transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-quicksite-blue transition-colors duration-200">Contact Us</a>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </div>
  );
};

export default Index;
