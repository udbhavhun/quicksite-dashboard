
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  link: string;
  category?: string;
}

export interface VideoTutorialItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  link: string;
}

export interface ContactSupportItem {
  id: string;
  title: string;
  description: string;
  email: string;
  phone?: string;
}

export const faqs: FAQItem[] = [
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

export const documentation: DocumentationItem[] = [
  {
    id: 'doc-1',
    title: 'Getting Started Guide',
    description: 'Learn the basics of navigating your dashboard and managing your website project.',
    link: '#getting-started'
  },
  {
    id: 'doc-2',
    title: 'Content Management',
    description: 'Comprehensive guide to adding and managing content on your website.',
    link: '#content-management'
  },
  {
    id: 'doc-3',
    title: 'E-commerce Setup',
    description: 'Step-by-step instructions for setting up and managing your online store.',
    link: '#ecommerce-setup'
  },
  {
    id: 'doc-4',
    title: 'SEO Best Practices',
    description: 'Optimize your website for search engines with these proven strategies.',
    link: '#seo-practices'
  },
  {
    id: 'doc-5',
    title: 'Website Maintenance',
    description: 'Learn how to keep your website updated, secure, and performing optimally.',
    link: '#maintenance'
  },
  {
    id: 'doc-6',
    title: 'Analytics & Reporting',
    description: 'Understanding website traffic, user behavior, and conversion tracking.',
    link: '#analytics'
  }
];

export const videoTutorials: VideoTutorialItem[] = [
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

export const contactSupport: ContactSupportItem[] = [
  {
    id: 'contact-1',
    title: 'General Support',
    description: 'For general inquiries about your website project',
    email: 'support@quicksite.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'contact-2',
    title: 'Technical Support',
    description: 'For technical issues or questions',
    email: 'tech@quicksite.com',
    phone: '+1 (555) 987-6543'
  }
];
