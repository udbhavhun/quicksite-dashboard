
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { HelpCircle, Send, Search, Book, Video, MessageSquare, ExternalLink, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';

const Support = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleContactChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit form
    toast({
      title: "Message sent",
      description: "We've received your message and will respond shortly."
    });
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  // FAQ data
  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I track my website build progress?',
      answer: 'You can track your website build progress from your dashboard. The progress bar shows you what stage your project is in, and the detailed view gives you a breakdown of each step in the process. You will also receive email updates when significant milestones are reached.'
    },
    {
      id: 'faq-2',
      question: 'Can I request changes to my website design?',
      answer: 'Yes, you can request changes to your website design through the project communication tab. Simply explain what changes you would like to make, and our team will review your request. Some changes may be included in your package, while others might require additional fees depending on the scope.'
    },
    {
      id: 'faq-3',
      question: 'What is the typical timeline for website completion?',
      answer: "The timeline for website completion depends on the package you've selected. Basic websites typically take 1-2 weeks, while more complex e-commerce or custom websites can take 4-8 weeks. Your specific timeline is visible in your dashboard under the project details."
    },
    {
      id: 'faq-4',
      question: 'How do I add content to my website?',
      answer: "Once your website framework is set up, you'll receive access to a content management system (CMS) where you can add and edit your website content. Our team will provide training on how to use the CMS, and you'll find video tutorials in the support section of your dashboard."
    },
    {
      id: 'faq-5',
      question: 'What happens after my website goes live?',
      answer: 'After your website goes live, we provide 30 days of complimentary support to address any issues that might arise. Beyond that, you can purchase one of our maintenance packages to ensure your website stays updated and secure.'
    },
    {
      id: 'faq-6',
      question: 'Can I upgrade my package later?',
      answer: 'Yes, you can upgrade your package or add additional features at any time. Simply contact our team through the dashboard or purchase add-ons directly from the add-ons section in your order details page.'
    }
  ];
  
  // Documentation data
  const documentation = [
    {
      id: 'doc-1',
      title: 'Getting Started Guide',
      description: 'Learn the basics of navigating your dashboard and managing your website project.',
      icon: <Book size={24} />,
      link: '#getting-started'
    },
    {
      id: 'doc-2',
      title: 'Content Management',
      description: 'Comprehensive guide to adding and managing content on your website.',
      icon: <Book size={24} />,
      link: '#content-management'
    },
    {
      id: 'doc-3',
      title: 'E-commerce Setup',
      description: 'Step-by-step instructions for setting up and managing your online store.',
      icon: <Book size={24} />,
      link: '#ecommerce-setup'
    },
    {
      id: 'doc-4',
      title: 'SEO Best Practices',
      description: 'Optimize your website for search engines with these proven strategies.',
      icon: <Book size={24} />,
      link: '#seo-practices'
    },
    {
      id: 'doc-5',
      title: 'Website Maintenance',
      description: 'Learn how to keep your website updated, secure, and performing optimally.',
      icon: <Book size={24} />,
      link: '#maintenance'
    },
    {
      id: 'doc-6',
      title: 'Analytics & Reporting',
      description: 'Understanding website traffic, user behavior, and conversion tracking.',
      icon: <Book size={24} />,
      link: '#analytics'
    }
  ];
  
  // Video tutorials data
  const videoTutorials = [
    {
      id: 'video-1',
      title: 'Dashboard Overview',
      duration: '5:24',
      thumbnail: 'https://via.placeholder.com/300x200',
      link: '#dashboard-tutorial'
    },
    {
      id: 'video-2',
      title: 'Managing Your Website Content',
      duration: '8:17',
      thumbnail: 'https://via.placeholder.com/300x200',
      link: '#content-tutorial'
    },
    {
      id: 'video-3',
      title: 'Setting Up Products',
      duration: '12:03',
      thumbnail: 'https://via.placeholder.com/300x200',
      link: '#products-tutorial'
    },
    {
      id: 'video-4',
      title: 'Managing Orders',
      duration: '7:45',
      thumbnail: 'https://via.placeholder.com/300x200',
      link: '#orders-tutorial'
    },
    {
      id: 'video-5',
      title: 'SEO Optimization Tips',
      duration: '10:32',
      thumbnail: 'https://via.placeholder.com/300x200',
      link: '#seo-tutorial'
    },
    {
      id: 'video-6',
      title: 'Analytics & Performance',
      duration: '9:18',
      thumbnail: 'https://via.placeholder.com/300x200',
      link: '#analytics-tutorial'
    }
  ];
  
  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="mr-2 sm:hidden" />
              <h1 className="text-3xl font-bold text-gradient">Support Center</h1>
            </div>
            
            <div className="glass-card p-6 mb-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-2">How can we help you today?</h2>
                <p className="text-gray-600 mb-6">Search our knowledge base or browse our help articles.</p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search for help articles, tutorials, and more..."
                    className="pl-10 pr-4 py-3 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="faq" className="mb-10">
              <TabsList className="mb-6 glass-card p-1 bg-white/50">
                <TabsTrigger value="faq" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="documentation" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <Book size={16} className="mr-2" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger value="videos" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <Video size={16} className="mr-2" />
                  Video Tutorials
                </TabsTrigger>
                <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <MessageSquare size={16} className="mr-2" />
                  Contact Support
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="faq">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-100 rounded-lg overflow-hidden"
                      >
                        <div
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <h3 className="font-medium text-lg">{faq.question}</h3>
                          {expandedFaqs[faq.id] ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </div>
                        
                        {expandedFaqs[faq.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 bg-gray-50 border-t border-gray-100"
                          >
                            <p className="text-gray-700">
                              {faq.answer}
                            </p>
                            <div className="flex items-center justify-end mt-4 space-x-2">
                              <p className="text-sm text-gray-500">Was this helpful?</p>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ThumbsUp size={14} />
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ThumbsDown size={14} />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="documentation">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Documentation</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentation.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-quicksite-blue/10 rounded-lg flex items-center justify-center mr-3">
                            {doc.icon}
                          </div>
                          <h3 className="font-medium">{doc.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">{doc.description}</p>
                        <a
                          href={doc.link}
                          className="text-quicksite-blue hover:text-quicksite-dark-blue flex items-center text-sm"
                        >
                          Read documentation <ExternalLink size={14} className="ml-1" />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="videos">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Video Tutorials</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoTutorials.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="relative">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center cursor-pointer">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-quicksite-blue border-b-[8px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                            {video.duration}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-2">{video.title}</h3>
                          <a
                            href={video.link}
                            className="text-quicksite-blue hover:text-quicksite-dark-blue flex items-center text-sm"
                          >
                            Watch tutorial <ExternalLink size={14} className="ml-1" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="contact">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                      <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>
                      
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                          <Input
                            value={contactForm.name}
                            onChange={(e) => handleContactChange('name', e.target.value)}
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                          <Input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => handleContactChange('email', e.target.value)}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                          <Input
                            value={contactForm.subject}
                            onChange={(e) => handleContactChange('subject', e.target.value)}
                            placeholder="What is your inquiry about?"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                          <Textarea
                            value={contactForm.message}
                            onChange={(e) => handleContactChange('message', e.target.value)}
                            placeholder="Please describe your issue or question in detail"
                            rows={6}
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          <Send size={16} className="mr-2" />
                          Send Message
                        </Button>
                      </form>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                      <h2 className="text-2xl font-semibold mb-6">Support Info</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Email Support</h3>
                          <p className="text-gray-600">support@quicksite.example.com</p>
                          <p className="text-sm text-gray-500 mt-1">Responses within 24 hours</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Phone Support</h3>
                          <p className="text-gray-600">+1 (555) 123-4567</p>
                          <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9am - 5pm EST</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Live Chat</h3>
                          <p className="text-gray-600 mb-2">Chat with our support team in real-time.</p>
                          <Button variant="outline" className="w-full">
                            Start Chat
                          </Button>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Support Hours</h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex justify-between">
                              <span>Monday - Friday:</span>
                              <span>9:00 AM - 8:00 PM EST</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Saturday:</span>
                              <span>10:00 AM - 6:00 PM EST</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Sunday:</span>
                              <span>Closed</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Support;
