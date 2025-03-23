
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import AppSidebar from '@/components/AppSidebar';
import { OrderManagement } from '@/components/data-management/OrderManagement';
import { MessageManagement } from '@/components/data-management/MessageManagement';
import { FeatureRequestManagement } from '@/components/data-management/FeatureRequestManagement';
import { SitePerformanceManagement } from '@/components/data-management/SitePerformanceManagement';
import { SupportContentManagement } from '@/components/data-management/support/SupportContentManagement';
import CustomerDataManagement from '@/components/data-management/CustomerDataManagement';
import { ORDERS } from '@/lib/data';
import { faqs, documentation, videoTutorials } from '@/lib/support-data';
import { MESSAGES } from '@/lib/message-data';
import { PERFORMANCE_DATA, BUG_REPORTS, FEATURE_REQUESTS } from '@/lib/site-data';

// Mock contact support items
const contactSupport = [
  {
    id: 'contact-1',
    title: 'General Support',
    description: 'For general inquiries about your website project',
    email: 'support@quicksite.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'contact-2',
    title: 'Technical Support',
    description: 'For technical issues or questions',
    email: 'tech@quicksite.com',
    phone: '+1 (555) 987-6543'
  }
];

const DataManagement = () => {
  // State for all the data that can be managed
  const [orders, setOrders] = useState(ORDERS);
  const [messages, setMessages] = useState(MESSAGES);
  const [performanceData, setPerformanceData] = useState(PERFORMANCE_DATA);
  const [bugReports, setBugReports] = useState(BUG_REPORTS);
  const [featureRequests, setFeatureRequests] = useState(FEATURE_REQUESTS);
  const [faqItems, setFaqItems] = useState(faqs);
  const [docItems, setDocItems] = useState(documentation);
  const [videoItems, setVideoItems] = useState(videoTutorials);
  const [contactItems, setContactItems] = useState(contactSupport);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);

  // Handle customer/order selection for filtered data management
  const handleSelectCustomerOrder = (customerId?: string, orderId?: string) => {
    setSelectedCustomerId(customerId);
    setSelectedOrderId(orderId);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <Header />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient">Data Management</h1>
          <p className="text-gray-500">
            Manage all data in the QuickSite Management system
          </p>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <Tabs defaultValue="orders">
              <TabsList className="grid grid-cols-7 mb-6">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="features">Feature Requests</TabsTrigger>
                <TabsTrigger value="performance">Site Performance</TabsTrigger>
                <TabsTrigger value="support">Support Content</TabsTrigger>
                <TabsTrigger value="customer-data">Customer Data</TabsTrigger>
                <TabsTrigger value="system-settings">System Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <OrderManagement 
                  orders={orders} 
                  setOrders={setOrders} 
                  onSelectCustomerOrder={handleSelectCustomerOrder}
                />
              </TabsContent>

              <TabsContent value="messages">
                <MessageManagement 
                  messages={messages} 
                  setMessages={setMessages} 
                />
              </TabsContent>

              <TabsContent value="features">
                <FeatureRequestManagement 
                  featureRequests={featureRequests} 
                  setFeatureRequests={setFeatureRequests} 
                />
              </TabsContent>

              <TabsContent value="performance">
                <SitePerformanceManagement 
                  performanceData={performanceData} 
                  bugReports={bugReports} 
                  setPerformanceData={setPerformanceData}
                  setBugReports={setBugReports}
                />
              </TabsContent>

              <TabsContent value="support">
                <SupportContentManagement 
                  faqs={faqItems} 
                  docs={docItems} 
                  videos={videoItems} 
                  contactSupport={contactItems}
                />
              </TabsContent>

              <TabsContent value="customer-data">
                <CustomerDataManagement 
                  selectedCustomerId={selectedCustomerId}
                  selectedOrderId={selectedOrderId}
                />
              </TabsContent>

              <TabsContent value="system-settings">
                <div className="text-center p-8">
                  <h3 className="text-xl font-semibold mb-2">System Settings</h3>
                  <p className="text-gray-500">
                    Global configuration settings for the QuickSite Management system.
                    This feature is coming soon.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManagement;
