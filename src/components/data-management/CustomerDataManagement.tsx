
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCustomerData, CustomerDataEntry } from '@/hooks/use-customer-data';
import { useUserStore } from '@/stores/userStore';
import { ORDERS } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Edit, Save, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface CustomerDataManagementProps {
  selectedCustomerId?: string;
  selectedOrderId?: string;
}

interface CustomerDataFormValues {
  contentType: string;
  contentKey: string;
  contentValue: string;
}

const CustomerDataManagement: React.FC<CustomerDataManagementProps> = ({
  selectedCustomerId,
  selectedOrderId,
}) => {
  const [isNewDataDialogOpen, setIsNewDataDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<CustomerDataEntry | null>(null);
  const [filteredOrderId, setFilteredOrderId] = useState<string | undefined>(selectedOrderId);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('');
  
  const { profile } = useUserStore();
  const {
    data: customerData,
    isLoading,
    error,
    refetch,
    createData,
    updateData,
    deleteData,
  } = useCustomerData({
    orderId: filteredOrderId,
    contentType: contentTypeFilter !== '' ? contentTypeFilter : undefined
  });

  // Reset filter when selected order changes
  useEffect(() => {
    setFilteredOrderId(selectedOrderId);
  }, [selectedOrderId]);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CustomerDataFormValues>();

  const contentTypes = [
    { value: 'faq', label: 'FAQ' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'contact', label: 'Contact Information' },
    { value: 'requirements', label: 'Project Requirements' },
    { value: 'timeline', label: 'Project Timeline' },
    { value: 'hosting', label: 'Hosting Information' },
    { value: 'domain', label: 'Domain Information' }
  ];

  const createNewData = async (data: CustomerDataFormValues) => {
    if (!profile) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create data',
        variant: 'destructive',
      });
      return;
    }

    const parsedValue = (() => {
      try {
        return JSON.parse(data.contentValue);
      } catch (e) {
        // If not valid JSON, treat as string
        return data.contentValue;
      }
    })();

    await createData({
      user_id: selectedCustomerId || profile.id,
      order_id: filteredOrderId || '00000000-0000-0000-0000-000000000000', // Use a default UUID if none is selected
      content_type: data.contentType,
      content_key: data.contentKey,
      content_value: parsedValue
    });

    setIsNewDataDialogOpen(false);
    reset();
    refetch();
  };

  const handleEditData = (item: CustomerDataEntry) => {
    setEditingData(item);
    setValue('contentType', item.content_type);
    setValue('contentKey', item.content_key);
    setValue('contentValue', JSON.stringify(item.content_value, null, 2));
  };

  const handleUpdateData = async (data: CustomerDataFormValues) => {
    if (!editingData) return;

    const parsedValue = (() => {
      try {
        return JSON.parse(data.contentValue);
      } catch (e) {
        // If not valid JSON, treat as string
        return data.contentValue;
      }
    })();

    await updateData(editingData.id, parsedValue);
    setEditingData(null);
    reset();
    refetch();
  };

  const handleDeleteData = async (id: string) => {
    if (confirm('Are you sure you want to delete this data? This action cannot be undone.')) {
      await deleteData(id);
      refetch();
    }
  };

  // Get available orders for filtering
  const availableOrders = ORDERS.filter(order => 
    profile?.role === 'admin' || order.customer.email === profile?.email
  );

  const handleOpenNewDataDialog = () => {
    reset();
    setIsNewDataDialogOpen(true);
  };

  const renderContentValue = (value: any): string => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Data Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="orderFilter">Filter by Order</Label>
            <Select 
              value={filteredOrderId || ''} 
              onValueChange={(value) => setFilteredOrderId(value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Orders</SelectItem>
                {availableOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.package.name} - {order.customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="contentTypeFilter">Filter by Content Type</Label>
            <Select 
              value={contentTypeFilter} 
              onValueChange={setContentTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Add new data button */}
        <div className="flex justify-end mb-4">
          <Button onClick={handleOpenNewDataDialog}>
            <Plus size={16} className="mr-2" />
            Add New Data
          </Button>
        </div>

        {/* Data list */}
        {isLoading ? (
          <p>Loading customer data...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : customerData.length === 0 ? (
          <p>No customer data found. Use the button above to add data.</p>
        ) : (
          <div className="space-y-4">
            {customerData.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">
                      {contentTypes.find(t => t.value === item.content_type)?.label || item.content_type}: {item.content_key}
                    </h3>
                    <p className="text-sm text-gray-500">Order ID: {item.order_id}</p>
                    <pre className="mt-2 p-2 bg-gray-50 rounded text-sm overflow-auto max-h-40">
                      {renderContentValue(item.content_value)}
                    </pre>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditData(item)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteData(item.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* New Data Dialog */}
        <Dialog open={isNewDataDialogOpen} onOpenChange={setIsNewDataDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer Data</DialogTitle>
              <DialogDescription>
                Create new customer data entry for the selected order.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(createNewData)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select 
                    {...register('contentType', { required: true })}
                    onValueChange={(value) => setValue('contentType', value)}
                    defaultValue=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.contentType && <p className="text-red-500 text-sm">Content type is required</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contentKey">Content Key</Label>
                  <Input 
                    id="contentKey"
                    {...register('contentKey', { required: true })}
                    placeholder="Enter a unique identifier (e.g., 'primary-contact')"
                  />
                  {errors.contentKey && <p className="text-red-500 text-sm">Content key is required</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contentValue">Content Value (JSON or String)</Label>
                  <Textarea 
                    id="contentValue"
                    {...register('contentValue', { required: true })}
                    placeholder='{"value": "Sample data"} or plain text'
                    rows={5}
                  />
                  {errors.contentValue && <p className="text-red-500 text-sm">Content value is required</p>}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Data Dialog */}
        <Dialog open={!!editingData} onOpenChange={(open) => !open && setEditingData(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer Data</DialogTitle>
              <DialogDescription>
                Update this customer data entry.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleUpdateData)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select 
                    {...register('contentType', { required: true })}
                    onValueChange={(value) => setValue('contentType', value)}
                    defaultValue={editingData?.content_type || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contentKey">Content Key</Label>
                  <Input 
                    id="contentKey"
                    {...register('contentKey', { required: true })}
                    defaultValue={editingData?.content_key || ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contentValue">Content Value (JSON or String)</Label>
                  <Textarea 
                    id="contentValue"
                    {...register('contentValue', { required: true })}
                    defaultValue={editingData ? renderContentValue(editingData.content_value) : ''}
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingData(null)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomerDataManagement;
