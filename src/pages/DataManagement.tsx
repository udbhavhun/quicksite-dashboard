
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';
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
import { 
  faqs as initialFaqs, 
  documentation as initialDocs, 
  videoTutorials as initialVideos
} from '@/lib/support-data';
import EditableItem from '@/components/EditableItem';
import { 
  FAQItem, 
  DocumentationItem, 
  VideoTutorialItem,
  updateLocalItem,
  addLocalItem,
  deleteLocalItem 
} from '@/models/support-data';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from "react-hook-form";

const DataManagement = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const { userType } = useUserStore();
  const navigate = useNavigate();
  
  // State for editable content
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [docs, setDocs] = useState<DocumentationItem[]>([]);
  const [videos, setVideos] = useState<VideoTutorialItem[]>([]);
  
  // Dialog states
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  
  // Orders state management 
  const [orders, setOrders] = useState(ORDERS);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editedOrder, setEditedOrder] = useState<any>(null);
  
  // Load data on component mount
  useEffect(() => {
    // Load from localStorage if available, otherwise use initial data
    const storedFaqs = localStorage.getItem('admin-faqs');
    const storedDocs = localStorage.getItem('admin-docs');
    const storedVideos = localStorage.getItem('admin-videos');
    
    setFaqs(storedFaqs ? JSON.parse(storedFaqs) : initialFaqs);
    setDocs(storedDocs ? JSON.parse(storedDocs) : initialDocs);
    setVideos(storedVideos ? JSON.parse(storedVideos) : initialVideos);
  }, []);

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

  // Update FAQ
  const handleUpdateFaq = (updatedFaq: FAQItem) => {
    const updatedFaqs = updateLocalItem(faqs, updatedFaq, 'admin-faqs');
    setFaqs(updatedFaqs);
  };

  // Add new FAQ
  const handleAddFaq = (newFaq: Omit<FAQItem, 'id'>) => {
    const faqWithId = { ...newFaq, id: `faq-${uuidv4().slice(0, 8)}` };
    const updatedFaqs = addLocalItem(faqs, faqWithId as FAQItem, 'admin-faqs');
    setFaqs(updatedFaqs);
    setIsAddFaqOpen(false);
  };

  // Delete FAQ
  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = deleteLocalItem(faqs, id, 'admin-faqs');
    setFaqs(updatedFaqs);
    setItemToDelete(null);
    toast({
      title: "FAQ Deleted",
      description: "The FAQ has been successfully deleted."
    });
  };

  // Update Documentation
  const handleUpdateDoc = (updatedDoc: DocumentationItem) => {
    const updatedDocs = updateLocalItem(docs, updatedDoc, 'admin-docs');
    setDocs(updatedDocs);
  };

  // Add new Documentation
  const handleAddDoc = (newDoc: Omit<DocumentationItem, 'id'>) => {
    const docWithId = { ...newDoc, id: `doc-${uuidv4().slice(0, 8)}` };
    const updatedDocs = addLocalItem(docs, docWithId as DocumentationItem, 'admin-docs');
    setDocs(updatedDocs);
    setIsAddDocOpen(false);
  };

  // Delete Documentation
  const handleDeleteDoc = (id: string) => {
    const updatedDocs = deleteLocalItem(docs, id, 'admin-docs');
    setDocs(updatedDocs);
    setItemToDelete(null);
    toast({
      title: "Documentation Deleted",
      description: "The documentation has been successfully deleted."
    });
  };

  // Update Video Tutorial
  const handleUpdateVideo = (updatedVideo: VideoTutorialItem) => {
    const updatedVideos = updateLocalItem(videos, updatedVideo, 'admin-videos');
    setVideos(updatedVideos);
  };

  // Add new Video Tutorial
  const handleAddVideo = (newVideo: Omit<VideoTutorialItem, 'id'>) => {
    const videoWithId = { ...newVideo, id: `video-${uuidv4().slice(0, 8)}` };
    const updatedVideos = addLocalItem(videos, videoWithId as VideoTutorialItem, 'admin-videos');
    setVideos(updatedVideos);
    setIsAddVideoOpen(false);
  };

  // Delete Video Tutorial
  const handleDeleteVideo = (id: string) => {
    const updatedVideos = deleteLocalItem(videos, id, 'admin-videos');
    setVideos(updatedVideos);
    setItemToDelete(null);
    toast({
      title: "Video Tutorial Deleted",
      description: "The video tutorial has been successfully deleted."
    });
  };

  // Edit order
  const handleEditOrder = (orderId: string) => {
    const orderToEdit = orders.find(order => order.id === orderId);
    if (orderToEdit) {
      setEditedOrder({ ...orderToEdit });
      setEditingOrderId(orderId);
    }
  };

  // Save order changes
  const handleSaveOrderChanges = () => {
    if (editedOrder) {
      const updatedOrders = orders.map(order => 
        order.id === editedOrder.id ? editedOrder : order
      );
      setOrders(updatedOrders);
      setEditingOrderId(null);
      setEditedOrder(null);
      toast({
        title: "Order Updated",
        description: "The order has been successfully updated."
      });
    }
  };

  // Cancel order edit
  const handleCancelOrderEdit = () => {
    setEditingOrderId(null);
    setEditedOrder(null);
  };

  // Save all changes
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
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Package</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{order.package.name}</TableCell>
                                <TableCell>
                                  {editingOrderId === order.id ? (
                                    <select
                                      className="p-1 border rounded"
                                      value={editedOrder?.status.id || ''}
                                      onChange={(e) => setEditedOrder({
                                        ...editedOrder,
                                        status: {
                                          id: e.target.value,
                                          label: PROJECT_STATUSES.find(s => s.id === e.target.value)?.label || ''
                                        }
                                      })}
                                    >
                                      {PROJECT_STATUSES.map(status => (
                                        <option key={status.id} value={status.id}>{status.label}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      order.status.id === 'completed' ? 'bg-green-100 text-green-800' :
                                      order.status.id === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                      order.status.id === 'pending-input' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {order.status.label}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingOrderId === order.id ? (
                                    <Input
                                      type="number"
                                      value={editedOrder?.totalAmount || 0}
                                      onChange={(e) => setEditedOrder({
                                        ...editedOrder,
                                        totalAmount: parseFloat(e.target.value)
                                      })}
                                      className="w-20 p-1"
                                    />
                                  ) : (
                                    `$${order.totalAmount}`
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingOrderId === order.id ? (
                                    <Input
                                      type="date"
                                      value={new Date(editedOrder?.orderDate || new Date()).toISOString().split('T')[0]}
                                      onChange={(e) => setEditedOrder({
                                        ...editedOrder,
                                        orderDate: new Date(e.target.value).toISOString()
                                      })}
                                      className="w-32 p-1"
                                    />
                                  ) : (
                                    new Date(order.orderDate).toLocaleDateString()
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingOrderId === order.id ? (
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="default" onClick={handleSaveOrderChanges}>
                                        Save
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={handleCancelOrderEdit}>
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline" onClick={() => handleEditOrder(order.id)}>
                                        <Edit size={14} className="mr-1" />
                                        Edit
                                      </Button>
                                      <Button size="sm" variant="destructive">
                                        <Trash size={14} className="mr-1" />
                                        Delete
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Thread ID</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead>Participants</TableHead>
                              <TableHead>Last Updated</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {MOCK_MESSAGE_THREADS.map((thread) => (
                              <TableRow key={thread.id}>
                                <TableCell>{thread.id}</TableCell>
                                <TableCell>{thread.subject}</TableCell>
                                <TableCell>
                                  {thread.participants.map(p => p.name).join(', ')}
                                </TableCell>
                                <TableCell>
                                  {new Date(thread.lastMessage.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    thread.isUnread ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {thread.isUnread ? 'Unread' : 'Read'}
                                  </span>
                                </TableCell>
                                <TableCell>
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
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Request ID</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Submitted By</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>FR-2023-001</TableCell>
                              <TableCell>Add Dark Mode to Dashboard</TableCell>
                              <TableCell>UI Enhancement</TableCell>
                              <TableCell>
                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                  Under Review
                                </span>
                              </TableCell>
                              <TableCell>John Doe</TableCell>
                              <TableCell>11/15/2023</TableCell>
                              <TableCell>
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
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>FR-2023-002</TableCell>
                              <TableCell>Integrate with Shopify</TableCell>
                              <TableCell>Integration</TableCell>
                              <TableCell>
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Approved
                                </span>
                              </TableCell>
                              <TableCell>Sarah Wilson</TableCell>
                              <TableCell>11/20/2023</TableCell>
                              <TableCell>
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
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
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
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Site ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>URL</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Uptime</TableHead>
                              <TableHead>Response Time</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockSites.map((site) => (
                              <TableRow key={site.id}>
                                <TableCell>{site.id}</TableCell>
                                <TableCell>{site.name}</TableCell>
                                <TableCell>{site.url}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    site.status === 'online' ? 'bg-green-100 text-green-800' :
                                    site.status === 'issues' ? 'bg-yellow-100 text-yellow-800' :
                                    site.status === 'offline' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {site.status}
                                  </span>
                                </TableCell>
                                <TableCell>{site.uptime}%</TableCell>
                                <TableCell>{site.responseTime}ms</TableCell>
                                <TableCell>
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
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                      <Button size="sm" variant="outline" onClick={() => setIsAddFaqOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Add FAQ
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsAddDocOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Add Document
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsAddVideoOpen(true)}>
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
                        <div className="space-y-6">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Question</TableHead>
                                  <TableHead>Answer</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {faqs.map((faq) => (
                                  <TableRow key={faq.id} className="group">
                                    <TableCell>{faq.id}</TableCell>
                                    <TableCell className="max-w-xs">
                                      <div className="truncate">{faq.question}</div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                      <div className="max-h-16 overflow-hidden">{faq.answer}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <EditableItem
                                          item={faq}
                                          fields={[
                                            { name: 'question', label: 'Question', type: 'text' },
                                            { name: 'answer', label: 'Answer', type: 'textarea' },
                                            { name: 'category', label: 'Category', type: 'text' }
                                          ]}
                                          onSave={handleUpdateFaq}
                                          entityType="faq"
                                        />
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => setItemToDelete({ id: faq.id, type: 'faq' })}
                                        >
                                          <Trash size={14} className="mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="docs">
                        <div className="space-y-6">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Link</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {docs.map((doc) => (
                                  <TableRow key={doc.id}>
                                    <TableCell>{doc.id}</TableCell>
                                    <TableCell>{doc.title}</TableCell>
                                    <TableCell className="max-w-xs">
                                      <div className="truncate">{doc.description}</div>
                                    </TableCell>
                                    <TableCell>
                                      <a 
                                        href={doc.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="underline text-blue-600 hover:text-blue-800"
                                      >
                                        View
                                      </a>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <EditableItem
                                          item={doc}
                                          fields={[
                                            { name: 'title', label: 'Title', type: 'text' },
                                            { name: 'description', label: 'Description', type: 'textarea' },
                                            { name: 'link', label: 'Link', type: 'url' },
                                            { name: 'category', label: 'Category', type: 'text' }
                                          ]}
                                          onSave={handleUpdateDoc}
                                          entityType="documentation"
                                        />
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => setItemToDelete({ id: doc.id, type: 'doc' })}
                                        >
                                          <Trash size={14} className="mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="videos">
                        <div className="space-y-6">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Link</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {videos.map((video) => (
                                  <TableRow key={video.id}>
                                    <TableCell>{video.id}</TableCell>
                                    <TableCell>{video.title}</TableCell>
                                    <TableCell>{video.duration}</TableCell>
                                    <TableCell>
                                      <a 
                                        href={video.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="underline text-blue-600 hover:text-blue-800"
                                      >
                                        Watch
                                      </a>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <EditableItem
                                          item={video}
                                          fields={[
                                            { name: 'title', label: 'Title', type: 'text' },
                                            { name: 'duration', label: 'Duration', type: 'text' },
                                            { name: 'link', label: 'Link', type: 'url' },
                                            { name: 'thumbnail', label: 'Thumbnail URL', type: 'url' }
                                          ]}
                                          onSave={handleUpdateVideo}
                                          entityType="video"
                                        />
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => setItemToDelete({ id: video.id, type: 'video' })}
                                        >
                                          <Trash size={14} className="mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
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

      {/* Add FAQ Dialog */}
      <Dialog open={isAddFaqOpen} onOpenChange={setIsAddFaqOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input id="faq-question" placeholder="Enter the question" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea id="faq-answer" placeholder="Enter the answer" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (Optional)</label>
              <Input id="faq-category" placeholder="E.g., General, Account, Billing" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFaqOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const question = (document.getElementById('faq-question') as HTMLInputElement).value;
              const answer = (document.getElementById('faq-answer') as HTMLTextAreaElement).value;
              const category = (document.getElementById('faq-category') as HTMLInputElement).value;
              
              if (!question || !answer) {
                toast({
                  title: "Missing Information",
                  description: "Please provide both a question and an answer.",
                  variant: "destructive"
                });
                return;
              }
              
              handleAddFaq({ question, answer, category });
            }}>Add FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Documentation Dialog */}
      <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Documentation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input id="doc-title" placeholder="Enter the title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea id="doc-description" placeholder="Enter the description" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <Input id="doc-link" placeholder="Enter the document URL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (Optional)</label>
              <Input id="doc-category" placeholder="E.g., Tutorial, Reference, Guide" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDocOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const title = (document.getElementById('doc-title') as HTMLInputElement).value;
              const description = (document.getElementById('doc-description') as HTMLTextAreaElement).value;
              const link = (document.getElementById('doc-link') as HTMLInputElement).value;
              const category = (document.getElementById('doc-category') as HTMLInputElement).value;
              
              if (!title || !description || !link) {
                toast({
                  title: "Missing Information",
                  description: "Please provide a title, description, and link.",
                  variant: "destructive"
                });
                return;
              }
              
              handleAddDoc({ title, description, link, category });
            }}>Add Documentation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Video Tutorial Dialog */}
      <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Video Tutorial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input id="video-title" placeholder="Enter the title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input id="video-duration" placeholder="E.g., 5:30, 12 mins" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <Input id="video-link" placeholder="Enter the video URL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail URL (Optional)</label>
              <Input id="video-thumbnail" placeholder="Enter the thumbnail image URL" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVideoOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const title = (document.getElementById('video-title') as HTMLInputElement).value;
              const duration = (document.getElementById('video-duration') as HTMLInputElement).value;
              const link = (document.getElementById('video-link') as HTMLInputElement).value;
              const thumbnail = (document.getElementById('video-thumbnail') as HTMLInputElement).value;
              
              if (!title || !duration || !link) {
                toast({
                  title: "Missing Information",
                  description: "Please provide a title, duration, and link.",
                  variant: "destructive"
                });
                return;
              }
              
              handleAddVideo({ title, duration, link, thumbnail });
            }}>Add Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (!itemToDelete) return;
              
              if (itemToDelete.type === 'faq') {
                handleDeleteFaq(itemToDelete.id);
              } else if (itemToDelete.type === 'doc') {
                handleDeleteDoc(itemToDelete.id);
              } else if (itemToDelete.type === 'video') {
                handleDeleteVideo(itemToDelete.id);
              }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataManagement;
