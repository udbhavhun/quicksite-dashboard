
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerData } from "@/hooks/use-customer-data";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Send, MessageSquare, Mail, FileText, AlertTriangle, CheckCircle, Calendar, Info } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order_status' | 'payment' | 'invoice' | 'subscription' | 'promotion' | 'system';
  status: 'sent' | 'scheduled' | 'draft' | 'error';
  sent_at?: string;
  scheduled_for?: string;
  recipient_id: string;
  recipient_email: string;
  recipient_name: string;
  channels: ('email' | 'sms' | 'dashboard')[];
  read?: boolean;
  order_id?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  type: 'order_status' | 'payment' | 'invoice' | 'subscription' | 'promotion' | 'system';
}

const CustomerNotificationsManager = () => {
  // State for the notifications list
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // State for creating a new notification
  const [isNewNotificationDialogOpen, setIsNewNotificationDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<{
    title: string;
    message: string;
    type: string;
    recipientIds: string[];
    channels: ('email' | 'sms' | 'dashboard')[];
    scheduleDate?: string;
  }>({
    title: '',
    message: '',
    type: 'order_status',
    recipientIds: [],
    channels: ['dashboard'],
    scheduleDate: undefined
  });
  
  // State for notification templates
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Order Status Update',
      subject: 'Your order status has been updated',
      message: 'Dear {{customer_name}},\n\nYour order #{{order_id}} status has been updated to {{status}}.\n\nThank you for choosing our service.',
      type: 'order_status'
    },
    {
      id: '2',
      name: 'Payment Confirmation',
      subject: 'Payment Confirmation',
      message: 'Dear {{customer_name}},\n\nWe have received your payment of {{amount}} for order #{{order_id}}.\n\nThank you for your business.',
      type: 'payment'
    },
    {
      id: '3',
      name: 'Invoice',
      subject: 'Your Invoice',
      message: 'Dear {{customer_name}},\n\nPlease find attached your invoice #{{invoice_id}} for order #{{order_id}}.\n\nAmount: {{amount}}\nDue Date: {{due_date}}\n\nThank you for your business.',
      type: 'invoice'
    }
  ]);
  
  // Fetch mock notifications data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be fetched from the database
        // Mocking data for demonstration
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Order Status Update',
            message: 'Your order #ORD-12345 status has been updated to "In Progress".',
            type: 'order_status',
            status: 'sent',
            sent_at: new Date(Date.now() - 3600000).toISOString(),
            recipient_id: '123',
            recipient_email: 'customer@example.com',
            recipient_name: 'John Doe',
            channels: ['email', 'dashboard'],
            read: true,
            order_id: 'ORD-12345'
          },
          {
            id: '2',
            title: 'Payment Confirmation',
            message: 'We have received your payment of ₹25,000 for order #ORD-12345.',
            type: 'payment',
            status: 'sent',
            sent_at: new Date(Date.now() - 86400000).toISOString(),
            recipient_id: '123',
            recipient_email: 'customer@example.com',
            recipient_name: 'John Doe',
            channels: ['email', 'sms', 'dashboard'],
            read: false,
            order_id: 'ORD-12345'
          },
          {
            id: '3',
            title: 'New Invoice',
            message: 'Your invoice #INV-001 for order #ORD-45678 has been generated.',
            type: 'invoice',
            status: 'scheduled',
            scheduled_for: new Date(Date.now() + 86400000).toISOString(),
            recipient_id: '456',
            recipient_email: 'jane@example.com',
            recipient_name: 'Jane Smith',
            channels: ['email', 'dashboard'],
            order_id: 'ORD-45678'
          },
          {
            id: '4',
            title: 'Subscription Renewal',
            message: 'Your subscription will renew on 01/01/2024.',
            type: 'subscription',
            status: 'draft',
            recipient_id: '789',
            recipient_email: 'bob@example.com',
            recipient_name: 'Bob Johnson',
            channels: ['email']
          },
          {
            id: '5',
            title: 'Special Promotion',
            message: 'Get 20% off on your next order with code PROMO20.',
            type: 'promotion',
            status: 'error',
            sent_at: new Date(Date.now() - 172800000).toISOString(),
            recipient_id: '123',
            recipient_email: 'customer@example.com',
            recipient_name: 'John Doe',
            channels: ['email', 'sms'],
            read: false
          }
        ];
        
        setNotifications(mockNotifications);
        
        // Fetch customers from the database
        const { data: customersData, error } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('role', 'customer');
        
        if (error) throw error;
        
        setCustomers(customersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notifications data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter notifications based on active tab and search query
  const filteredNotifications = notifications.filter(notification => {
    // Filter by tab
    if (activeTab !== 'all' && notification.type !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.recipient_email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleCreateNotification = () => {
    // In a real app, this would send the notification to the database
    // and trigger the actual notification delivery
    
    // Validate form
    if (!newNotification.title || !newNotification.message || newNotification.recipientIds.length === 0 || newNotification.channels.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    // Generate a new notification for each recipient
    const createdNotifications = newNotification.recipientIds.map(recipientId => {
      const customer = customers.find(c => c.id === recipientId);
      
      return {
        id: `new-${Date.now()}-${recipientId}`,
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type as any,
        status: newNotification.scheduleDate ? 'scheduled' : 'sent',
        sent_at: newNotification.scheduleDate ? undefined : new Date().toISOString(),
        scheduled_for: newNotification.scheduleDate,
        recipient_id: recipientId,
        recipient_email: customer?.email || '',
        recipient_name: customer?.name || '',
        channels: newNotification.channels,
        read: false
      };
    });
    
    // Add the new notifications to the list
    setNotifications([...createdNotifications, ...notifications]);
    
    // Reset form and close dialog
    setNewNotification({
      title: '',
      message: '',
      type: 'order_status',
      recipientIds: [],
      channels: ['dashboard'],
      scheduleDate: undefined
    });
    
    setIsNewNotificationDialogOpen(false);
    
    toast({
      title: 'Success',
      description: `Notification ${newNotification.scheduleDate ? 'scheduled' : 'sent'} to ${createdNotifications.length} recipient(s).`,
    });
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_status':
        return <FileText className="h-4 w-4" />;
      case 'payment':
        return <CheckCircle className="h-4 w-4" />;
      case 'invoice':
        return <FileText className="h-4 w-4" />;
      case 'subscription':
        return <Calendar className="h-4 w-4" />;
      case 'promotion':
        return <Info className="h-4 w-4" />;
      case 'system':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewNotification({
        ...newNotification,
        title: template.subject,
        message: template.message,
        type: template.type
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Customer Notifications</h2>
          <p className="text-gray-500">Manage notifications sent to customers</p>
        </div>
        
        <Dialog open={isNewNotificationDialogOpen} onOpenChange={setIsNewNotificationDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Bell className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notification-template" className="text-right">
                  Template
                </Label>
                <Select onValueChange={handleSelectTemplate}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notification-type" className="text-right">
                  Type*
                </Label>
                <Select 
                  value={newNotification.type} 
                  onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order_status">Order Status</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notification-title" className="text-right">
                  Title*
                </Label>
                <Input
                  id="notification-title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notification-message" className="text-right">
                  Message*
                </Label>
                <Textarea
                  id="notification-message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notification-recipients" className="text-right">
                  Recipients*
                </Label>
                <div className="col-span-3 border rounded-md p-2 max-h-[150px] overflow-y-auto">
                  {customers.map(customer => (
                    <div key={customer.id} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`customer-${customer.id}`}
                        checked={newNotification.recipientIds.includes(customer.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewNotification({
                              ...newNotification, 
                              recipientIds: [...newNotification.recipientIds, customer.id]
                            });
                          } else {
                            setNewNotification({
                              ...newNotification, 
                              recipientIds: newNotification.recipientIds.filter(id => id !== customer.id)
                            });
                          }
                        }}
                      />
                      <label 
                        htmlFor={`customer-${customer.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {customer.name} ({customer.email})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Channels*
                </Label>
                <div className="col-span-3 flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="channel-email"
                      checked={newNotification.channels.includes('email')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewNotification({
                            ...newNotification, 
                            channels: [...newNotification.channels, 'email']
                          });
                        } else {
                          setNewNotification({
                            ...newNotification, 
                            channels: newNotification.channels.filter(c => c !== 'email')
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor="channel-email"
                      className="text-sm flex items-center cursor-pointer"
                    >
                      <Mail className="mr-1 h-4 w-4" /> Email
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="channel-sms"
                      checked={newNotification.channels.includes('sms')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewNotification({
                            ...newNotification, 
                            channels: [...newNotification.channels, 'sms']
                          });
                        } else {
                          setNewNotification({
                            ...newNotification, 
                            channels: newNotification.channels.filter(c => c !== 'sms')
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor="channel-sms"
                      className="text-sm flex items-center cursor-pointer"
                    >
                      <MessageSquare className="mr-1 h-4 w-4" /> SMS
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="channel-dashboard"
                      checked={newNotification.channels.includes('dashboard')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewNotification({
                            ...newNotification, 
                            channels: [...newNotification.channels, 'dashboard']
                          });
                        } else {
                          setNewNotification({
                            ...newNotification, 
                            channels: newNotification.channels.filter(c => c !== 'dashboard')
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor="channel-dashboard"
                      className="text-sm flex items-center cursor-pointer"
                    >
                      <Bell className="mr-1 h-4 w-4" /> Dashboard
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-notification" className="text-right">
                  Schedule
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Switch
                    id="schedule-notification"
                    checked={!!newNotification.scheduleDate}
                    onCheckedChange={(checked) => {
                      setNewNotification({
                        ...newNotification,
                        scheduleDate: checked ? new Date().toISOString().split('T')[0] : undefined
                      });
                    }}
                  />
                  
                  {newNotification.scheduleDate && (
                    <Input
                      type="datetime-local"
                      value={newNotification.scheduleDate}
                      onChange={(e) => setNewNotification({...newNotification, scheduleDate: e.target.value})}
                    />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewNotificationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNotification}>
                {newNotification.scheduleDate ? (
                  <>Schedule Notification</>
                ) : (
                  <>Send Notification</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="order_status">Order Updates</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-72">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Notification</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-quicksite-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No notifications found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map(notification => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="p-2 rounded-full bg-gray-100 mr-2">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <span className="text-xs capitalize">{notification.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">{notification.message}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notification.recipient_name}</div>
                        <div className="text-xs text-gray-500">{notification.recipient_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(notification.status)}>
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {notification.channels.includes('email') && (
                          <Badge variant="outline" className="bg-blue-50">
                            <Mail className="h-3 w-3 mr-1" /> Email
                          </Badge>
                        )}
                        {notification.channels.includes('sms') && (
                          <Badge variant="outline" className="bg-green-50">
                            <MessageSquare className="h-3 w-3 mr-1" /> SMS
                          </Badge>
                        )}
                        {notification.channels.includes('dashboard') && (
                          <Badge variant="outline" className="bg-purple-50">
                            <Bell className="h-3 w-3 mr-1" /> App
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {notification.sent_at ? (
                        <div className="text-sm">
                          {new Date(notification.sent_at).toLocaleDateString()}
                          <div className="text-xs text-gray-500">
                            {new Date(notification.sent_at).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : notification.scheduled_for ? (
                        <div className="text-sm">
                          Scheduled for:
                          <div className="text-xs font-medium">
                            {new Date(notification.scheduled_for).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" title="Resend">
                          <Send className="h-4 w-4" />
                        </Button>
                        {notification.status === 'scheduled' && (
                          <Button variant="ghost" size="icon" title="Cancel">
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerNotificationsManager;
