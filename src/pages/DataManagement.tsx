
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AppSidebar from '@/components/AppSidebar';
import OrderManagement from '@/components/data-management/OrderManagement';
import MessageManagement from '@/components/data-management/MessageManagement';
import FeatureRequestManagement from '@/components/data-management/FeatureRequestManagement';
import SitePerformanceManagement from '@/components/data-management/SitePerformanceManagement';
import SupportContentManagement from '@/components/data-management/support/SupportContentManagement';
import CustomerDataManagement from '@/components/data-management/CustomerDataManagement';
import { ORDERS } from '@/lib/data';
import { faqs, documentation, videoTutorials } from '@/lib/support-data';

// Mock data imports (these should be adjusted if you have real data sources)
const MESSAGES = [
  { id: '1', from: 'customer@example.com', subject: 'Question about my website', content: 'When will my website be ready?', read: false, date: '2023-09-15' },
  { id: '2', from: 'support@agency.com', subject: 'Your website progress', content: 'Here is an update on your website project...', read: true, date: '2023-09-14' }
];

const PERFORMANCE_DATA = [
  { id: '1', date: '2023-09-01', pageViews: 1250, avgLoadTime: 1.3, bounceRate: 35 },
  { id: '2', date: '2023-09-02', pageViews: 1300, avgLoadTime: 1.2, bounceRate: 33 }
];

const BUG_REPORTS = [
  { id: '1', title: 'Navigation breaks on mobile', description: 'The navigation menu does not work properly on iOS devices', status: 'open', reportedBy: 'customer@example.com', date: '2023-09-10' },
  { id: '2', title: 'Contact form error', description: 'The contact form submission gives a 404 error', status: 'in-progress', reportedBy: 'support@agency.com', date: '2023-09-09' }
];

const FEATURE_REQUESTS = [
  { id: '1', title: 'Add dark mode', description: 'Would like a dark mode option for the website', status: 'under-review', requestedBy: 'customer@example.com', date: '2023-09-05', votes: 12 },
  { id: '2', title: 'Improved search', description: 'Search functionality needs filters and better results', status: 'planned', requestedBy: 'sales@example.com', date: '2023-09-03', votes: 8 }
];

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

  // State for delete confirmation
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);

  // Functions for managing support content
  const handleUpdateFaq = (updatedFaq: any) => {
    setFaqItems(faqItems.map(faq => faq.id === updatedFaq.id ? updatedFaq : faq));
  };

  const handleUpdateDoc = (updatedDoc: any) => {
    setDocItems(docItems.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
  };

  const handleUpdateVideo = (updatedVideo: any) => {
    setVideoItems(videoItems.map(video => video.id === updatedVideo.id ? updatedVideo : video));
  };

  const handleUpdateContactSupport = (updatedContact: any) => {
    setContactItems(contactItems.map(contact => contact.id === updatedContact.id ? updatedContact : contact));
  };

  const handleDeleteFaq = (id: string) => {
    setFaqItems(faqItems.filter(faq => faq.id !== id));
  };

  const handleDeleteDoc = (id: string) => {
    setDocItems(docItems.filter(doc => doc.id !== id));
  };

  const handleDeleteVideo = (id: string) => {
    setVideoItems(videoItems.filter(video => video.id !== id));
  };

  const handleDeleteContactSupport = (id: string) => {
    setContactItems(contactItems.filter(contact => contact.id !== id));
  };

  // State for add dialogs
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

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
                  onUpdateFaq={handleUpdateFaq}
                  onUpdateDoc={handleUpdateDoc}
                  onUpdateVideo={handleUpdateVideo}
                  onUpdateContactSupport={handleUpdateContactSupport}
                  onDeleteFaq={handleDeleteFaq}
                  onDeleteDoc={handleDeleteDoc}
                  onDeleteVideo={handleDeleteVideo}
                  onDeleteContactSupport={handleDeleteContactSupport}
                  setIsAddFaqOpen={setIsAddFaqOpen}
                  setIsAddDocOpen={setIsAddDocOpen}
                  setIsAddVideoOpen={setIsAddVideoOpen}
                  setIsAddContactOpen={setIsAddContactOpen}
                  setItemToDelete={setItemToDelete}
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
