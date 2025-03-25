import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  status: 'draft' | 'scheduled' | 'sent' | 'error';
  sent_at: string;
  scheduled_for: string;
  recipient_id: string;
  recipient_email: string;
  recipient_name: string;
  channels: ('email' | 'sms' | 'dashboard')[];
  read: boolean;
}

const defaultNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to Our Platform',
    message: 'Thank you for joining our community! Get started by exploring our features.',
    type: 'success',
    status: 'sent',
    sent_at: '2024-07-15T14:30:00Z',
    scheduled_for: '2024-07-15T14:30:00Z',
    recipient_id: 'user-101',
    recipient_email: 'john.doe@example.com',
    recipient_name: 'John Doe',
    channels: ['dashboard', 'email'],
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Upcoming Maintenance',
    message: 'We will be performing scheduled maintenance on July 20th from 10:00 PM to 2:00 AM PST.',
    type: 'warning',
    status: 'scheduled',
    sent_at: '',
    scheduled_for: '2024-07-20T22:00:00Z',
    recipient_id: 'all-users',
    recipient_email: 'all',
    recipient_name: 'All Users',
    channels: ['dashboard', 'email'],
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Account Verification Required',
    message: 'Please verify your account by clicking the link sent to your email address.',
    type: 'info',
    status: 'sent',
    sent_at: '2024-07-10T09:00:00Z',
    scheduled_for: '2024-07-10T09:00:00Z',
    recipient_id: 'user-105',
    recipient_email: 'jane.smith@example.com',
    recipient_name: 'Jane Smith',
    channels: ['dashboard', 'email'],
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Payment Failed',
    message: 'Your recent payment was declined. Please update your payment information.',
    type: 'error',
    status: 'error',
    sent_at: '2024-07-05T16:45:00Z',
    scheduled_for: '2024-07-05T16:45:00Z',
    recipient_id: 'user-110',
    recipient_email: 'mike.brown@example.com',
    recipient_name: 'Mike Brown',
    channels: ['dashboard', 'email'],
    read: false,
  },
];

const CustomerNotificationsManager = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<Omit<Notification, 'id'>>({
    title: '',
    message: '',
    type: 'info',
    status: 'draft',
    sent_at: '',
    scheduled_for: '',
    recipient_id: '',
    recipient_email: '',
    recipient_name: '',
    channels: ['dashboard'],
    read: false
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (selectedDate) {
      setNewNotification(prev => ({
        ...prev,
        scheduled_for: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  }, [selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: 'info' | 'warning' | 'success' | 'error') => {
    setNewNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (channel: 'email' | 'sms' | 'dashboard') => {
    setNewNotification(prev => {
      const isChannelSelected = prev.channels.includes(channel);
      const updatedChannels = isChannelSelected
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel];

      return {
        ...prev,
        channels: updatedChannels
      };
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewNotification(prev => ({
      ...prev,
      status: checked ? 'scheduled' : 'draft'
    }));
  };

  const resetNewNotification = () => {
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      status: 'draft',
      sent_at: '',
      scheduled_for: '',
      recipient_id: '',
      recipient_email: '',
      recipient_name: '',
      channels: ['dashboard'],
      read: false
    });
    setSelectedDate(undefined);
  };

  const addNotification = () => {
    if (!newNotification.title || !newNotification.message || !newNotification.recipient_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const notification: Notification = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      ...newNotification
    };

    setNotifications([...notifications, notification]);
    setIsDialogOpen(false);
    resetNewNotification();
    
    toast({
      title: "Notification created",
      description: "The notification has been created successfully",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Customer Notifications</span>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>Add Notification</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Recipient</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Channels</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(notification => (
                <tr key={notification.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{notification.title}</td>
                  <td className="py-2">{notification.recipient_name}</td>
                  <td className="py-2">{notification.status}</td>
                  <td className="py-2">{notification.channels.join(', ')}</td>
                  <td className="py-2">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Notification</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input type="text" id="title" name="title" value={newNotification.title} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">Message</Label>
              <Textarea id="message" name="message" value={newNotification.message} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={newNotification.type} onValueChange={(value: 'info' | 'warning' | 'success' | 'error') => handleSelectChange('type', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <div className="col-span-3 flex items-center">
                <Switch id="status" checked={newNotification.status === 'scheduled'} onCheckedChange={handleSwitchChange} />
                <span className="ml-2">{newNotification.status === 'scheduled' ? 'Scheduled' : 'Draft'}</span>
              </div>
            </div>

            {newNotification.status === 'scheduled' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scheduled_for" className="text-right">Schedule for</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? format(selectedDate, "PPP") : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient_id" className="text-right">Recipient ID</Label>
              <Input type="text" id="recipient_id" name="recipient_id" value={newNotification.recipient_id} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient_email" className="text-right">Recipient Email</Label>
              <Input type="email" id="recipient_email" name="recipient_email" value={newNotification.recipient_email} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient_name" className="text-right">Recipient Name</Label>
              <Input type="text" id="recipient_name" name="recipient_name" value={newNotification.recipient_name} onChange={handleInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Channels</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" checked={newNotification.channels.includes('email')} onCheckedChange={() => handleCheckboxChange('email')} />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms" checked={newNotification.channels.includes('sms')} onCheckedChange={() => handleCheckboxChange('sms')} />
                  <Label htmlFor="sms">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dashboard" checked={newNotification.channels.includes('dashboard')} onCheckedChange={() => handleCheckboxChange('dashboard')} />
                  <Label htmlFor="dashboard">Dashboard</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={addNotification}>Add Notification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerNotificationsManager;
