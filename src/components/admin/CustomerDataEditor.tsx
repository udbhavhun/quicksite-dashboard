
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomerData } from '@/hooks/use-customer-data';
import { useUserStore } from '@/stores/userStore';
import { Plus, Save, Trash } from 'lucide-react';

interface CustomerDataEditorProps {
  orderId?: string;
  customerId?: string;
}

const CustomerDataEditor: React.FC<CustomerDataEditorProps> = ({ orderId, customerId }) => {
  const { profile } = useUserStore();
  const isAdmin = profile?.role === 'admin';
  
  // States for managing the editor
  const [activeTab, setActiveTab] = useState('faqs');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form data for new items
  const [newItemType, setNewItemType] = useState('faq');
  const [newItemKey, setNewItemKey] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  
  // Use the customer data hook
  const {
    data: customerData,
    isLoading,
    error,
    createData,
    updateData,
    deleteData,
    refetch
  } = useCustomerData({ orderId });
  
  // Get data filtered by content type
  const getFaqs = () => customerData.filter(item => item.content_type === 'faq');
  const getDocs = () => customerData.filter(item => item.content_type === 'documentation');
  const getVideos = () => customerData.filter(item => item.content_type === 'video');
  const getContactInfo = () => customerData.filter(item => item.content_type === 'contact');
  const getSettings = () => customerData.filter(item => item.content_type === 'setting');
  
  // Handle adding a new item
  const handleAddItem = async () => {
    if (!newItemKey || !newItemValue || !newItemType || !orderId || !profile?.id) {
      return;
    }
    
    let contentValue;
    try {
      // Try to parse as JSON if possible
      contentValue = JSON.parse(newItemValue);
    } catch (e) {
      // If not valid JSON, use as string
      contentValue = newItemValue;
    }
    
    const success = await createData({
      user_id: customerId || profile.id,
      order_id: orderId,
      content_type: newItemType,
      content_key: newItemKey,
      content_value: contentValue
    });
    
    if (success) {
      // Reset form and close dialog
      setNewItemType('faq');
      setNewItemKey('');
      setNewItemValue('');
      setIsAddDialogOpen(false);
      
      // Refetch data
      refetch();
    }
  };
  
  // Handle deleting an item
  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteData(id);
    }
  };
  
  // Render content based on data type
  const renderItems = (items: typeof customerData, type: string) => {
    if (isLoading) {
      return <p>Loading...</p>;
    }
    
    if (items.length === 0) {
      return <p>No {type} items found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {items.map(item => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{item.content_key}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(item.content_value, null, 2)}
              </pre>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(item.updated_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Customer Data Editor</CardTitle>
        <CardDescription>
          {orderId 
            ? `Edit data for order ${orderId}` 
            : 'Select an order to edit its data'}
        </CardDescription>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {isLoading ? 'Loading data...' : `${customerData.length} item(s) found`}
          </div>
          {orderId && (
            <Button 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
              disabled={!orderId || (!isAdmin && !customerId)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!orderId ? (
          <div className="text-center p-8 text-gray-500">
            Please select an order to manage its data
          </div>
        ) : (
          <Tabs defaultValue="faqs" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="contacts">Contact Info</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faqs">
              {renderItems(getFaqs(), 'FAQ')}
            </TabsContent>
            
            <TabsContent value="docs">
              {renderItems(getDocs(), 'documentation')}
            </TabsContent>
            
            <TabsContent value="videos">
              {renderItems(getVideos(), 'video')}
            </TabsContent>
            
            <TabsContent value="contacts">
              {renderItems(getContactInfo(), 'contact')}
            </TabsContent>
            
            <TabsContent value="settings">
              {renderItems(getSettings(), 'setting')}
            </TabsContent>
          </Tabs>
        )}
        
        {/* Dialog for adding new items */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Add a new data item for this order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="itemType">Item Type</Label>
                <Select
                  value={newItemType}
                  onValueChange={setNewItemType}
                >
                  <SelectTrigger id="itemType">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faq">FAQ</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="contact">Contact Info</SelectItem>
                    <SelectItem value="setting">Setting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="itemKey">Item Key</Label>
                <Input
                  id="itemKey"
                  placeholder="Enter a unique key"
                  value={newItemKey}
                  onChange={(e) => setNewItemKey(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="itemValue">Item Value (JSON)</Label>
                <textarea
                  id="itemValue"
                  placeholder='{"property": "value"}'
                  className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                <Save className="h-4 w-4 mr-2" />
                Save Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomerDataEditor;
