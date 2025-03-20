
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, MapPin, Calendar, Edit, Save, Camera, X } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const { profile, userName, updateProfile } = useUserStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || userName,
    email: profile?.email || '',
    phone: profile?.phone || '',
    company: profile?.company || '',
    address: '123 Main St, Anytown, ST 12345',
    bio: 'Web enthusiast and digital marketing specialist. Looking forward to growing my online presence with Quicksite.'
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleSave = () => {
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company
    });
    
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };
  
  const handleCancel = () => {
    setFormData({
      name: profile?.name || userName,
      email: profile?.email || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
      address: '123 Main St, Anytown, ST 12345',
      bio: 'Web enthusiast and digital marketing specialist. Looking forward to growing my online presence with Quicksite.'
    });
    setIsEditing(false);
  };
  
  const UserProfileCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold text-gradient">Profile Information</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center"
        >
          {isEditing ? (
            <X size={16} className="mr-2" />
          ) : (
            <Edit size={16} className="mr-2" />
          )}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={formData.name} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-quicksite-blue text-white p-2 rounded-full cursor-pointer">
                <Camera size={18} />
              </div>
            )}
          </div>
          
          <div className="text-center mt-4">
            <h3 className="text-xl font-semibold">{formData.name}</h3>
            <p className="text-gray-600">{profile?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
          </div>
          
          {!isEditing && (
            <div className="mt-6 w-full space-y-4">
              <div className="flex items-center">
                <Mail size={16} className="text-gray-500 mr-2" />
                <span className="text-sm">{formData.email}</span>
              </div>
              
              {formData.phone && (
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm">{formData.phone}</span>
                </div>
              )}
              
              {formData.company && (
                <div className="flex items-center">
                  <Building size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm">{formData.company}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <MapPin size={16} className="text-gray-500 mr-2" />
                <span className="text-sm">{formData.address}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <span className="text-sm">Member since October 2023</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="md:w-2/3">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Your address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">About</h3>
              <p className="text-gray-600">
                {formData.bio}
              </p>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Account Activity</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Last login</span>
                    <span className="text-sm font-medium">Today, 09:45 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active projects</span>
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Account status</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  const SecuritySection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gradient">Security Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Change Password</h3>
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
          <h3 className="text-lg font-medium mb-3">Two-Factor Authentication</h3>
          <p className="text-gray-600 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
          <Button variant="outline">Enable 2FA</Button>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-3">Login Sessions</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-600">Windows • Chrome • New York, USA</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
          <Button variant="outline" className="mt-4 text-red-600 border-red-200 hover:bg-red-50">
            Log Out All Devices
          </Button>
        </div>
      </div>
    </div>
  );
  
  const PreferencesSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gradient">Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Project Updates</p>
                <p className="text-sm text-gray-600">Receive emails about your project status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-quicksite-blue"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-600">Receive emails about new features and promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-quicksite-blue"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-3">Appearance</h3>
          <div className="grid grid-cols-3 gap-4">
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
          <h3 className="text-lg font-medium mb-3">Language</h3>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
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
              <h1 className="text-3xl font-bold text-gradient">My Profile</h1>
            </div>
            
            <Tabs defaultValue="profile" className="mb-10">
              <TabsList className="mb-6 glass-card p-1 bg-white/50">
                <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white">
                  Profile Info
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white">
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-white">
                  Preferences
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserProfileCard />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="security">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SecuritySection />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="preferences">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PreferencesSection />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Profile;
