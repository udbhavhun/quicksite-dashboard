
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import ProgressTracker from '@/components/ProgressTracker';
import OrderSummary from '@/components/OrderSummary';
import ProjectTimeline from '@/components/ProjectTimeline';
import PackageCard from '@/components/PackageCard';
import { ORDERS, PACKAGES } from '@/lib/data';
import { Clock, Package, RefreshCw, Zap } from 'lucide-react';

const Index = () => {
  const [activeOrder, setActiveOrder] = useState(ORDERS[0]);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimateIn(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // For demonstration, we'll switch between the customer and admin views
  const [viewType, setViewType] = useState<'customer' | 'admin'>('customer');
  
  const toggleView = () => {
    setAnimateIn(false);
    
    // Add a small delay before changing the view to allow for animation
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
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between mb-8 ${animateIn ? 'animate-fade-in' : 'opacity-0'}`}>
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
            
            <div className="mt-4 md:mt-0 flex items-center">
              <button 
                onClick={toggleView}
                className="flex items-center justify-center py-2 px-4 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <RefreshCw size={16} className="mr-2" />
                Switch to {viewType === 'customer' ? 'Admin' : 'Customer'} View
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${animateIn ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-xl bg-quicksite-blue/10 flex items-center justify-center mr-4">
                <Package size={20} className="text-quicksite-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <h3 className="text-2xl font-semibold">{viewType === 'customer' ? 1 : 5}</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-xl bg-quicksite-success/10 flex items-center justify-center mr-4">
                <Zap size={20} className="text-quicksite-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Projects</p>
                <h3 className="text-2xl font-semibold">{viewType === 'customer' ? 1 : 48}</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-xl bg-quicksite-warning/10 flex items-center justify-center mr-4">
                <Clock size={20} className="text-quicksite-warning" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Action</p>
                <h3 className="text-2xl font-semibold">{viewType === 'customer' ? 1 : 3}</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mr-4">
                <RefreshCw size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Updates</p>
                <h3 className="text-2xl font-semibold">{viewType === 'customer' ? 5 : 24}</h3>
              </div>
            </div>
          </div>
          
          {viewType === 'customer' ? (
            <>
              {/* Current Project Section */}
              <div className={`mb-12 ${animateIn ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
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
              </div>
              
              {/* Project Timeline */}
              <div className={`mb-12 ${animateIn ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                <h2 className="text-2xl font-semibold mb-6">Project Timeline</h2>
                <ProjectTimeline order={activeOrder} />
              </div>
              
              {/* Available Packages Section */}
              <div className={`${animateIn ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                <h2 className="text-2xl font-semibold mb-6">Explore More Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {PACKAGES.slice(0, 3).map(pkg => (
                    <PackageCard key={pkg.id} package={pkg} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Admin Dashboard */}
              <div className={`mb-12 ${animateIn ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
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
                        {ORDERS.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Package Management */}
              <div className={`${animateIn ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Manage Packages</h2>
                  <button className="py-2 px-4 bg-quicksite-blue text-white rounded-lg hover:bg-quicksite-dark-blue transition-colors duration-200 flex items-center">
                    <span className="mr-2">+</span> Add Package
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {PACKAGES.map(pkg => (
                    <PackageCard key={pkg.id} package={pkg} />
                  ))}
                </div>
              </div>
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
