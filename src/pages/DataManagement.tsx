
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
import { Order } from '@/lib/data';
import { getOrders } from '@/lib/data';
import { getFaqs, getDocumentation, getVideoTutorials, getContactSupport } from '@/lib/support-data';
import { getMessages } from '@/lib/message-data';
import { getPerformanceData, getBugReports, getFeatureRequests } from '@/lib/site-data';

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
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [messages, setMessages] = useState(getMessages());
  const [performanceData, setPerformanceData] = useState(getPerformanceData());
  const [bugReports, setBugReports] = useState(getBugReports());
  const [featureRequests, setFeatureRequests] = useState(getFeatureRequests());
  const [faqs, setFaqs] = useState(getFaqs());
  const [docs, setDocs] = useState(getDocumentation());
  const [videos, setVideos] = useState(getVideoTutorials());
  const [contactSupport, setContactSupport] = useState(getContactSupport());
  
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
      setFeatureRequests(featureRequests.filter(feature => feature.id !== id));
    }
    
    toast({
      title: "Item Deleted",
      description: `Successfully deleted ${type} with ID: ${id}`,
    });
    
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Header title="Data Management" />
      <div className="container py-6">
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
                <MessageManagement messages={messages} />
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <FeatureRequestManagement featureRequests={featureRequests} />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-6">
                <SitePerformanceManagement 
                  performanceData={performanceData} 
                  bugReports={bugReports} 
                />
              </TabsContent>
              
              <TabsContent value="support" className="mt-6">
                <SupportContentManagement 
                  faqs={faqs}
                  docs={docs}
                  videos={videos}
                  contactSupport={contactSupport}
                  setFaqs={setFaqs}
                  setDocs={setDocs}
                  setVideos={setVideos}
                  setContactSupport={setContactSupport}
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
