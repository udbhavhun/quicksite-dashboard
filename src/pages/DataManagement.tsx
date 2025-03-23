
import React, { useState, useEffect } from 'react';
import { ORDERS, Order, PROJECT_STATUSES } from '@/lib/data';
import { messages } from '@/lib/message-data';
import { performanceData, bugReports, featureRequests } from '@/lib/site-data';
import { faqs, documentation, videoTutorials } from '@/lib/support-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import OrderManagement from '@/components/data-management/OrderManagement';
import SupportContentManagement from '@/components/data-management/support/SupportContentManagement';
import CustomerDataManagement from '@/components/data-management/CustomerDataManagement';
import MessageManagement from '@/components/data-management/MessageManagement';
import FeatureRequestManagement from '@/components/data-management/FeatureRequestManagement';
import SitePerformanceManagement from '@/components/data-management/SitePerformanceManagement';
import { useCustomerData } from '@/hooks/use-customer-data';

// Define types for the transformed Orders we'll be using in this component
interface TransformedOrder {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  package: {
    name: string;
    price: number;
  };
}

// Transform ORDERS to match our Order interface
const transformOrders = (): TransformedOrder[] => {
  return ORDERS.map(order => ({
    id: order.id,
    customer: {
      id: order.customer.id || 'unknown',
      name: order.customer.name,
      email: order.customer.email
    },
    status: typeof order.status === 'object' ? order.status.id : order.status,
    package: {
      name: order.package.name,
      price: order.package.price
    }
  }));
};

const DataManagement = () => {
  // State for all the data we'll be managing
  const [activeTab, setActiveTab] = useState('customer-data');
  const [orders, setOrders] = useState<TransformedOrder[]>(transformOrders());
  const [messagesList, setMessagesList] = useState(messages);
  const [faqsList, setFaqsList] = useState(faqs);
  const [docsList, setDocsList] = useState(documentation);
  const [videosList, setVideosList] = useState(videoTutorials);
  const [contactSupportList, setContactSupportList] = useState([]);
  const [performanceDataList, setPerformanceDataList] = useState(performanceData);
  const [bugReportsList, setBugReportsList] = useState(bugReports);
  const [featureRequestsList, setFeatureRequestsList] = useState(featureRequests);
  
  // State for selected customer and order
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>();
  
  // Hook for customer data
  const { 
    data: customerData,
    isLoading,
    error,
    refetch,
    updateData,
    createData,
    deleteData
  } = useCustomerData({
    orderId: selectedOrderId,
  });
  
  // Handler for selecting a customer and order
  const handleSelectCustomerOrder = (customerId?: string, orderId?: string) => {
    setSelectedCustomerId(customerId);
    setSelectedOrderId(orderId);
  };
  
  // Reset selection when tab changes
  useEffect(() => {
    setSelectedCustomerId(undefined);
    setSelectedOrderId(undefined);
  }, [activeTab]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quicksite-blue"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-center items-center h-full">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error.message}</p>
                <Button 
                  onClick={() => refetch()} 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
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
          <h1 className="text-3xl font-bold">Data Management</h1>
          <p className="text-gray-500">Manage all system data from one place</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="customer-data">Customer Data</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="feature-requests">Feature Requests</TabsTrigger>
            <TabsTrigger value="site-data">Site Data</TabsTrigger>
            <TabsTrigger value="support">Support Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer-data">
            <CustomerDataManagement 
              data={customerData} 
              updateData={updateData}
              createData={createData}
              deleteData={deleteData}
              selectedOrderId={selectedOrderId}
              selectedCustomerId={selectedCustomerId}
            />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderManagement 
              orders={orders}
              onSelectCustomerOrder={handleSelectCustomerOrder}
            />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessageManagement />
          </TabsContent>
          
          <TabsContent value="feature-requests">
            <FeatureRequestManagement />
          </TabsContent>
          
          <TabsContent value="site-data">
            <SitePerformanceManagement />
          </TabsContent>
          
          <TabsContent value="support">
            <SupportContentManagement 
              faqs={faqsList}
              docs={docsList}
              videos={videosList}
              contactSupport={contactSupportList}
              onUpdateFaqs={setFaqsList}
              onUpdateDocs={setDocsList}
              onUpdateVideos={setVideosList}
              onUpdateContactSupport={setContactSupportList}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataManagement;
