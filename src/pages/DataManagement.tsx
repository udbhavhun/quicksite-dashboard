
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ORDERS, Order, ProjectStatus } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import OrderManagement from '@/components/data-management/OrderManagement';
import SitePerformanceManagement from '@/components/data-management/SitePerformanceManagement';
import FeatureRequestManagement from '@/components/data-management/FeatureRequestManagement';
import MessageManagement from '@/components/data-management/MessageManagement';
import SupportContentManagement from '@/components/data-management/support/SupportContentManagement';

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string; type: string} | null>(null);

  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll just use the mock data
        setOrders(ORDERS);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    
    setTimeout(() => {
      try {
        if (itemToDelete.type === 'order') {
          handleDeleteOrder(itemToDelete.id);
        } else if (itemToDelete.type === 'performance') {
          // Handle performance metric deletion
        } else if (itemToDelete.type === 'message') {
          // Handle message deletion
        } else if (itemToDelete.type === 'feature') {
          // Handle feature request deletion
        }
        
        toast({
          title: 'Deleted successfully',
          description: `${itemToDelete.type} has been deleted.`,
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete item. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
        setItemToDelete(null);
      }
    }, 600);
  };

  const handleUpdateOrder = (orderId: string, status: ProjectStatus, assignedTo?: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status,
              assignee: assignedTo || order.assignee
            }
          : order
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Data Management</h1>
            <p className="text-gray-600">Manage all system data from one place</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="site-performance">Site Performance</TabsTrigger>
                <TabsTrigger value="feature-requests">Feature Requests</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="support-content">Support Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="pt-2">
                <OrderManagement 
                  orders={orders} 
                  onUpdate={handleUpdateOrder} 
                  onDelete={handleDeleteOrder}
                  setItemToDelete={setItemToDelete}
                />
              </TabsContent>
              
              <TabsContent value="site-performance" className="pt-2">
                <SitePerformanceManagement setItemToDelete={setItemToDelete} />
              </TabsContent>
              
              <TabsContent value="feature-requests" className="pt-2">
                <FeatureRequestManagement setItemToDelete={setItemToDelete} />
              </TabsContent>
              
              <TabsContent value="messages" className="pt-2">
                <MessageManagement setItemToDelete={setItemToDelete} />
              </TabsContent>
              
              <TabsContent value="support-content" className="pt-2">
                <SupportContentManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {itemToDelete?.type} 
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataManagement;
