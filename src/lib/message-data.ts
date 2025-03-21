
import { MessageThread } from '@/types/message-types';

// Mock message data for the app
export const MOCK_MESSAGE_THREADS: MessageThread[] = [
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
