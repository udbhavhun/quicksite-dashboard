
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FaqManagement from './FaqManagement';
import DocumentationManagement from './DocumentationManagement';
import VideoManagement from './VideoManagement';
import ContactSupportManagement from './ContactSupportManagement';
import { FAQItem, DocumentationItem, VideoTutorialItem, ContactSupportItem } from '@/models/support-data';

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
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  
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
  
  // Delete handlers
  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id);
    onUpdateFaqs(updatedFaqs);
    setItemToDelete(null);
  };
  
  const handleDeleteDoc = (id: string) => {
    const updatedDocs = docs.filter(doc => doc.id !== id);
    onUpdateDocs(updatedDocs);
    setItemToDelete(null);
  };
  
  const handleDeleteVideo = (id: string) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    onUpdateVideos(updatedVideos);
    setItemToDelete(null);
  };
  
  const handleDeleteContact = (id: string) => {
    const updatedContacts = contactSupport.filter(contact => contact.id !== id);
    onUpdateContactSupport(updatedContacts);
    setItemToDelete(null);
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
            onDelete={handleDeleteFaq}
            setItemToDelete={setItemToDelete}
          />
        </TabsContent>
        
        <TabsContent value="docs">
          <DocumentationManagement 
            docs={docs}
            onUpdate={handleUpdateDoc}
            onDelete={handleDeleteDoc}
            setItemToDelete={setItemToDelete}
          />
        </TabsContent>
        
        <TabsContent value="videos">
          <VideoManagement 
            videos={videos}
            onUpdate={handleUpdateVideo}
            onDelete={handleDeleteVideo}
            setItemToDelete={setItemToDelete}
          />
        </TabsContent>
        
        <TabsContent value="contact">
          <ContactSupportManagement 
            contacts={contactSupport}
            onUpdate={handleUpdateContactSupport}
            onDelete={handleDeleteContact}
            setItemToDelete={setItemToDelete}
          />
        </TabsContent>
      </Tabs>
      
      {/* We can add a confirmation dialog here for delete operations */}
    </div>
  );
};

export default SupportContentManagement;
