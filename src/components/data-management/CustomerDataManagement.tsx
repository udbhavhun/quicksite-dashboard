
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Save, Search } from 'lucide-react';

interface CustomerData {
  id: string;
  user_id: string;
  order_id: string;
  content_type: string;
  content_key: string;
  content_value: any;
  created_at: string;
  updated_at: string;
}

interface CustomerDataManagementProps {
  selectedCustomerId?: string;
  selectedOrderId?: string;
}

const CustomerDataManagement: React.FC<CustomerDataManagementProps> = ({ 
  selectedCustomerId, 
  selectedOrderId 
}) => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CustomerData | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');

  // Fetch customer data
  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('customer_content')
        .select('*');
      
      // Apply filters based on props
      if (selectedCustomerId) {
        query = query.eq('user_id', selectedCustomerId);
      }
      
      if (selectedOrderId) {
        query = query.eq('order_id', selectedOrderId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setCustomerData(data || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch customer data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [selectedCustomerId, selectedOrderId]);

  // Filter data based on search and tab
  const filteredData = customerData.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.content_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(item.content_value).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || item.content_type === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  // Get unique content types for tabs
  const contentTypes = Array.from(new Set(customerData.map(item => item.content_type)));

  // Handle edit dialog open
  const handleEditClick = (item: CustomerData) => {
    setCurrentItem(item);
    setEditedValue(JSON.stringify(item.content_value, null, 2));
    setIsEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!currentItem) return;
    
    try {
      // Parse the JSON string back to an object
      const parsedValue = JSON.parse(editedValue);
      
      const { error } = await supabase
        .from('customer_content')
        .update({ 
          content_value: parsedValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentItem.id);
      
      if (error) throw error;
      
      // Update local state
      setCustomerData(customerData.map(item => 
        item.id === currentItem.id 
          ? { ...item, content_value: parsedValue, updated_at: new Date().toISOString() } 
          : item
      ));
      
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating customer data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update item',
        variant: 'destructive',
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from('customer_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setCustomerData(customerData.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting customer data:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Data Management</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search data..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={fetchCustomerData}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Types</TabsTrigger>
            {contentTypes.map(type => (
              <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
            ))}
          </TabsList>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Value Preview</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.content_type}</TableCell>
                      <TableCell>{item.content_key}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {typeof item.content_value === 'object'
                          ? JSON.stringify(item.content_value).substring(0, 50) + '...'
                          : String(item.content_value).substring(0, 50) + '...'}
                      </TableCell>
                      <TableCell>
                        {new Date(item.updated_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Customer Data</DialogTitle>
              <DialogDescription>
                {currentItem && (
                  <span>
                    Editing {currentItem.content_type} / {currentItem.content_key}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editValue">Content Value (JSON)</Label>
                <textarea
                  id="editValue"
                  className="flex h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomerDataManagement;
