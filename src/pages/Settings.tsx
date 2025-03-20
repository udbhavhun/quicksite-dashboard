
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import SupabaseIntegrationGuide from '@/components/SupabaseIntegrationGuide';
import { useUserStore } from '@/stores/userStore';
import { Bell, Globe, Lock, Database, Palette, Volume2, CreditCard, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { userType } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  const saveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
    }, 1000);
  };
  
  const NotificationSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-quicksite-blue/10 rounded-lg flex items-center justify-center mr-3">
          <Bell className="text-quicksite-blue" />
        </div>
        <h2 className="text-2xl font-semibold text-gradient">Notification Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Project Updates</p>
              <p className="text-sm text-gray-600">Receive email notifications when your project status changes</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Comment Notifications</p>
              <p className="text-sm text-gray-600">Receive email notifications when someone comments on your project</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-gray-600">Receive emails about new features, tips, and promotions</p>
            </div>
            <Switch />
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Project Milestones</p>
              <p className="text-sm text-gray-600">Get notified when your project reaches a milestone</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Chat Messages</p>
              <p className="text-sm text-gray-600">Get notified when you receive a new message</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-gray-600">Get notified when your order status changes</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
      
      <Button className="mt-6" onClick={saveSettings} disabled={loading}>
        {loading ? 'Saving...' : 'Save Notification Settings'}
      </Button>
    </div>
  );
  
  const AccountSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-quicksite-blue/10 rounded-lg flex items-center justify-center mr-3">
          <Lock className="text-quicksite-blue" />
        </div>
        <h2 className="text-2xl font-semibold text-gradient">Account Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Email Address</h3>
          <div className="flex space-x-3">
            <Input defaultValue="user@example.com" className="flex-1" />
            <Button variant="outline">Verify</Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">This email will be used for account notifications and password resets.</p>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Password</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <Input type="password" placeholder="Enter your current password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <Button className="mt-4">Update Password</Button>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Account Deactivation</h3>
          <p className="text-sm text-gray-600 mb-4">Deactivating your account will remove your access to the dashboard. Your data will be retained for 30 days, after which it will be permanently deleted.</p>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Deactivate Account
          </Button>
        </div>
      </div>
    </div>
  );
  
  const AppearanceSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-quicksite-blue/10 rounded-lg flex items-center justify-center mr-3">
          <Palette className="text-quicksite-blue" />
        </div>
        <h2 className="text-2xl font-semibold text-gradient">Appearance Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center cursor-pointer bg-gray-50">
              <div className="w-full h-24 rounded bg-white border border-gray-200 mb-2"></div>
              <p className="text-sm font-medium">Light</p>
            </div>
            <div className="border rounded-lg p-4 text-center cursor-pointer">
              <div className="w-full h-24 rounded bg-gray-800 border border-gray-700 mb-2"></div>
              <p className="text-sm font-medium">Dark</p>
            </div>
            <div className="border rounded-lg p-4 text-center cursor-pointer">
              <div className="w-full h-24 rounded bg-gradient-to-b from-white to-gray-800 border border-gray-200 mb-2"></div>
              <p className="text-sm font-medium">System</p>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Dashboard Layout</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 text-center cursor-pointer bg-gray-50">
              <div className="w-full h-24 rounded bg-white border border-gray-200 mb-2 flex">
                <div className="h-full w-1/4 bg-gray-200"></div>
                <div className="h-full w-3/4 p-1">
                  <div className="h-1/3 w-full bg-gray-100 mb-1"></div>
                  <div className="h-2/3 w-full bg-gray-100"></div>
                </div>
              </div>
              <p className="text-sm font-medium">Sidebar Layout</p>
            </div>
            <div className="border rounded-lg p-4 text-center cursor-pointer">
              <div className="w-full h-24 rounded bg-white border border-gray-200 mb-2 flex flex-col">
                <div className="h-1/4 w-full bg-gray-200"></div>
                <div className="h-3/4 w-full p-1">
                  <div className="h-full w-full bg-gray-100"></div>
                </div>
              </div>
              <p className="text-sm font-medium">Top Nav Layout</p>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Animations</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Animations</p>
              <p className="text-sm text-gray-600">Toggle UI animations on and off</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
      
      <Button className="mt-6" onClick={saveSettings} disabled={loading}>
        {loading ? 'Saving...' : 'Save Appearance Settings'}
      </Button>
    </div>
  );
  
  const AdministrationSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-quicksite-blue/10 rounded-lg flex items-center justify-center mr-3">
          <SettingsIcon className="text-quicksite-blue" />
        </div>
        <h2 className="text-2xl font-semibold text-gradient">Administration Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">User Management</h3>
          <Button variant="outline">Manage Users</Button>
          <p className="text-sm text-gray-600 mt-2">Add, remove, or modify user accounts and permissions.</p>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Company Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <Input defaultValue="Quicksite Agency" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <Input defaultValue="support@quicksite.example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input defaultValue="+1 (555) 123-4567" />
            </div>
          </div>
          <Button className="mt-4">Update Company Info</Button>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">System Logs</h3>
          <Button variant="outline">View System Logs</Button>
          <p className="text-sm text-gray-600 mt-2">Track system activity and troubleshoot issues.</p>
        </div>
      </div>
    </div>
  );
  
  const IntegrationSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-quicksite-blue/10 rounded-lg flex items-center justify-center mr-3">
            <Database className="text-quicksite-blue" />
          </div>
          <h2 className="text-2xl font-semibold text-gradient">Integration Settings</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Connected Services</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <img src="https://supabase.com/favicon.ico" alt="Supabase" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Supabase</p>
                    <p className="text-sm text-gray-600">Database and Authentication</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <img src="https://stripe.com/favicon.ico" alt="Stripe" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-gray-600">Payment Processing</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <img src="https://www.google.com/favicon.ico" alt="Google Analytics" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Google Analytics</p>
                    <p className="text-sm text-gray-600">Website Analytics</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium mb-4">API Keys</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Public API Key</label>
                <div className="flex">
                  <Input defaultValue="pk_test_51HxHq..." type="password" className="flex-1" />
                  <Button variant="outline" className="ml-2">Show</Button>
                  <Button variant="outline" className="ml-2">Copy</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret API Key</label>
                <div className="flex">
                  <Input defaultValue="sk_test_51HxHq..." type="password" className="flex-1" />
                  <Button variant="outline" className="ml-2">Show</Button>
                  <Button variant="outline" className="ml-2">Copy</Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">Never share your secret API key. It provides full access to your account.</p>
              </div>
            </div>
            <Button className="mt-4">Generate New API Keys</Button>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium mb-4">Webhooks</h3>
            <p className="text-sm text-gray-600 mb-4">Configure endpoints to receive real-time updates about events in your account.</p>
            <Button variant="outline">Configure Webhooks</Button>
          </div>
        </div>
      </div>
      
      <SupabaseIntegrationGuide />
    </div>
  );
  
  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="mr-2 sm:hidden" />
              <h1 className="text-3xl font-bold text-gradient">Settings</h1>
            </div>
            
            <Tabs defaultValue="notifications" className="mb-10">
              <TabsList className="mb-6 glass-card p-1 bg-white/50 overflow-x-auto flex whitespace-nowrap">
                <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <Lock size={16} className="mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <Palette size={16} className="mr-2" />
                  Appearance
                </TabsTrigger>
                {userType === 'admin' && (
                  <TabsTrigger value="administration" className="rounded-lg data-[state=active]:bg-white flex items-center">
                    <SettingsIcon size={16} className="mr-2" />
                    Administration
                  </TabsTrigger>
                )}
                <TabsTrigger value="integrations" className="rounded-lg data-[state=active]:bg-white flex items-center">
                  <Database size={16} className="mr-2" />
                  Integrations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="notifications">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificationSection />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="account">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AccountSection />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="appearance">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AppearanceSection />
                </motion.div>
              </TabsContent>
              
              {userType === 'admin' && (
                <TabsContent value="administration">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AdministrationSection />
                  </motion.div>
                </TabsContent>
              )}
              
              <TabsContent value="integrations">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IntegrationSection />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Settings;
