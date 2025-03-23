
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
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

// Define types to match component props
interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  package: {
    name: string;
  };
  status: string;
  progress?: any;
  timeline?: any;
  requirements?: any[];
  feedback?: any[];
  addOns?: any[];
  domain?: {
    name?: string;
    status?: string;
    nameservers?: string[];
    expiryDate?: string;
  };
}

// Transform ORDERS data to match our interface
const transformOrder = (originalOrder: any): Order | undefined => {
  if (!originalOrder) return undefined;
  
  return {
    id: originalOrder.id,
    customer: {
      id: originalOrder.customer.id || 'unknown',
      name: originalOrder.customer.name,
      email: originalOrder.customer.email,
      phone: originalOrder.customer.phone
    },
    package: {
      name: originalOrder.package.name
    },
    status: typeof originalOrder.status === 'object' ? originalOrder.status.id : originalOrder.status,
    progress: originalOrder.progress,
    timeline: originalOrder.stages,
    requirements: originalOrder.requirements,
    feedback: originalOrder.feedback,
    addOns: originalOrder.addOns,
    domain: originalOrder.domain
  };
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const originalOrder = ORDERS.find(o => o.id === orderId);
  const [order, setOrder] = useState<Order | undefined>(transformOrder(originalOrder));
  const { profile } = useUserStore();
  const isAdmin = profile?.role === 'admin';
  
  useEffect(() => {
    const foundOrder = ORDERS.find(o => o.id === orderId);
    setOrder(transformOrder(foundOrder));
    
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
          <OrderSummary order={originalOrder} />
          
          <div className="lg:col-span-2">
            {order.progress && <DetailedProgressTracker />}
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
            {order.timeline && <ProjectTimeline />}
          </TabsContent>
          
          <TabsContent value="requirements" className="pt-4">
            {order.requirements && <CustomerRequirements />}
          </TabsContent>
          
          <TabsContent value="feedback" className="pt-4">
            {order.feedback && <ProjectFeedback />}
          </TabsContent>
          
          <TabsContent value="addons" className="pt-4">
            {order.addOns && <AddOnManager orderId={order.id} />}
          </TabsContent>
          
          <TabsContent value="technical" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TechnicalSetupCard 
                domainName={order.domain?.name || "Not configured"}
                isSSLActive={true}
                diskUsage={0}
                bandwidthUsage={0}
                lastBackup="N/A"
                uptime={99.9}
              />
              <HostingStatusCard />
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
                          pending: "Pending",
                          inProgress: "In Progress",
                          underReview: "Under Review",
                          completed: "Completed",
                          cancelled: "Cancelled",
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

const StatusBadge = ({ 
  status, 
  statusMap = {
    pending: "Pending",
    inProgress: "In Progress",
    underReview: "Under Review",
    completed: "Completed",
    cancelled: "Cancelled",
    transferring: "Transferring",
    expired: "Expired"
  } 
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      inProgress: "bg-blue-100 text-blue-800",
      underReview: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
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
