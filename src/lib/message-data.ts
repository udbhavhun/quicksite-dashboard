
export interface Message {
  id: string;
  sender: 'system' | 'admin' | 'user';
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export const messages: Message[] = [
  {
    id: '1',
    sender: 'system',
    content: 'Welcome to the quicksite messaging system!',
    timestamp: '2023-01-01T10:00:00Z',
    read: true
  },
  {
    id: '2',
    sender: 'admin',
    content: 'Your project has been started. Let us know if you have any questions.',
    timestamp: '2023-01-02T14:30:00Z',
    read: false
  },
  {
    id: '3',
    sender: 'admin',
    content: 'We have completed the initial design phase. Please review the attached mockups.',
    timestamp: '2023-01-03T09:15:00Z',
    read: false,
    attachments: [
      {
        name: 'homepage-mockup.pdf',
        url: '/mockups/homepage-v1.pdf',
        type: 'application/pdf'
      },
      {
        name: 'mobile-design.jpg',
        url: '/mockups/mobile-design.jpg',
        type: 'image/jpeg'
      }
    ]
  },
  {
    id: '4',
    sender: 'user',
    content: 'The designs look great! I especially like the mobile version.',
    timestamp: '2023-01-03T11:45:00Z',
    read: true
  },
  {
    id: '5',
    sender: 'system',
    content: 'Your project status has been updated to "In Progress"',
    timestamp: '2023-01-04T08:00:00Z',
    read: true
  },
  {
    id: '6',
    sender: 'admin',
    content: 'Development has begun. We will keep you updated on our progress.',
    timestamp: '2023-01-04T13:20:00Z',
    read: false
  },
  {
    id: '7',
    sender: 'admin',
    content: "We've completed the homepage implementation. Could you please review it?",
    timestamp: '2023-01-05T10:40:00Z',
    read: false,
    attachments: [
      {
        name: 'homepage-preview.jpg',
        url: '/previews/homepage-preview.jpg',
        type: 'image/jpeg'
      }
    ]
  },
  {
    id: '8',
    sender: 'user',
    content: 'The homepage looks amazing! Can we adjust the button colors to match our brand better?',
    timestamp: '2023-01-05T14:15:00Z',
    read: true
  },
  {
    id: '9',
    sender: 'admin',
    content: "Absolutely, we'll update the button colors. Expect the changes by tomorrow.",
    timestamp: '2023-01-05T15:30:00Z',
    read: false
  },
  {
    id: '10',
    sender: 'system',
    content: 'A new invoice has been generated for your project',
    timestamp: '2023-01-06T09:00:00Z',
    read: false
  }
];

export const getUnreadCount = (messages: Message[]): number => {
  return messages.filter(message => !message.read).length;
};

export const markMessageAsRead = (messages: Message[], messageId: string): Message[] => {
  return messages.map(message => 
    message.id === messageId 
      ? { ...message, read: true }
      : message
  );
};

export const addMessage = (messages: Message[], content: string, sender: Message['sender']): Message[] => {
  const newMessage: Message = {
    id: Date.now().toString(),
    sender,
    content,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  return [...messages, newMessage];
};

export const MOCK_MESSAGE_THREADS = [
  {
    id: 'thread-1',
    subject: 'Question about my website project',
    participants: [
      {
        id: 'user-1',
        name: 'John Doe',
        role: 'customer'
      },
      {
        id: 'admin-1',
        name: 'Support Team',
        role: 'admin'
      }
    ],
    lastMessage: {
      content: 'Can you provide an update on the wireframes?',
      timestamp: '2023-12-05T14:30:00',
      senderId: 'user-1'
    },
    isUnread: true,
    orderId: 'ORD-2023-001',
    messages: [
      {
        id: 'msg-1',
        content: 'Hello! I was wondering if you could give me an update on the wireframes for my website project.',
        sender: 'customer',
        senderName: 'John Doe',
        timestamp: '2023-12-05T14:00:00',
        isRead: true
      },
      {
        id: 'msg-2',
        content: "Hi John, we're currently finalizing the wireframes and should have them ready for review by tomorrow. Would you like us to schedule a call to go through them together?",
        sender: 'admin',
        senderName: 'Support Team',
        timestamp: '2023-12-05T14:15:00',
        isRead: true
      },
      {
        id: 'msg-3',
        content: 'That would be great. Can you provide an update on the wireframes?',
        sender: 'customer',
        senderName: 'John Doe',
        timestamp: '2023-12-05T14:30:00',
        isRead: false
      }
    ]
  },
  {
    id: 'thread-2',
    subject: 'E-commerce integration',
    participants: [
      {
        id: 'user-2',
        name: 'Sarah Wilson',
        role: 'customer'
      },
      {
        id: 'admin-1',
        name: 'Support Team',
        role: 'admin'
      }
    ],
    lastMessage: {
      content: "Thanks for the update. I'm excited to see the integration in action!",
      timestamp: '2023-12-04T16:45:00',
      senderId: 'user-2'
    },
    isUnread: false,
    orderId: 'ORD-2023-002',
    messages: [
      {
        id: 'msg-4',
        content: 'I wanted to check on the status of integrating the payment gateway with my online store.',
        sender: 'customer',
        senderName: 'Sarah Wilson',
        timestamp: '2023-12-04T15:30:00',
        isRead: true
      },
      {
        id: 'msg-5',
        content: "Hi Sarah, we've completed the integration with Stripe and are now testing it to ensure everything works smoothly. We should have it live on your site within the next 48 hours.",
        sender: 'admin',
        senderName: 'Support Team',
        timestamp: '2023-12-04T16:15:00',
        isRead: true,
        attachments: [
          {
            id: 'attach-1',
            filename: 'payment_gateway_doc.pdf',
            type: 'pdf',
            url: '#',
            size: '2.4 MB'
          }
        ]
      },
      {
        id: 'msg-6',
        content: "Thanks for the update. I'm excited to see the integration in action!",
        sender: 'customer',
        senderName: 'Sarah Wilson',
        timestamp: '2023-12-04T16:45:00',
        isRead: true
      }
    ]
  },
  {
    id: 'thread-3',
    subject: 'Website launch timeline',
    participants: [
      {
        id: 'user-3',
        name: 'Michael Brown',
        role: 'customer'
      },
      {
        id: 'admin-2',
        name: 'Project Manager',
        role: 'admin'
      }
    ],
    lastMessage: {
      content: "We're on track for the January 15th launch date. All major features are now complete.",
      timestamp: '2023-12-03T11:20:00',
      senderId: 'admin-2'
    },
    isUnread: false,
    orderId: 'ORD-2023-003',
    messages: [
      {
        id: 'msg-7',
        content: 'Are we still on track for the January launch?',
        sender: 'customer',
        senderName: 'Michael Brown',
        timestamp: '2023-12-03T10:45:00',
        isRead: true
      },
      {
        id: 'msg-8',
        content: "We're on track for the January 15th launch date. All major features are now complete.",
        sender: 'admin',
        senderName: 'Project Manager',
        timestamp: '2023-12-03T11:20:00',
        isRead: true
      }
    ]
  }
];
