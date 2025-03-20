
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, Building, MapPin, Save, Upload, Camera } from 'lucide-react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Profile = () => {
  const { userName, userType } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName,
    email: 'john@example.com',
    phone: '+91 98765 43210',
    company: 'Acme Inc.',
    address: '123 Main St, Bangalore',
    bio: 'I am a business owner looking to get my business online with a professional website.',
  });
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
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
                    <h1 className="text-3xl font-bold text-gradient">Profile</h1>
                  </div>
                  <p className="text-gray-600">Manage your personal information</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSave}
                        className="micro-bounce"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="micro-bounce"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="glass-card p-6 text-center">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                      <AvatarImage src="https://i.pravatar.cc/300" alt={userName} />
                      <AvatarFallback className="text-4xl">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div className="absolute bottom-0 right-0">
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-md">
                          <Camera size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-1">{profileData.name}</h2>
                  <p className="text-gray-600 mb-4">{userType === 'admin' ? 'Administrator' : 'Customer'}</p>
                  
                  <div className="text-left">
                    <div className="flex items-center text-sm mb-3">
                      <Mail size={16} className="text-gray-400 mr-3" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center text-sm mb-3">
                      <Phone size={16} className="text-gray-400 mr-3" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center text-sm mb-3">
                      <Building size={16} className="text-gray-400 mr-3" />
                      <span>{profileData.company}</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin size={16} className="text-gray-400 mr-3 mt-0.5" />
                      <span>{profileData.address}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <Input
                            value={profileData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={16} className="text-gray-400" />
                          </div>
                          <Input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={16} className="text-gray-400" />
                          </div>
                          <Input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building size={16} className="text-gray-400" />
                          </div>
                          <Input
                            value={profileData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-gray-400" />
                        </div>
                        <Textarea
                          value={profileData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          className="pl-10 min-h-[80px]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Profile;
