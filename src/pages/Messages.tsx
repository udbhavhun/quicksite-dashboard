import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/userStore';
import { 
  Send,
  Search,
  ChevronLeft,
  MoreVertical,
  Paperclip,
  Smile,
  Users,
  User,
  Filter,
  Plus
} from 'lucide-react';

// Mock message data structure
interface MessageAttachment {
  id: string;
  filename: string;
  type: string;
  url: string;
  size: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'admin' | 'system';
  senderName: string;
  timestamp: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
}

interface MessageThread {
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

// Mock data - in a real app, this would come from an API
const MOCK_MESSAGE_THREADS: MessageThread[] = [
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
        content: 'Hi John, we\'re currently finalizing the wireframes and should have them ready for review by tomorrow. Would you like us to schedule a call to go through them together?',
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

const Messages = () => {
  const { toast } = useToast();
  const { userType } = useUserStore();
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingNewThread, setIsCreatingNewThread] = useState(false);
  const [newThreadData, setNewThreadData] = useState({
    subject: '',
    message: '',
    recipientId: ''
  });

  // Filter threads based on search query
  const filteredThreads = messageThreads.filter(thread => 
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    thread.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Mark messages as read when thread is selected
  useEffect(() => {
    if (selectedThread) {
      const updatedThreads = messageThreads.map(thread => {
        if (thread.id === selectedThread.id) {
          const updatedMessages = thread.messages.map(msg => ({
            ...msg,
            isRead: true
          }));
          return {
            ...thread,
            isUnread: false,
            messages: updatedMessages
          };
        }
        return thread;
      });
      setMessageThreads(updatedThreads);
    }
  }, [selectedThread]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return;

    const currentTime = new Date().toISOString();
    const currentUser = userType === 'admin' ? 'admin' : 'customer';
    const senderName = userType === 'admin' ? 'Support Team' : 'You';

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: currentUser,
      senderName,
      timestamp: currentTime,
      isRead: true
    };

    const updatedThreads = messageThreads.map(thread => {
      if (thread.id === selectedThread.id) {
        return {
          ...thread,
          messages: [...thread.messages, newMsg],
          lastMessage: {
            content: newMessage,
            timestamp: currentTime,
            senderId: currentUser === 'admin' ? 'admin-1' : 'user-1'
          }
        };
      }
      return thread;
    });

    setMessageThreads(updatedThreads);
    
    // Update the selected thread
    const updatedSelectedThread = updatedThreads.find(t => t.id === selectedThread.id);
    if (updatedSelectedThread) {
      setSelectedThread(updatedSelectedThread);
    }
    
    setNewMessage('');
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully."
    });
  };

  const handleCreateNewThread = () => {
    if (!newThreadData.subject.trim() || !newThreadData.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const currentTime = new Date().toISOString();
    const currentUser = userType === 'admin' ? 'admin' : 'customer';
    const senderName = userType === 'admin' ? 'Support Team' : 'John Doe';

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newThreadData.message,
      sender: currentUser,
      senderName,
      timestamp: currentTime,
      isRead: true
    };

    const recipient = {
      id: userType === 'admin' ? 'user-1' : 'admin-1',
      name: userType === 'admin' ? 'John Doe' : 'Support Team',
      role: userType === 'admin' ? 'customer' : 'admin'
    };

    const newThread: MessageThread = {
      id: `thread-${Date.now()}`,
      subject: newThreadData.subject,
      participants: [
        {
          id: userType === 'admin' ? 'admin-1' : 'user-1',
          name: senderName,
          role: currentUser
        },
        recipient
      ],
      lastMessage: {
        content: newThreadData.message,
        timestamp: currentTime,
        senderId: userType === 'admin' ? 'admin-1' : 'user-1'
      },
      isUnread: false,
      messages: [newMsg]
    };

    setMessageThreads([newThread, ...messageThreads]);
    setSelectedThread(newThread);
    setIsCreatingNewThread(false);
    setNewThreadData({
      subject: '',
      message: '',
      recipientId: ''
    });
    
    toast({
      title: "Message sent",
      description: "Your new conversation has been started."
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <Header />
        
        <main className="flex-grow flex flex-col h-[calc(100vh-64px)]">
          <div className="flex h-full">
            {/* Message list sidebar */}
            <div className={`border-r border-gray-200 ${selectedThread ? 'hidden md:block' : 'block'} w-full md:w-80 lg:w-96`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-2 sm:hidden" />
                    <h1 className="text-xl font-bold">Messages</h1>
                  </div>
                  <Button 
                    onClick={() => {
                      setIsCreatingNewThread(true);
                      setSelectedThread(null);
                    }}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">New Message</span>
                  </Button>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter size={14} />
                    <span>Filter</span>
                  </Button>
                  {userType === 'admin' && (
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Users size={14} />
                      <span>All Users</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-129px)]">
                {filteredThreads.length > 0 ? (
                  filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => {
                        setSelectedThread(thread);
                        setIsCreatingNewThread(false);
                      }}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        thread.isUnread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <h3 className={`font-medium truncate mr-2 ${thread.isUnread ? 'font-semibold' : ''}`}>
                          {thread.orderId && (
                            <span className="text-sm bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 mr-2">
                              {thread.orderId}
                            </span>
                          )}
                          {thread.subject}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(thread.lastMessage.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 truncate">
                            {thread.lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {thread.participants
                              .filter(p => p.role !== (userType === 'admin' ? 'admin' : 'customer'))
                              .map(p => p.name)
                              .join(', ')}
                          </p>
                        </div>
                        {thread.isUnread && (
                          <div className="h-2 w-2 bg-quicksite-blue rounded-full ml-2 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No messages found</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Message detail view */}
            {selectedThread ? (
              <div className="flex-1 flex flex-col h-full">
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button 
                        onClick={() => setSelectedThread(null)} 
                        className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div>
                        <h2 className="font-semibold">{selectedThread.subject}</h2>
                        <p className="text-sm text-gray-600">
                          {selectedThread.participants
                            .filter(p => p.role !== (userType === 'admin' ? 'admin' : 'customer'))
                            .map(p => p.name)
                            .join(', ')}
                          {selectedThread.orderId && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                              {selectedThread.orderId}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedThread.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === (userType === 'admin' ? 'admin' : 'customer')
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === (userType === 'admin' ? 'admin' : 'customer')
                            ? 'bg-quicksite-blue text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">
                            {message.sender === (userType === 'admin' ? 'admin' : 'customer')
                              ? 'You'
                              : message.senderName}
                          </span>
                          <span
                            className={`text-xs ${
                              message.sender === (userType === 'admin' ? 'admin' : 'customer')
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            } ml-2`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map(attachment => (
                              <div 
                                key={attachment.id}
                                className={`flex items-center p-2 rounded ${
                                  message.sender === (userType === 'admin' ? 'admin' : 'customer')
                                    ? 'bg-blue-400'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <Paperclip size={14} className="mr-2" />
                                <span className="text-sm flex-1 truncate">{attachment.filename}</span>
                                <span className="text-xs opacity-70">{attachment.size}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 p-4">
                  <div className="flex">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none min-h-[60px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-500 hover:text-gray-700 p-1">
                            <Paperclip size={18} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 p-1">
                            <Smile size={18} />
                          </button>
                        </div>
                        <Button onClick={handleSendMessage} className="flex items-center">
                          <Send size={16} className="mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : isCreatingNewThread ? (
              <div className="flex-1 flex flex-col h-full">
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center">
                    <button 
                      onClick={() => setIsCreatingNewThread(false)} 
                      className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-semibold">New Message</h2>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <Input
                        placeholder="Enter subject..."
                        value={newThreadData.subject}
                        onChange={(e) => setNewThreadData({ 
                          ...newThreadData, 
                          subject: e.target.value 
                        })}
                      />
                    </div>
                    
                    {userType === 'admin' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recipient
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3"
                          value={newThreadData.recipientId}
                          onChange={(e) => setNewThreadData({
                            ...newThreadData,
                            recipientId: e.target.value
                          })}
                        >
                          <option value="">Select a recipient</option>
                          <option value="user-1">John Doe</option>
                          <option value="user-2">Sarah Wilson</option>
                          <option value="user-3">Michael Brown</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        placeholder="Type your message..."
                        value={newThreadData.message}
                        onChange={(e) => setNewThreadData({
                          ...newThreadData,
                          message: e.target.value
                        })}
                        className="resize-none min-h-[200px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-4">
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsCreatingNewThread(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateNewThread} className="flex items-center">
                      <Send size={16} className="mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="text-center p-4 max-w-md">
                  <User size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-gray-500 mb-4">
                    Choose a message thread from the sidebar or start a new conversation.
                  </p>
                  <Button 
                    onClick={() => setIsCreatingNewThread(true)}
                    className="flex items-center mx-auto"
                  >
                    <Plus size={16} className="mr-2" />
                    New Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Messages;
