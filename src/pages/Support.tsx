
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';
import { HelpCircle, Mail, Search, MessageSquare, FileText, ExternalLink, Phone } from 'lucide-react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Support = () => {
  const { userName } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  
  const handleContactChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support request sent",
      description: "We've received your message and will respond shortly.",
    });
    setContactForm({
      subject: '',
      message: '',
    });
  };
  
  const faqs = [
    {
      question: "How long does it take to build my website?",
      answer: "The timeline for website development depends on the complexity of your project. A basic website typically takes 2-3 weeks, while more complex sites with custom features may take 4-8 weeks. You can always check your project timeline in the dashboard for the most up-to-date schedule."
    },
    {
      question: "How do I update my website content after it's live?",
      answer: "Once your website is live, you'll have access to our content management system (CMS) where you can easily update text, images, and other content. We provide training on how to use the CMS, and our support team is always available to assist with any questions."
    },
    {
      question: "What hosting services do you provide?",
      answer: "We offer reliable and secure hosting services optimized for speed and performance. Our hosting includes SSL certificates, daily backups, malware scanning, and 24/7 monitoring to ensure your website remains secure and performs well."
    },
    {
      question: "Can I transfer my existing domain to use with my new website?",
      answer: "Yes, you can transfer your existing domain to use with your new website. We'll guide you through the process of updating your DNS settings or transferring domain management, ensuring a smooth transition with minimal downtime."
    },
    {
      question: "What support options are available after my website launches?",
      answer: "After launch, we offer various support packages including technical maintenance, content updates, and marketing assistance. Our standard package includes 30 days of post-launch support, and you can extend this with monthly or annual support plans."
    },
    {
      question: "How are payments handled for website projects?",
      answer: "We typically require a 50% deposit to begin work, with the remaining balance due upon project completion. For larger projects, we may establish a payment schedule with milestones. We accept major credit cards, bank transfers, and digital payment methods."
    },
  ];
  
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
  
  const documentationSections = [
    {
      title: "Getting Started",
      items: [
        { name: "Platform Overview", link: "#" },
        { name: "Dashboard Navigation", link: "#" },
        { name: "Understanding Your Project Timeline", link: "#" },
      ]
    },
    {
      title: "Website Management",
      items: [
        { name: "Using the Content Editor", link: "#" },
        { name: "Updating Images and Media", link: "#" },
        { name: "Managing Pages and Sections", link: "#" },
      ]
    },
    {
      title: "Technical Guides",
      items: [
        { name: "Domain Configuration", link: "#" },
        { name: "Email Setup", link: "#" },
        { name: "SEO Optimization", link: "#" },
      ]
    },
  ];
  
  return (
    <div className="min-h-screen w-full flex">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header userName={userName} />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-2 sm:hidden" />
                    <h1 className="text-3xl font-bold text-gradient">Support & Help</h1>
                  </div>
                  <p className="text-gray-600">Find answers or contact our support team</p>
                </div>
              </div>
            </motion.div>
            
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
            </div>
            
            <Tabs defaultValue="faq" className="mb-8 glass-card">
              <TabsList className="grid grid-cols-3 w-full p-2">
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <HelpCircle size={16} />
                  <span>FAQs</span>
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Documentation</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>Contact Us</span>
                </TabsTrigger>
              </TabsList>
              <div className="p-6">
                <TabsContent value="faq" className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                  
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left font-medium hover:text-quicksite-blue transition-colors">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <HelpCircle size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No FAQs found matching your search.</p>
                      <p className="text-gray-500 text-sm mt-2">Try different keywords or contact support.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {documentationSections.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm"
                      >
                        <h3 className="font-semibold mb-3 text-quicksite-blue">{section.title}</h3>
                        <ul className="space-y-2">
                          {section.items.map((item, i) => (
                            <li key={i}>
                              <a 
                                href={item.link} 
                                className="text-gray-700 hover:text-quicksite-blue flex items-center micro-bounce"
                              >
                                <FileText size={14} className="mr-2" />
                                <span>{item.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold mb-3">Video Tutorials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {['Dashboard Overview', 'Content Editing', 'SEO Basics'].map((video, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors cursor-pointer">
                          <div className="aspect-video bg-gray-300 rounded flex items-center justify-center mb-2">
                            <MessageSquare size={32} className="text-gray-500" />
                          </div>
                          <p className="font-medium">{video}</p>
                          <p className="text-sm text-gray-600">3:24 min</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                      <div className="bg-quicksite-blue/10 p-3 rounded-full mb-4">
                        <Mail size={24} className="text-quicksite-blue" />
                      </div>
                      <h3 className="font-semibold mb-2">Email Support</h3>
                      <p className="text-gray-600 mb-3">Get a response within 24 hours</p>
                      <a href="mailto:support@quicksite.com" className="text-quicksite-blue hover:underline micro-bounce">
                        support@quicksite.com
                      </a>
                    </div>
                    
                    <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                      <div className="bg-quicksite-blue/10 p-3 rounded-full mb-4">
                        <MessageSquare size={24} className="text-quicksite-blue" />
                      </div>
                      <h3 className="font-semibold mb-2">Live Chat</h3>
                      <p className="text-gray-600 mb-3">Available Mon-Fri, 9am-6pm</p>
                      <Button size="sm" className="micro-bounce">
                        Start Chat <MessageSquare size={14} className="ml-2" />
                      </Button>
                    </div>
                    
                    <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                      <div className="bg-quicksite-blue/10 p-3 rounded-full mb-4">
                        <Phone size={24} className="text-quicksite-blue" />
                      </div>
                      <h3 className="font-semibold mb-2">Phone Support</h3>
                      <p className="text-gray-600 mb-3">Premium customers only</p>
                      <span className="text-quicksite-blue">+1 (800) 123-4567</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold mb-4">Send us a message</h3>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <Input
                          value={contactForm.subject}
                          onChange={(e) => handleContactChange('subject', e.target.value)}
                          placeholder="What can we help you with?"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <Textarea
                          value={contactForm.message}
                          onChange={(e) => handleContactChange('message', e.target.value)}
                          placeholder="Please describe your issue in detail..."
                          className="min-h-[150px]"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" className="micro-bounce">
                          <Mail size={16} className="mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Support;
