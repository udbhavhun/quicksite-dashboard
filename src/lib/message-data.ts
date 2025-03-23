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
