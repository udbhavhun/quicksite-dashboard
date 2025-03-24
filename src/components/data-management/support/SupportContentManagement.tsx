import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FAQManagement from './FAQManagement';
import DocumentationManagement from './DocumentationManagement';
import VideoManagement from './VideoManagement';
import ContactSupportManagement from './ContactSupportManagement';

// Modify the props interface to match what's being passed from DataManagement.tsx
export interface SupportContentManagementProps {
  faqs: any[];
  onUpdateFaqs: (data: any[]) => void;
  documentation: any[];
  onUpdateDocumentation: (data: any[]) => void;
  videos: any[];
  onUpdateVideos: (data: any[]) => void;
  contactSupport: any[];
  onUpdateContactSupport: (data: any[]) => void;
}

const SupportContentManagement: React.FC<SupportContentManagementProps> = ({
  faqs,
  onUpdateFaqs,
  documentation,
  onUpdateDocumentation,
  videos,
  onUpdateVideos,
  contactSupport,
  onUpdateContactSupport
}) => {
  const [activeTab, setActiveTab] = useState('faqs');

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Support Content Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          <TabsContent value="faqs">
            <FAQManagement faqs={faqs} onUpdateFaqs={onUpdateFaqs} />
          </TabsContent>
          <TabsContent value="documentation">
            <DocumentationManagement documentation={documentation} onUpdateDocumentation={onUpdateDocumentation} />
          </TabsContent>
          <TabsContent value="videos">
            <VideoManagement videos={videos} onUpdateVideos={onUpdateVideos} />
          </TabsContent>
          <TabsContent value="contact">
            <ContactSupportManagement contactSupport={contactSupport} onUpdateContactSupport={onUpdateContactSupport} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SupportContentManagement;
