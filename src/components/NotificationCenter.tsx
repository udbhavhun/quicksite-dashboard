
import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/stores/userStore';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile } = useUserStore();

  // Demo notifications - in a real app, these would come from the backend
  const demoNotifications: Notification[] = [
    {
      id: '1',
      title: 'Order Status Update',
      message: 'Your website order #ORD-20241-001 is now in progress.',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
    },
    {
      id: '2',
      title: 'Account Security',
      message: 'You recently logged in from a new device. Please verify this was you.',
      type: 'warning',
      read: false,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: '3',
      title: 'Payment Successful',
      message: 'Your payment of $499 has been processed successfully.',
      type: 'success',
      read: true,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    }
  ];

  // Load notifications when component mounts
  useEffect(() => {
    // For demo, load notifications from localStorage or use demo data
    const storedNotifications = localStorage.getItem('user-notifications');
    
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
    } else {
      setNotifications(demoNotifications);
      setUnreadCount(demoNotifications.filter(n => !n.read).length);
      localStorage.setItem('user-notifications', JSON.stringify(demoNotifications));
    }

    // Real-time notifications could be set up here with Supabase
    const channel = supabase
      .channel('notification-updates')
      .on(
        'broadcast',
        { event: 'new-notification' },
        (payload) => {
          if (payload.payload && typeof payload.payload === 'object') {
            const newNotification = payload.payload as Notification;
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(count => count + 1);
            
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Mark notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('user-notifications', JSON.stringify(updatedNotifications));
    
    const newUnreadCount = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(newUnreadCount);
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    localStorage.setItem('user-notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(0);
    
    toast({
      title: "All notifications marked as read",
      description: "You have no new notifications."
    });
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('user-notifications', JSON.stringify(updatedNotifications));
    
    const newUnreadCount = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(newUnreadCount);
  };

  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'info':
      default:
        return <Mail className="text-blue-500" size={16} />;
    }
  };

  if (!profile) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-100 text-gray-700"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 bg-red-500 text-white"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-20 right-6 w-80 max-h-[70vh] bg-white shadow-xl rounded-lg z-50 overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={markAllAsRead}
                  >
                    <CheckCircle size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(70vh-4rem)]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-700 mb-1">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <time className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </time>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">New</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t bg-gray-50 text-center">
                <Button
                  variant="link"
                  className="text-sm text-gray-600"
                  onClick={() => {
                    setIsOpen(false);
                    toast({
                      title: "Notification settings",
                      description: "This feature will be available in a future update."
                    });
                  }}
                >
                  <Settings size={14} className="mr-1" />
                  Notification Settings
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
