
import React, { useState } from 'react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import OrderManagement from '@/components/data-management/OrderManagement';
import CustomerNotificationsManager from '@/components/data-management/CustomerNotificationsManager';
import SupportContentManagement from '@/components/data-management/support/SupportContentManagement';
import { faqs, documentation, contactSupport } from '@/lib/support-data';
import { useUserStore } from '@/stores/userStore';
import { ORDERS } from '@/lib/data';

const DataManagement = () => {
  const { toast } = useToast();
  const { profile } = useUserStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
  
  // Transform orders for order management component
  const transformedOrders = ORDERS.map(order => ({
    id: order.id,
    customer: {
      id: order.customer.id || '',
      name: order.customer.name,
      email: order.customer.email
    },
    status: order.status.label, // Just use the label string instead of the whole object
    package: {
      name: order.package.name,
      price: order.package.price
    }
  }));
  
  const handleSelectCustomerOrder = (customerId?: string, orderId?: string) => {
    setSelectedCustomerId(customerId);
    setSelectedOrderId(orderId);
    
    if (customerId && orderId) {
      toast({
        title: "Order selected",
        description: `Selected order ${orderId} for customer ${customerId}`,
      });
    }
  };
  
  // State for support content management
  const [faqItems, setFaqItems] = useState(faqs);
  const [documentationItems, setDocumentationItems] = useState(documentation);
  const [videoItems, setVideoItems] = useState([]);  // Empty array instead of videos
  const [contactItems, setContactItems] = useState(contactSupport);
  
  return (
    <div className="min-h-screen flex flex-col w-full group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-grow p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Data Management</h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="notifications">Customer Notifications</TabsTrigger>
                <TabsTrigger value="support">Support Content</TabsTrigger>
                <TabsTrigger value="settings">System Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-6">
                <OrderManagement 
                  orders={transformedOrders}
                  onSelectCustomerOrder={handleSelectCustomerOrder}
                />
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <CustomerNotificationsManager />
              </TabsContent>
              
              <TabsContent value="support" className="space-y-6">
                <SupportContentManagement 
                  faqs={faqItems}
                  onUpdateFaqs={setFaqItems}
                  onUpdateDocumentation={setDocumentationItems}
                  onUpdateVideos={setVideoItems}
                  onUpdateContactSupport={setContactItems}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      Manage global system settings and configurations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Configure email templates and notification settings.
                          </p>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-2">SMS Settings</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Configure SMS provider and message templates.
                          </p>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-2">Payment Gateways</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Configure payment providers and processing settings.
                          </p>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-2">API Integrations</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Manage third-party API connections and webhooks.
                          </p>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-lg font-medium mb-2">System Maintenance</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Perform system maintenance tasks and backups.
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Backup Data</Button>
                          <Button variant="outline" size="sm">Clear Cache</Button>
                          <Button variant="outline" size="sm">System Logs</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default DataManagement;
