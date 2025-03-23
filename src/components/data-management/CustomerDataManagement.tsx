
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CustomerDataEntry } from '@/hooks/use-customer-data';
import { Search, Edit, Check, X, Trash, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface CustomerDataManagementProps {
  data: CustomerDataEntry[];
  updateData: (id: string, newValue: any) => Promise<boolean>;
  createData: (newData: Omit<CustomerDataEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  deleteData: (id: string) => Promise<boolean>;
  selectedOrderId?: string;
  selectedCustomerId?: string;
}

const CustomerDataManagement: React.FC<CustomerDataManagementProps> = ({
  data,
  updateData,
  createData,
  deleteData,
  selectedOrderId,
  selectedCustomerId
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newContentType, setNewContentType] = useState('');
  const [newContentKey, setNewContentKey] = useState('');
  const [newContentValue, setNewContentValue] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleEdit = (id: string, value: any) => {
    setIsEditing(id);
    setEditedValue(String(value));
  };
  
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedValue('');
  };
  
  const handleSaveEdit = async (id: string) => {
    const success = await updateData(id, editedValue);
    if (success) {
      setIsEditing(null);
      setEditedValue('');
    }
  };
  
  const handleDelete = async (id: string) => {
    const success = await deleteData(id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Data deleted successfully',
      });
    }
  };
  
  const handleCreate = async () => {
    if (!newContentType || !newContentKey || !newContentValue || !selectedOrderId) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    const newData = {
      user_id: selectedCustomerId || '', 
      order_id: selectedOrderId,
      content_type: newContentType,
      content_key: newContentKey,
      content_value: newContentValue,
    };
    
    const success = await createData(newData);
    
    if (success) {
      setIsCreating(false);
      setNewContentType('');
      setNewContentKey('');
      setNewContentValue('');
    }
  };
  
  const filteredData = data.filter(item =>
    item.content_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(item.content_value).toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Customer Data Management</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search data..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No data found. Please add some data or adjust your search query.
                  </td>
                </tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.content_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.content_key}</td>
                    <td className="px-6 py-4">
                      {isEditing === item.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="text"
                            value={editedValue}
                            onChange={e => setEditedValue(e.target.value)}
                          />
                          <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        String(item.content_value)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isEditing === item.id ? null : (
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item.id, item.content_value)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {isCreating && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Content Type</label>
                <Input
                  type="text"
                  value={newContentType}
                  onChange={e => setNewContentType(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content Key</label>
                <Input
                  type="text"
                  value={newContentKey}
                  onChange={e => setNewContentKey(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content Value</label>
                <Input
                  type="text"
                  value={newContentValue}
                  onChange={e => setNewContentValue(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerDataManagement;
