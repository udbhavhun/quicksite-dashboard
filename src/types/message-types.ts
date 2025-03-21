
export interface MessageAttachment {
  id: string;
  filename: string;
  type: string;
  url: string;
  size: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'admin' | 'system';
  senderName: string;
  timestamp: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: 'customer' | 'admin';
  }[];
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  isUnread: boolean;
  orderId?: string;
  messages: Message[];
}
