
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  FAQItem, 
  DocumentationItem, 
  VideoTutorialItem,
  ContactSupportItem
} from '@/models/support-data';

import FaqManagement from './FaqManagement';
import DocumentationManagement from './DocumentationManagement';
import VideoManagement from './VideoManagement';
import ContactSupportManagement from './ContactSupportManagement';

interface SupportContentManagementProps {
  faqs?: FAQItem[];
  docs?: DocumentationItem[];
  videos?: VideoTutorialItem[];
  contactSupport?: ContactSupportItem[];
  onUpdateFaq?: (updatedFaq: FAQItem) => void;
  onUpdateDoc?: (updatedDoc: DocumentationItem) => void;
  onUpdateVideo?: (updatedVideo: VideoTutorialItem) => void;
  onUpdateContactSupport?: (updatedContact: ContactSupportItem) => void;
  onDeleteFaq?: (id: string) => void;
  onDeleteDoc?: (id: string) => void;
  onDeleteVideo?: (id: string) => void;
  onDeleteContactSupport?: (id: string) => void;
  setIsAddFaqOpen?: (open: boolean) => void;
  setIsAddDocOpen?: (open: boolean) => void;
  setIsAddVideoOpen?: (open: boolean) => void;
  setIsAddContactOpen?: (open: boolean) => void;
  setItemToDelete?: (item: {id: string, type: string} | null) => void;
}

const SupportContentManagement: React.FC<SupportContentManagementProps> = ({ 
  faqs = [],
  docs = [],
  videos = [],
  contactSupport = [],
  onUpdateFaq = () => {},
  onUpdateDoc = () => {},
  onUpdateVideo = () => {},
  onUpdateContactSupport = () => {},
  onDeleteFaq = () => {},
  onDeleteDoc = () => {},
  onDeleteVideo = () => {},
  onDeleteContactSupport = () => {},
  setIsAddFaqOpen = () => {},
  setIsAddDocOpen = () => {},
  setIsAddVideoOpen = () => {},
  setIsAddContactOpen = () => {},
  setItemToDelete = () => {}
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('faqs');

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes to support content have been saved."
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Support Content Management</CardTitle>
        <div className="flex flex-wrap gap-2">
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
          <Button size="sm" variant="outline" onClick={() => setIsAddContactOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
              onUpdate={onUpdateFaq} 
              onDelete={onDeleteFaq}
              setItemToDelete={setItemToDelete}
            />
          </TabsContent>
          
          <TabsContent value="docs">
            <DocumentationManagement 
              docs={docs} 
              onUpdate={onUpdateDoc} 
              onDelete={onDeleteDoc}
              setItemToDelete={setItemToDelete}
            />
          </TabsContent>
          
          <TabsContent value="videos">
            <VideoManagement 
              videos={videos} 
              onUpdate={onUpdateVideo} 
              onDelete={onDeleteVideo}
              setItemToDelete={setItemToDelete}
            />
          </TabsContent>
          
          <TabsContent value="contact">
            <ContactSupportManagement 
              contacts={contactSupport} 
              onUpdate={onUpdateContactSupport} 
              onDelete={onDeleteContactSupport}
              setItemToDelete={setItemToDelete}
            />
          </TabsContent>
        </Tabs>
        
        <div className="text-right mt-4">
          <Button onClick={handleSaveChanges}>
            <Save size={16} className="mr-2" />
            Save All Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportContentManagement;
