
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FaqManagement from './FaqManagement';
import DocumentationManagement from './DocumentationManagement';
import VideoManagement from './VideoManagement';
import ContactSupportManagement from './ContactSupportManagement';

export interface SupportContentManagementProps {
  faqs: any[];
  docs: any[];
  videos: any[];
  contactSupport: any[];
  onUpdateFaqs: (data: any[]) => void;
  onUpdateDocs: (data: any[]) => void;
  onUpdateVideos: (data: any[]) => void;
  onUpdateContactSupport: (data: any[]) => void;
}

const SupportContentManagement: React.FC<SupportContentManagementProps> = ({ 
  faqs = [],
  docs = [],
  videos = [],
  contactSupport = [],
  onUpdateFaqs = () => {},
  onUpdateDocs = () => {},
  onUpdateVideos = () => {},
  onUpdateContactSupport = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('faqs');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-6">Support Content Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faqs">
          <FaqManagement 
            faqs={faqs} 
            onUpdateFaqs={onUpdateFaqs}
          />
        </TabsContent>
        
        <TabsContent value="docs">
          <DocumentationManagement 
            docs={docs}
            onUpdateDocs={onUpdateDocs}
          />
        </TabsContent>
        
        <TabsContent value="videos">
          <VideoManagement 
            videos={videos}
            onUpdateVideos={onUpdateVideos}
          />
        </TabsContent>
        
        <TabsContent value="contact">
          <ContactSupportManagement 
            contactSupport={contactSupport}
            onUpdateContactSupport={onUpdateContactSupport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportContentManagement;
