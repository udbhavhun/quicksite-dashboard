
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export interface AddOnManagerProps {
  orderId: string;
  userType: 'admin' | 'customer' | null;
}

const AddOnManager: React.FC<AddOnManagerProps> = ({ 
  orderId, 
  userType = 'customer'
}) => {
  const { toast } = useToast();
  const [addOns, setAddOns] = useState<any[]>([
    {
      id: '1',
      name: 'Additional Page',
      description: 'Add an extra page to your website with custom content.',
      price: 49.99,
      status: 'active'
    },
    {
      id: '2',
      name: 'SEO Package',
      description: 'Basic SEO optimization package for better search rankings.',
      price: 199.99,
      status: 'pending'
    }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState<any | null>(null);
  const [newAddOn, setNewAddOn] = useState({
    name: '',
    description: '',
    price: 0
  });
  
  const handleAddNew = () => {
    setEditingAddOn(null);
    setNewAddOn({
      name: '',
      description: '',
      price: 0
    });
    setDialogOpen(true);
  };
  
  const handleEdit = (addOn: any) => {
    setEditingAddOn(addOn);
    setNewAddOn({
      name: addOn.name,
      description: addOn.description,
      price: addOn.price
    });
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setAddOns(addOns.filter(addon => addon.id !== id));
    toast({
      title: "Add-on removed",
      description: "The add-on has been successfully removed.",
    });
  };
  
  const handleSave = () => {
    if (!newAddOn.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for the add-on.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingAddOn) {
      // Update existing add-on
      setAddOns(addOns.map(addon => 
        addon.id === editingAddOn.id 
          ? { ...addon, ...newAddOn } 
          : addon
      ));
      toast({
        title: "Add-on updated",
        description: "The add-on has been successfully updated.",
      });
    } else {
      // Add new add-on
      const newId = Math.random().toString(36).substring(2, 9);
      setAddOns([...addOns, {
        id: newId,
        ...newAddOn,
        status: 'pending'
      }]);
      toast({
        title: "Add-on created",
        description: "The new add-on has been successfully created.",
      });
    }
    
    setDialogOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add-on Services</CardTitle>
          {userType === 'admin' && (
            <Button size="sm" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {addOns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No add-ons have been added to this order yet.</p>
              {userType === 'admin' && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddNew}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Add-on
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {addOns.map((addon) => (
                <Card key={addon.id} className="overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{addon.name}</h3>
                      {getStatusBadge(addon.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{addon.description}</p>
                    <div className="mt-3">
                      <span className="text-lg font-semibold">${addon.price.toFixed(2)}</span>
                    </div>
                  </div>
                  {userType === 'admin' && (
                    <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(addon)}
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(addon.id)}
                      >
                        <Trash className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  )}
                  {userType === 'customer' && addon.status === 'pending' && (
                    <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({
                          title: "Request sent",
                          description: "Your request has been submitted to our team.",
                        })}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => toast({
                          title: "Add-on declined",
                          description: "You have declined this add-on service.",
                        })}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddOn ? 'Edit Add-on' : 'Add New Add-on'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newAddOn.name}
                onChange={(e) => setNewAddOn({...newAddOn, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newAddOn.description}
                onChange={(e) => setNewAddOn({...newAddOn, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                type="number"
                value={newAddOn.price}
                onChange={(e) => setNewAddOn({...newAddOn, price: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingAddOn ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddOnManager;
