
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import OrderSummary from '@/components/OrderSummary';
import ProjectTimeline from '@/components/ProjectTimeline';
import DetailedProgressTracker from '@/components/DetailedProgressTracker';
import CustomerRequirements from '@/components/CustomerRequirements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectFeedback from '@/components/ProjectFeedback';
import AddOnManager from '@/components/AddOnManager';
import TechnicalSetupCard from '@/components/TechnicalSetupCard';
import HostingStatusCard from '@/components/HostingStatusCard';
import { ORDERS } from '@/lib/data';
import CustomerDataEditor from '@/components/admin/CustomerDataEditor';
import { useUserStore } from '@/stores/userStore';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState(ORDERS.find(o => o.id === orderId));
  const { profile } = useUserStore();
  const isAdmin = profile?.role === 'admin';
  
  useEffect(() => {
    // Find order by ID
    const foundOrder = ORDERS.find(o => o.id === orderId);
    setOrder(foundOrder);
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [orderId]);
  
  if (!order) {
    return (
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <Header />
          <div className="h-[80vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Order Not Found</h2>
              <p className="text-gray-500 mt-2">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <Header />
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Order Details</h1>
              <p className="text-gray-500">{order.customer.name}'s {order.package.name} Website</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <OrderSummary order={order} />
          
          <div className="lg:col-span-2">
            <DetailedProgressTracker progress={order.progress} />
          </div>
        </div>
        
        <Tabs defaultValue="timeline" className="mb-8">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="technical">Technical Setup</TabsTrigger>
            {isAdmin && <TabsTrigger value="data-management">Data Management</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="timeline" className="pt-4">
            <ProjectTimeline timeline={order.timeline} />
          </TabsContent>
          
          <TabsContent value="requirements" className="pt-4">
            <CustomerRequirements requirements={order.requirements} />
          </TabsContent>
          
          <TabsContent value="feedback" className="pt-4">
            <ProjectFeedback feedback={order.feedback} />
          </TabsContent>
          
          <TabsContent value="addons" className="pt-4">
            <AddOnManager orderId={order.id} initialAddOns={order.addOns} />
          </TabsContent>
          
          <TabsContent value="technical" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TechnicalSetupCard order={order} />
              <HostingStatusCard order={order} />
            </div>
            <Separator className="my-8" />
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Domain Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Current domain configuration for your website:</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="font-medium">Domain Name:</div>
                    <div className="font-mono">{order.domain?.name || "Not configured"}</div>
                    
                    <div className="font-medium">Domain Status:</div>
                    <div>
                      <StatusBadge
                        status={order.domain?.status || "pending"}
                        statusMap={{
                          active: "Active",
                          pending: "Pending",
                          transferring: "Transferring",
                          expired: "Expired"
                        }}
                      />
                    </div>
                    
                    <div className="font-medium">Nameservers:</div>
                    <div className="font-mono">
                      {order.domain?.nameservers?.map((ns, i) => (
                        <div key={i}>{ns}</div>
                      )) || "Not configured"}
                    </div>
                    
                    <div className="font-medium">Expiry:</div>
                    <div>{order.domain?.expiryDate || "N/A"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="data-management" className="pt-4">
              <CustomerDataEditor 
                orderId={order.id} 
                customerId={order.customer.id} 
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

// Helper component for status badges
const StatusBadge = ({ 
  status, 
  statusMap = {
    pending: "Pending",
    inProgress: "In Progress",
    underReview: "Under Review",
    completed: "Completed",
    cancelled: "Cancelled"
  } 
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      inProgress: "bg-blue-100 text-blue-800",
      underReview: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      active: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      transferring: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {statusMap[status as keyof typeof statusMap] || status}
    </span>
  );
};

export default OrderDetails;
