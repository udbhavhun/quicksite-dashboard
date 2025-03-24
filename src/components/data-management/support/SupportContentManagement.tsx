
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FaqManagement from './FaqManagement';
import DocumentationManagement from './DocumentationManagement';
import VideoManagement from './VideoManagement';
import ContactSupportManagement from './ContactSupportManagement';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DocumentationItem {
  id: string;
  title: string;
  content: string;
  category: string;
  lastUpdated: string;
}

export interface VideoTutorialItem {
  id: string;
  title: string;
  url: string;
  description: string;
  duration: string;
  thumbnail?: string;
}

export interface ContactSupportItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
}

export interface SupportContentManagementProps {
  faqs: FAQItem[];
  docs: DocumentationItem[];
  videos: VideoTutorialItem[];
  contactSupport: ContactSupportItem[];
  onUpdateFaqs: (data: FAQItem[]) => void;
  onUpdateDocs: (data: DocumentationItem[]) => void;
  onUpdateVideos: (data: VideoTutorialItem[]) => void;
  onUpdateContactSupport: (data: ContactSupportItem[]) => void;
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
  
  // Wrapper functions to handle the proper types
  const handleUpdateFaq = (updatedFaq: FAQItem) => {
    const updatedFaqs = faqs.map(faq => faq.id === updatedFaq.id ? updatedFaq : faq);
    onUpdateFaqs(updatedFaqs);
  };
  
  const handleUpdateDoc = (updatedDoc: DocumentationItem) => {
    const updatedDocs = docs.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc);
    onUpdateDocs(updatedDocs);
  };
  
  const handleUpdateVideo = (updatedVideo: VideoTutorialItem) => {
    const updatedVideos = videos.map(video => video.id === updatedVideo.id ? updatedVideo : video);
    onUpdateVideos(updatedVideos);
  };
  
  const handleUpdateContactSupport = (updatedContact: ContactSupportItem) => {
    const updatedContacts = contactSupport.map(contact => contact.id === updatedContact.id ? updatedContact : contact);
    onUpdateContactSupport(updatedContacts);
  };
  
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
            onUpdate={handleUpdateFaq}
          />
        </TabsContent>
        
        <TabsContent value="docs">
          <DocumentationManagement 
            docs={docs}
            onUpdate={handleUpdateDoc}
          />
        </TabsContent>
        
        <TabsContent value="videos">
          <VideoManagement 
            videos={videos}
            onUpdate={handleUpdateVideo}
          />
        </TabsContent>
        
        <TabsContent value="contact">
          <ContactSupportManagement 
            data={contactSupport}
            onUpdate={handleUpdateContactSupport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportContentManagement;
