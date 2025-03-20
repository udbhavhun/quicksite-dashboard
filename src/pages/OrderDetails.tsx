
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import StatusBadge from '@/components/StatusBadge';
import OrderForm from '@/components/OrderForm';
import GamifiedProgressTracker from '@/components/GamifiedProgressTracker';
import ProjectTimeline from '@/components/ProjectTimeline';
import HostingStatusCard from '@/components/HostingStatusCard';
import CustomerRequirements from '@/components/CustomerRequirements';
import ProjectFeedback from '@/components/ProjectFeedback';
import PackageCard from '@/components/PackageCard';
import { Order, ORDERS, PACKAGES } from '@/lib/data';
import { ArrowLeft, Edit, Clock, Package as PackageIcon, MessageSquare, Server, FileText } from 'lucide-react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch order details
  useEffect(() => {
    if (orderId) {
      // In a real app, this would be an API call
      const foundOrder = ORDERS.find(o => o.id === orderId);
      setOrder(foundOrder || null);
      
      if (!foundOrder) {
        toast({
          title: "Order not found",
          description: `We couldn't find an order with ID ${orderId}`,
          variant: "destructive"
        });
      }
    }
  }, [orderId, toast]);

  const handleSaveOrder = (updatedOrder: Order) => {
    // In a real app, this would be an API call
    setOrder(updatedOrder);
    
    toast({
      title: "Changes saved",
      description: "Order details have been updated successfully.",
    });
    
    setIsEditing(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex w-full group/sidebar-wrapper">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-grow p-6">
            <div className="max-w-7xl mx-auto">
              <button 
                onClick={() => navigate('/')}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </button>
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
                <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="py-2 px-4 bg-quicksite-blue text-white rounded-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <SidebarTrigger className="mr-2 sm:hidden" />
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Dashboard
                </button>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Order
                  </button>
                )}
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">
                  Order {order.id}
                </h1>
                <StatusBadge status={
                  order.stages.every(s => s.status === 'completed') ? 'completed' :
                  order.stages.some(s => s.status === 'in-progress') ? 'in-progress' :
                  'pending'
                } size="lg" />
              </div>
              
              {isEditing ? (
                <OrderForm 
                  order={order} 
                  onSave={handleSaveOrder} 
                  onCancel={() => setIsEditing(false)} 
                />
              ) : (
                <div>
                  <OrderDetailsView order={order} />
                  
                  <div className="mt-8">
                    <Tabs defaultValue="progress" className="mb-8">
                      <TabsList className="mb-6 glass-card p-1 bg-white/50">
                        <TabsTrigger value="progress" className="rounded-lg data-[state=active]:bg-white flex items-center">
                          <Clock size={16} className="mr-2" />
                          Detailed Progress
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="rounded-lg data-[state=active]:bg-white flex items-center">
                          <FileText size={16} className="mr-2" />
                          Project Timeline
                        </TabsTrigger>
                        <TabsTrigger value="hosting" className="rounded-lg data-[state=active]:bg-white flex items-center">
                          <Server size={16} className="mr-2" />
                          Hosting
                        </TabsTrigger>
                        <TabsTrigger value="requirements" className="rounded-lg data-[state=active]:bg-white flex items-center">
                          <PackageIcon size={16} className="mr-2" />
                          Requirements
                        </TabsTrigger>
                        <TabsTrigger value="communication" className="rounded-lg data-[state=active]:bg-white flex items-center">
                          <MessageSquare size={16} className="mr-2" />
                          Communication
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="progress">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <GamifiedProgressTracker stages={order.stages} />
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="timeline">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="glass-card p-6"
                        >
                          <h2 className="text-2xl font-semibold mb-6 text-gradient">Project Timeline</h2>
                          <ProjectTimeline order={order} />
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="hosting">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <HostingStatusCard 
                            domainName="yourdomain.com"
                            isSSLActive={true}
                            diskUsage={23}
                            bandwidthUsage={7}
                            serverLocation="Asia Pacific (Mumbai)"
                            uptime={99.98}
                          />
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="requirements">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="glass-card p-6"
                        >
                          <h2 className="text-2xl font-semibold mb-6 text-gradient">Project Requirements</h2>
                          <CustomerRequirements order={order} userType="customer" />
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="communication">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="glass-card p-6"
                        >
                          <h2 className="text-2xl font-semibold mb-6 text-gradient">Project Communication</h2>
                          <ProjectFeedback order={order} userType="customer" />
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="glass-card p-6 mt-8">
                      <h2 className="text-2xl font-semibold mb-6 text-gradient">Explore More Packages</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {PACKAGES.slice(0, 3).map((pkg, index) => (
                          <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                          >
                            <PackageCard package={pkg} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

// Separate component for the read-only view
const OrderDetailsView = ({ order }: { order: Order }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{order.customer.email}</p>
            </div>
            {order.customer.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-base font-medium mb-3">Package Details</h4>
            <p className="text-lg font-semibold mb-1">{order.package.name}</p>
            <p className="text-gray-600 mb-3">{order.package.description}</p>
            <p className="text-lg font-semibold">₹{order.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-xl font-semibold mb-4">Order Timeline</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-quicksite-success' : 
                  order.paymentStatus === 'pending' ? 'text-quicksite-warning' : 
                  'text-quicksite-error'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-base font-medium mb-4">Progress Status</h4>
              <div className="space-y-4">
                {order.stages.map((stage) => (
                  <div key={stage.id} className="flex items-center">
                    <StatusBadge status={stage.status} size="sm" className="min-w-24" />
                    <div className="flex-grow ml-3">
                      <p className="text-sm font-medium">{stage.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`rounded-full h-2 ${
                            stage.status === 'completed' ? 'bg-quicksite-success' : 
                            stage.status === 'in-progress' ? 'bg-quicksite-blue' : 
                            stage.status === 'pending' ? 'bg-quicksite-warning' : 
                            'bg-gray-300'
                          }`}
                          style={{ width: `${stage.percentComplete}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-3 text-sm">{stage.percentComplete}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
