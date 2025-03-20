
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Moon, Palette, Save } from 'lucide-react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Settings = () => {
  const { userName } = useUserStore();
  const [activeTab, setActiveTab] = useState('account');
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    updates: true,
    newsletter: false
  });
  
  const [privacy, setPrivacy] = useState({
    twoFactor: false,
    sessions: true,
    activityLog: true,
    dataSharing: false
  });
  
  const [appearance, setAppearance] = useState({
    darkMode: false,
    reducedMotion: false,
    colorScheme: 'blue',
    compactMode: false
  });
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Settings updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Privacy settings updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleAppearanceChange = (key: string, value: any) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Appearance updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()} ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'updated'}.`,
    });
  };
  
  return (
    <div className="min-h-screen w-full flex">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header userName={userName} />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-2 sm:hidden" />
                    <h1 className="text-3xl font-bold text-gradient">Settings</h1>
                  </div>
                  <p className="text-gray-600">Customize your experience</p>
                </div>
              </div>
            </motion.div>
            
            <div className="glass-card p-6">
              <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full mb-6">
                  <TabsTrigger value="account" className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span className="hidden sm:inline">Account</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center">
                    <Bell size={16} className="mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center">
                    <Shield size={16} className="mr-2" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center">
                    <Palette size={16} className="mr-2" />
                    <span className="hidden sm:inline">Appearance</span>
                  </TabsTrigger>
                </TabsList>
                
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="account" className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Account Type</h3>
                        <p className="text-sm text-gray-600">Your current plan</p>
                      </div>
                      <div className="badge-blue">Free</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Language</h3>
                        <p className="text-sm text-gray-600">Set your preferred language</p>
                      </div>
                      <select className="rounded-md border border-gray-300 p-2 text-sm">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Timezone</h3>
                        <p className="text-sm text-gray-600">Set your timezone for accurate scheduling</p>
                      </div>
                      <select className="rounded-md border border-gray-300 p-2 text-sm">
                        <option value="UTC+0">UTC+0 (London)</option>
                        <option value="UTC+5:30">UTC+5:30 (India)</option>
                        <option value="UTC-8">UTC-8 (Los Angeles)</option>
                        <option value="UTC-5">UTC-5 (New York)</option>
                        <option value="UTC+9">UTC+9 (Tokyo)</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-red-600">Delete Account</h3>
                        <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" size="sm">Delete Account</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={(value) => handleNotificationChange('email', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications in-app</p>
                      </div>
                      <Switch 
                        checked={notifications.push} 
                        onCheckedChange={(value) => handleNotificationChange('push', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive urgent updates via SMS</p>
                      </div>
                      <Switch 
                        checked={notifications.sms} 
                        onCheckedChange={(value) => handleNotificationChange('sms', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Product Updates</h3>
                        <p className="text-sm text-gray-600">Receive information about new features</p>
                      </div>
                      <Switch 
                        checked={notifications.updates} 
                        onCheckedChange={(value) => handleNotificationChange('updates', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Newsletter</h3>
                        <p className="text-sm text-gray-600">Subscribe to our monthly newsletter</p>
                      </div>
                      <Switch 
                        checked={notifications.newsletter} 
                        onCheckedChange={(value) => handleNotificationChange('newsletter', value)} 
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="privacy" className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Switch 
                        checked={privacy.twoFactor} 
                        onCheckedChange={(value) => handlePrivacyChange('twoFactor', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Active Sessions</h3>
                        <p className="text-sm text-gray-600">Monitor devices logged into your account</p>
                      </div>
                      <Button variant="outline" size="sm">View Sessions</Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Activity Log</h3>
                        <p className="text-sm text-gray-600">Track account activity</p>
                      </div>
                      <Switch 
                        checked={privacy.activityLog} 
                        onCheckedChange={(value) => handlePrivacyChange('activityLog', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Data Sharing</h3>
                        <p className="text-sm text-gray-600">Allow anonymous usage data collection</p>
                      </div>
                      <Switch 
                        checked={privacy.dataSharing} 
                        onCheckedChange={(value) => handlePrivacyChange('dataSharing', value)} 
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-gray-600">Toggle dark theme</p>
                      </div>
                      <Switch 
                        checked={appearance.darkMode} 
                        onCheckedChange={(value) => handleAppearanceChange('darkMode', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Reduced Motion</h3>
                        <p className="text-sm text-gray-600">Minimize animations</p>
                      </div>
                      <Switch 
                        checked={appearance.reducedMotion} 
                        onCheckedChange={(value) => handleAppearanceChange('reducedMotion', value)} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Color Scheme</h3>
                        <p className="text-sm text-gray-600">Choose your preferred color</p>
                      </div>
                      <select 
                        className="rounded-md border border-gray-300 p-2 text-sm"
                        value={appearance.colorScheme}
                        onChange={(e) => handleAppearanceChange('colorScheme', e.target.value)}
                      >
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Compact Mode</h3>
                        <p className="text-sm text-gray-600">Reduce spacing in the interface</p>
                      </div>
                      <Switch 
                        checked={appearance.compactMode} 
                        onCheckedChange={(value) => handleAppearanceChange('compactMode', value)} 
                      />
                    </div>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Settings;
