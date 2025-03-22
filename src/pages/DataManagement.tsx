
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Activity
} from 'lucide-react';
import { ORDERS } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Import Refactored Components
import DataSearchBar from '@/components/data-management/DataSearchBar';
import OrderManagement from '@/components/data-management/OrderManagement';
import MessageManagement from '@/components/data-management/MessageManagement';
import FeatureRequestManagement from '@/components/data-management/FeatureRequestManagement';
import SitePerformanceManagement from '@/components/data-management/SitePerformanceManagement';
import SupportContentManagement from '@/components/data-management/support/SupportContentManagement';
import Dialogs from '@/components/data-management/Dialogs';

// Import Support Data Types and Helpers
import { 
  FAQItem, 
  DocumentationItem, 
  VideoTutorialItem,
  ContactSupportItem,
  updateLocalItem,
  addLocalItem,
  deleteLocalItem,
  getContactSupport,
  updateContactSupport,
  addContactSupport,
  deleteContactSupport 
} from '@/models/support-data';

// Import initial data
import { 
  faqs as initialFaqs, 
  documentation as initialDocs, 
  videoTutorials as initialVideos
} from '@/lib/support-data';

const DataManagement = () => {
  const [currentTab, setCurrentTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const { userType } = useUserStore();
  const navigate = useNavigate();
  
  // State for editable content
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [docs, setDocs] = useState<DocumentationItem[]>([]);
  const [videos, setVideos] = useState<VideoTutorialItem[]>([]);
  const [contactSupport, setContactSupport] = useState<ContactSupportItem[]>([]);
  
  // Dialog states
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  
  // Orders state management 
  const [orders, setOrders] = useState(ORDERS);
  
  // Load data on component mount
  useEffect(() => {
    // Load from localStorage if available, otherwise use initial data
    const storedFaqs = localStorage.getItem('admin-faqs');
    const storedDocs = localStorage.getItem('admin-docs');
    const storedVideos = localStorage.getItem('admin-videos');
    
    setFaqs(storedFaqs ? JSON.parse(storedFaqs) : initialFaqs);
    setDocs(storedDocs ? JSON.parse(storedDocs) : initialDocs);
    setVideos(storedVideos ? JSON.parse(storedVideos) : initialVideos);
    
    // Load contact support data
    getContactSupport().then(data => {
      setContactSupport(data);
    });
    
    // Record page view for analytics
    const recordPageView = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        console.log('Data Management page viewed by user:', userData.user.id);
      }
    };
    
    recordPageView();
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
  };
  
  // Update Contact Support
  const handleUpdateContactSupport = (updatedContact: ContactSupportItem) => {
    const updatedContacts = updateContactSupport(contactSupport, updatedContact);
    setContactSupport(updatedContacts);
  };
  
  // Add new Contact Support
  const handleAddContactSupport = (newContact: Omit<ContactSupportItem, 'id'>) => {
    const contactWithId = { ...newContact, id: `contact-${uuidv4().slice(0, 8)}` };
    const updatedContacts = addContactSupport(contactSupport, contactWithId as ContactSupportItem);
    setContactSupport(updatedContacts);
    setIsAddContactOpen(false);
  };
  
  // Delete Contact Support
  const handleDeleteContactSupport = (id: string) => {
    const updatedContacts = deleteContactSupport(contactSupport, id);
    setContactSupport(updatedContacts);
    setItemToDelete(null);
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
            
            <DataSearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            
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
                <OrderManagement orders={orders} setOrders={setOrders} />
              </TabsContent>
              
              <TabsContent value="messages">
                <MessageManagement />
              </TabsContent>
              
              <TabsContent value="featureRequests">
                <FeatureRequestManagement />
              </TabsContent>
              
              <TabsContent value="sitePerformance">
                <SitePerformanceManagement />
              </TabsContent>
              
              <TabsContent value="support">
                <SupportContentManagement 
                  faqs={faqs}
                  docs={docs}
                  videos={videos}
                  contactSupport={contactSupport}
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
            </Tabs>
          </div>
        </main>
      </SidebarInset>

      {/* Add all dialogs here */}
      <Dialogs
        isAddFaqOpen={isAddFaqOpen}
        setIsAddFaqOpen={setIsAddFaqOpen}
        isAddDocOpen={isAddDocOpen}
        setIsAddDocOpen={setIsAddDocOpen}
        isAddVideoOpen={isAddVideoOpen}
        setIsAddVideoOpen={setIsAddVideoOpen}
        isAddContactOpen={isAddContactOpen}
        setIsAddContactOpen={setIsAddContactOpen}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        handleAddFaq={handleAddFaq}
        handleAddDoc={handleAddDoc}
        handleAddVideo={handleAddVideo}
        handleAddContactSupport={handleAddContactSupport}
        handleDeleteFaq={handleDeleteFaq}
        handleDeleteDoc={handleDeleteDoc}
        handleDeleteVideo={handleDeleteVideo}
        handleDeleteContactSupport={handleDeleteContactSupport}
      />
    </div>
  );
};

export default DataManagement;
