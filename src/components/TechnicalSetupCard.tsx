
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Globe, Shield, Cpu, BarChart, Zap, ExternalLink, Edit, Save, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/components/ui/use-toast';

interface TechnicalSetupItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'inactive';
  icon: React.ReactNode;
  value?: string;
  expiryDate?: string;
}

interface TechnicalSetupCardProps {
  orderId: string;
  domainName: string;
  isSSLActive: boolean;
  diskUsage: number;
  bandwidthUsage: number;
  serverLocation: string;
  uptime: number;
}

const TechnicalSetupCard: React.FC<TechnicalSetupCardProps> = ({
  orderId,
  domainName,
  isSSLActive,
  diskUsage,
  bandwidthUsage,
  serverLocation,
  uptime
}) => {
  const { userType } = useUserStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<TechnicalSetupItem[]>([
    {
      id: 'domain',
      name: 'Domain',
      description: 'Your website address',
      status: 'active',
      icon: <Globe size={20} />,
      value: domainName
    },
    {
      id: 'ssl',
      name: 'SSL Certificate',
      description: 'Secure encrypted connection',
      status: isSSLActive ? 'active' : 'pending',
      icon: <Shield size={20} />,
      expiryDate: 'Dec 31, 2025'
    },
    {
      id: 'server',
      name: 'Server Location',
      description: 'Where your website is hosted',
      status: 'active',
      icon: <Server size={20} />,
      value: serverLocation
    }
  ]);
  
  const [editedItems, setEditedItems] = useState<TechnicalSetupItem[]>(items);
  const [editedSettings, setEditedSettings] = useState({
    diskUsage,
    bandwidthUsage,
    uptime
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setItems(editedItems);
      toast({
        title: "Changes saved",
        description: "Technical setup has been updated successfully.",
      });
    }
    setIsEditing(!isEditing);
  };
  
  const updateItem = (id: string, field: string, value: any) => {
    setEditedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const addNewItem = () => {
    const newItem: TechnicalSetupItem = {
      id: `item-${Date.now()}`,
      name: 'New Setup Item',
      description: 'Description',
      status: 'pending',
      icon: <Server size={20} />
    };
    setEditedItems([...editedItems, newItem]);
  };
  
  const removeItem = (id: string) => {
    setEditedItems(editedItems.filter(item => item.id !== id));
  };
  
  const renderItemsSection = () => {
    const itemsToRender = isEditing ? editedItems : items;
    
    return (
      <Card className="border-white/20 bg-white/40 backdrop-blur-md overflow-hidden">
        <CardContent className="pt-6">
          {itemsToRender.map(item => (
            <div key={item.id} className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                item.status === 'active' ? 'bg-quicksite-blue/10 text-quicksite-blue' : 
                item.status === 'pending' ? 'bg-quicksite-warning/10 text-quicksite-warning' : 
                'bg-gray-100 text-gray-600'
              } mr-3`}>
                {item.icon}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <>
                    <div className="flex justify-between mb-1">
                      <Input 
                        value={item.name} 
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-1/3 mr-2"
                      />
                      <select
                        value={item.status}
                        onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(item.id)} 
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <Input 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="mb-1"
                    />
                    {item.value !== undefined && (
                      <Input 
                        value={item.value} 
                        onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                        className="text-quicksite-blue"
                      />
                    )}
                    {item.expiryDate !== undefined && (
                      <Input 
                        value={item.expiryDate} 
                        onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                        className="text-xs text-gray-500"
                        placeholder="Expiry date (optional)"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <span className="status-indicator">
                        <span className={`status-dot ${
                          item.status === 'active' ? 'status-active' : 
                          item.status === 'pending' ? 'status-pending' : 
                          'status-inactive'
                        }`}></span>
                        <span className="text-xs capitalize">{item.status}</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    {item.value && <p className="text-sm font-medium text-quicksite-blue mt-1">{item.value}</p>}
                    {item.expiryDate && <p className="text-xs text-gray-500 mt-1">Valid until {item.expiryDate}</p>}
                  </>
                )}
              </div>
            </div>
          ))}
          
          {isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addNewItem} 
              className="w-full mt-2"
            >
              <Plus size={16} className="mr-2" />
              Add Technical Item
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };
  
  const renderMetricsSection = () => {
    return (
      <Card className="border-white/20 bg-white/40 backdrop-blur-md overflow-hidden">
        <CardContent className="pt-6">
          {/* Disk Usage */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center">
                <Cpu size={16} className="text-quicksite-blue mr-1.5" />
                <h4 className="text-sm font-medium">Disk Usage</h4>
              </div>
              {isEditing ? (
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={editedSettings.diskUsage} 
                  onChange={(e) => setEditedSettings({...editedSettings, diskUsage: Number(e.target.value)})}
                  className="w-20 text-xs"
                />
              ) : (
                <span className="text-xs font-medium">{diskUsage}% used</span>
              )}
            </div>
            <Progress value={isEditing ? editedSettings.diskUsage : diskUsage} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1.5">2.3 GB of 10 GB used</p>
          </div>
          
          {/* Bandwidth Usage */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center">
                <BarChart size={16} className="text-quicksite-blue mr-1.5" />
                <h4 className="text-sm font-medium">Bandwidth</h4>
              </div>
              {isEditing ? (
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={editedSettings.bandwidthUsage} 
                  onChange={(e) => setEditedSettings({...editedSettings, bandwidthUsage: Number(e.target.value)})}
                  className="w-20 text-xs"
                />
              ) : (
                <span className="text-xs font-medium">{bandwidthUsage}% used</span>
              )}
            </div>
            <Progress value={isEditing ? editedSettings.bandwidthUsage : bandwidthUsage} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1.5">7.2 GB of 100 GB used this month</p>
          </div>
          
          {/* Uptime */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center">
                <Zap size={16} className="text-quicksite-success mr-1.5" />
                <h4 className="text-sm font-medium">Uptime</h4>
              </div>
              {isEditing ? (
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="0.01"
                  value={editedSettings.uptime} 
                  onChange={(e) => setEditedSettings({...editedSettings, uptime: Number(e.target.value)})}
                  className="w-20 text-xs"
                />
              ) : (
                <span className="text-xs font-medium">{uptime}%</span>
              )}
            </div>
            <Progress value={isEditing ? editedSettings.uptime : uptime} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1.5">Last 30 days</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gradient">Technical Setup</h3>
        <div className="flex space-x-2">
          {userType === 'admin' && (
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={handleEditToggle}
              className={isEditing ? "bg-quicksite-blue text-white" : ""}
            >
              {isEditing ? (
                <>
                  <Save size={14} className="mr-1.5" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit size={14} className="mr-1.5" />
                  Edit Setup
                </>
              )}
            </Button>
          )}
          <button className="glass-button px-3 py-1.5 rounded-lg flex items-center text-sm micro-bounce">
            <ExternalLink size={14} className="mr-1.5" />
            Access Panel
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderItemsSection()}
        {renderMetricsSection()}
      </div>
      
      <div className="mt-4 text-center">
        <motion.div 
          className="inline-block"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-500">
            All systems operational. View{' '}
            <a href="#" className="text-quicksite-blue hover:underline">detailed status</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TechnicalSetupCard;
