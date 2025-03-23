
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import OrderManagement from '@/components/data-management/OrderManagement';
import MessageManagement from '@/components/data-management/MessageManagement';
import FeatureRequestManagement from '@/components/data-management/FeatureRequestManagement';
import SitePerformanceManagement from '@/components/data-management/SitePerformanceManagement';
import SupportContentManagement from '@/components/data-management/support/SupportContentManagement';
import { useUserStore } from '@/stores/userStore';
import Header from '@/components/Header';
import { Order, ORDERS } from '@/lib/data';
import { faqs, documentation, videoTutorials } from '@/lib/support-data';
import { MOCK_MESSAGE_THREADS } from '@/lib/message-data';
import { mockSites } from '@/lib/site-data';

// Mock data for now - these would eventually come from API calls
const contactSupport = [
  {
    id: 'contact-1',
    title: 'Customer Support',
    description: 'Contact our customer support team for general inquiries',
    email: 'support@example.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'contact-2',
    title: 'Technical Support',
    description: 'Get help with technical issues related to your website',
    email: 'tech@example.com',
    phone: '+1 (555) 987-6543'
  }
];

const bugReports = [
  {
    id: 'bug-1',
    title: 'Navigation menu not working on mobile',
    description: 'Users report the hamburger menu does not expand on iOS devices',
    status: 'open',
    priority: 'high',
    reportedBy: 'customer@example.com',
    reportedDate: '2023-11-25',
    siteId: 'site-1'
  },
  {
    id: 'bug-2',
    title: 'Payment form validation error',
    description: 'Credit card validation displays incorrect error message',
    status: 'in-progress',
    priority: 'critical',
    reportedBy: 'sarah@example.com',
    reportedDate: '2023-11-22',
    siteId: 'site-2'
  }
];

const featureRequests = [
  {
    id: 'feature-1',
    title: 'Dark mode support',
    description: 'Add dark mode theme option for all customer websites',
    status: 'under-review',
    votes: 24,
    requestedBy: 'multiple-users',
    requestedDate: '2023-11-10'
  },
  {
    id: 'feature-2',
    title: 'Social media integration',
    description: 'Add direct posting to social media from the CMS',
    status: 'planned',
    votes: 18,
    requestedBy: 'customer@example.com',
    requestedDate: '2023-11-15'
  }
];

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmProps> = ({ open, onClose, onConfirm, itemType }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {itemType}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DataManagement: React.FC = () => {
  const { profile } = useUserStore();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [messages, setMessages] = useState(MOCK_MESSAGE_THREADS);
  const [performanceData, setPerformanceData] = useState(mockSites);
  const [bugsData, setBugsData] = useState(bugReports);
  const [featureRequestsData, setFeatureRequestsData] = useState(featureRequests);
  const [faqsData, setFaqsData] = useState(faqs);
  const [docsData, setDocsData] = useState(documentation);
  const [videosData, setVideosData] = useState(videoTutorials);
  const [contactSupportData, setContactSupportData] = useState(contactSupport);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: '', type: '' });

  // Redirect if not admin
  React.useEffect(() => {
    if (profile && profile.role !== 'admin') {
      // Redirect to home or error page
      window.location.href = '/';
    }
  }, [profile]);

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p>You need admin privileges to access this page.</p>
              <Button className="mt-4" onClick={() => window.location.href = '/'}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    const { id, type } = itemToDelete;
    
    // Add actual deletion logic here based on type
    if (type === 'order') {
      setOrders(orders.filter(order => order.id !== id));
    } else if (type === 'message') {
      setMessages(messages.filter(message => message.id !== id));
    } else if (type === 'feature') {
      setFeatureRequestsData(featureRequestsData.filter(feature => feature.id !== id));
    }
    
    toast({
      title: "Item Deleted",
      description: `Successfully deleted ${type} with ID: ${id}`,
    });
    
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Data Management</h1>
        <Card className="mb-6 glass-card">
          <CardHeader>
            <CardTitle>Admin Control Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
                <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
                <TabsTrigger value="features" className="flex-1">Feature Requests</TabsTrigger>
                <TabsTrigger value="performance" className="flex-1">Site Performance</TabsTrigger>
                <TabsTrigger value="support" className="flex-1">Support Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="mt-6">
                <OrderManagement orders={orders} />
              </TabsContent>
              
              <TabsContent value="messages" className="mt-6">
                <MessageManagement />
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <FeatureRequestManagement />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-6">
                <SitePerformanceManagement />
              </TabsContent>
              
              <TabsContent value="support" className="mt-6">
                <SupportContentManagement 
                  faqs={faqsData}
                  docs={docsData}
                  videos={videosData}
                  contactSupport={contactSupportData}
                  onUpdateFaq={(updatedFaq) => {
                    setFaqsData(faqsData.map(faq => faq.id === updatedFaq.id ? updatedFaq : faq));
                  }}
                  onUpdateDoc={(updatedDoc) => {
                    setDocsData(docsData.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
                  }}
                  onUpdateVideo={(updatedVideo) => {
                    setVideosData(videosData.map(video => video.id === updatedVideo.id ? updatedVideo : video));
                  }}
                  onUpdateContactSupport={(updatedContact) => {
                    setContactSupportData(contactSupportData.map(contact => 
                      contact.id === updatedContact.id ? updatedContact : contact
                    ));
                  }}
                  onDeleteFaq={(id) => {
                    setFaqsData(faqsData.filter(faq => faq.id !== id));
                  }}
                  onDeleteDoc={(id) => {
                    setDocsData(docsData.filter(doc => doc.id !== id));
                  }}
                  onDeleteVideo={(id) => {
                    setVideosData(videosData.filter(video => video.id !== id));
                  }}
                  onDeleteContactSupport={(id) => {
                    setContactSupportData(contactSupportData.filter(contact => contact.id !== id));
                  }}
                  setIsAddFaqOpen={() => {}}
                  setIsAddDocOpen={() => {}}
                  setIsAddVideoOpen={() => {}}
                  setIsAddContactOpen={() => {}}
                  setItemToDelete={setItemToDelete}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <DeleteConfirmDialog 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType={itemToDelete.type}
      />
    </>
  );
};

export default DataManagement;
