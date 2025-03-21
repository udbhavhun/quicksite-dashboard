
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/userStore';
import {
  Settings,
  MessageSquare,
  BarChart,
  FileText,
  ShoppingBag,
  AlertCircle,
  Users,
  ListTodo,
  Search,
  Activity,
  Save,
  Plus,
  Trash,
  Edit,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';
import { MOCK_MESSAGE_THREADS } from '@/lib/message-data';  
import { ORDERS, PROJECT_STATUSES } from '@/lib/data';
import { mockSites } from '@/lib/site-data';
import { faqs, documentation, videoTutorials } from '@/lib/support-data';

const DataManagement = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const { userType } = useUserStore();

  // Only allow admins to access this page
  if (userType !== 'admin') {
    return (
      <div className="min-h-screen w-full flex group/sidebar-wrapper">
        <AppSidebar />
        <SidebarInset className="overflow-auto">
          <Header />
          <main className="flex-grow p-6">
            <div className="max-w-7xl mx-auto text-center py-20">
              <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
              <p className="mt-4">You don't have permission to access this page.</p>
            </div>
          </main>
        </SidebarInset>
      </div>
    );
  }

  const handleSaveChanges = (section: string) => {
    toast({
      title: "Changes Saved",
      description: `Your changes to ${section} data have been saved.`
    });
  };

  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="mr-2 sm:hidden" />
              <h1 className="text-3xl font-bold text-gradient">Data Management</h1>
            </div>
            
            <div className="glass-card p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-6 glass-card p-1 bg-white/50 overflow-x-auto flex whitespace-nowrap">
                <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <ShoppingBag size={16} className="mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <MessageSquare size={16} className="mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="featureRequests" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <ListTodo size={16} className="mr-2" />
                  Feature Requests
                </TabsTrigger>
                <TabsTrigger value="sitePerformance" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <Activity size={16} className="mr-2" />
                  Site Performance
                </TabsTrigger>
                <TabsTrigger value="support" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <FileText size={16} className="mr-2" />
                  Support Content
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Order Management</CardTitle>
                    <Button size="sm">
                      <PlusCircle size={16} className="mr-2" />
                      Add New Order
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border p-2 text-left">Order ID</th>
                              <th className="border p-2 text-left">Customer</th>
                              <th className="border p-2 text-left">Package</th>
                              <th className="border p-2 text-left">Status</th>
                              <th className="border p-2 text-left">Amount</th>
                              <th className="border p-2 text-left">Date</th>
                              <th className="border p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ORDERS.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="border p-2">{order.id}</td>
                                <td className="border p-2">{order.customer.name}</td>
                                <td className="border p-2">{order.package.name}</td>
                                <td className="border p-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    order.status.id === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status.id === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    order.status.id === 'pending-input' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status.label}
                                  </span>
                                </td>
                                <td className="border p-2">${order.totalAmount}</td>
                                <td className="border p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="border p-2">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit size={14} className="mr-1" />
                                      Edit
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      <Trash size={14} className="mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right">
                        <Button onClick={() => handleSaveChanges('orders')}>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="messages">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Message Management</CardTitle>
                    <Button size="sm">
                      <PlusCircle size={16} className="mr-2" />
                      Create New Message Thread
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border p-2 text-left">Thread ID</th>
                              <th className="border p-2 text-left">Subject</th>
                              <th className="border p-2 text-left">Participants</th>
                              <th className="border p-2 text-left">Last Updated</th>
                              <th className="border p-2 text-left">Status</th>
                              <th className="border p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {MOCK_MESSAGE_THREADS.map((thread) => (
                              <tr key={thread.id} className="hover:bg-gray-50">
                                <td className="border p-2">{thread.id}</td>
                                <td className="border p-2">{thread.subject}</td>
                                <td className="border p-2">
                                  {thread.participants.map(p => p.name).join(', ')}
                                </td>
                                <td className="border p-2">
                                  {new Date(thread.lastMessage.timestamp).toLocaleString()}
                                </td>
                                <td className="border p-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    thread.isUnread ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {thread.isUnread ? 'Unread' : 'Read'}
                                  </span>
                                </td>
                                <td className="border p-2">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit size={14} className="mr-1" />
                                      Edit
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      <Trash size={14} className="mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right">
                        <Button onClick={() => handleSaveChanges('messages')}>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="featureRequests">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Feature Request Management</CardTitle>
                    <Button size="sm">
                      <PlusCircle size={16} className="mr-2" />
                      Add New Feature Request
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border p-2 text-left">Request ID</th>
                              <th className="border p-2 text-left">Title</th>
                              <th className="border p-2 text-left">Category</th>
                              <th className="border p-2 text-left">Status</th>
                              <th className="border p-2 text-left">Submitted By</th>
                              <th className="border p-2 text-left">Date</th>
                              <th className="border p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-gray-50">
                              <td className="border p-2">FR-2023-001</td>
                              <td className="border p-2">Add Dark Mode to Dashboard</td>
                              <td className="border p-2">UI Enhancement</td>
                              <td className="border p-2">
                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                  Under Review
                                </span>
                              </td>
                              <td className="border p-2">John Doe</td>
                              <td className="border p-2">11/15/2023</td>
                              <td className="border p-2">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Edit size={14} className="mr-1" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <Trash size={14} className="mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="border p-2">FR-2023-002</td>
                              <td className="border p-2">Integrate with Shopify</td>
                              <td className="border p-2">Integration</td>
                              <td className="border p-2">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Approved
                                </span>
                              </td>
                              <td className="border p-2">Sarah Wilson</td>
                              <td className="border p-2">11/20/2023</td>
                              <td className="border p-2">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Edit size={14} className="mr-1" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <Trash size={14} className="mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right">
                        <Button onClick={() => handleSaveChanges('feature requests')}>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sitePerformance">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Site Performance Management</CardTitle>
                    <Button size="sm">
                      <PlusCircle size={16} className="mr-2" />
                      Add New Site
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border p-2 text-left">Site ID</th>
                              <th className="border p-2 text-left">Name</th>
                              <th className="border p-2 text-left">URL</th>
                              <th className="border p-2 text-left">Status</th>
                              <th className="border p-2 text-left">Uptime</th>
                              <th className="border p-2 text-left">Response Time</th>
                              <th className="border p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockSites.map((site) => (
                              <tr key={site.id} className="hover:bg-gray-50">
                                <td className="border p-2">{site.id}</td>
                                <td className="border p-2">{site.name}</td>
                                <td className="border p-2">{site.url}</td>
                                <td className="border p-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    site.status === 'online' ? 'bg-green-100 text-green-800' :
                                    site.status === 'issues' ? 'bg-yellow-100 text-yellow-800' :
                                    site.status === 'offline' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {site.status}
                                  </span>
                                </td>
                                <td className="border p-2">{site.uptime}%</td>
                                <td className="border p-2">{site.responseTime}ms</td>
                                <td className="border p-2">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit size={14} className="mr-1" />
                                      Edit
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      <Trash size={14} className="mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right">
                        <Button onClick={() => handleSaveChanges('site performance')}>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="support">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Support Content Management</CardTitle>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Plus size={16} className="mr-2" />
                        Add FAQ
                      </Button>
                      <Button size="sm" variant="outline">
                        <Plus size={16} className="mr-2" />
                        Add Document
                      </Button>
                      <Button size="sm" variant="outline">
                        <Plus size={16} className="mr-2" />
                        Add Video
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="faqs">
                      <TabsList className="mb-4">
                        <TabsTrigger value="faqs">FAQs</TabsTrigger>
                        <TabsTrigger value="docs">Documentation</TabsTrigger>
                        <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="faqs">
                        <div className="space-y-4">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border p-2 text-left">ID</th>
                                  <th className="border p-2 text-left">Question</th>
                                  <th className="border p-2 text-left">Answer</th>
                                  <th className="border p-2 text-left">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {faqs.map((faq) => (
                                  <tr key={faq.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{faq.id}</td>
                                    <td className="border p-2">{faq.question}</td>
                                    <td className="border p-2">
                                      <div className="max-w-md truncate">{faq.answer}</div>
                                    </td>
                                    <td className="border p-2">
                                      <div className="flex space-x-2">
                                        <Button size="sm" variant="outline">
                                          <Edit size={14} className="mr-1" />
                                          Edit
                                        </Button>
                                        <Button size="sm" variant="destructive">
                                          <Trash size={14} className="mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="docs">
                        <div className="space-y-4">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border p-2 text-left">ID</th>
                                  <th className="border p-2 text-left">Title</th>
                                  <th className="border p-2 text-left">Description</th>
                                  <th className="border p-2 text-left">Link</th>
                                  <th className="border p-2 text-left">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {documentation.map((doc) => (
                                  <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{doc.id}</td>
                                    <td className="border p-2">{doc.title}</td>
                                    <td className="border p-2">{doc.description}</td>
                                    <td className="border p-2">{doc.link}</td>
                                    <td className="border p-2">
                                      <div className="flex space-x-2">
                                        <Button size="sm" variant="outline">
                                          <Edit size={14} className="mr-1" />
                                          Edit
                                        </Button>
                                        <Button size="sm" variant="destructive">
                                          <Trash size={14} className="mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="videos">
                        <div className="space-y-4">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border p-2 text-left">ID</th>
                                  <th className="border p-2 text-left">Title</th>
                                  <th className="border p-2 text-left">Duration</th>
                                  <th className="border p-2 text-left">Link</th>
                                  <th className="border p-2 text-left">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {videoTutorials.map((video) => (
                                  <tr key={video.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{video.id}</td>
                                    <td className="border p-2">{video.title}</td>
                                    <td className="border p-2">{video.duration}</td>
                                    <td className="border p-2">{video.link}</td>
                                    <td className="border p-2">
                                      <div className="flex space-x-2">
                                        <Button size="sm" variant="outline">
                                          <Edit size={14} className="mr-1" />
                                          Edit
                                        </Button>
                                        <Button size="sm" variant="destructive">
                                          <Trash size={14} className="mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="text-right mt-4">
                      <Button onClick={() => handleSaveChanges('support content')}>
                        <Save size={16} className="mr-2" />
                        Save All Changes
                      </Button>
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
