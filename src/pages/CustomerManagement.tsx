
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Edit, Ban, CheckCircle } from 'lucide-react';
import EditableItem from '@/components/EditableItem';

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  is_blocked?: boolean;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer');
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      console.error('Error fetching customers:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch customers data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCustomer = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newCustomer.email,
        password: newCustomer.password,
        options: {
          data: {
            name: newCustomer.name,
            role: 'customer'
          }
        }
      });
      
      if (authError) throw authError;
      
      toast({
        title: 'Success',
        description: `Customer ${newCustomer.name} has been added successfully.`,
      });
      
      setNewCustomer({ name: '', email: '', password: '' });
      setIsAddDialogOpen(false);
      
      fetchCustomers();
    } catch (error: any) {
      console.error('Error adding customer:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add customer.',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateCustomer = async (updatedCustomer: Record<string, any>) => {
    if (!selectedCustomer) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCustomer.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Customer updated successfully.',
      });
      
      setCustomers(prevCustomers => 
        prevCustomers.map(c => 
          c.id === selectedCustomer.id 
            ? { ...c, ...updatedCustomer } 
            : c
        )
      );
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating customer:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update customer.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(selectedCustomer.id);
      
      if (error) {
        console.error('Error deleting user:', error);
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', selectedCustomer.id);
          
        if (profileError) throw profileError;
      }
      
      toast({
        title: 'Success',
        description: 'Customer deleted successfully.',
      });
      
      setCustomers(prevCustomers => 
        prevCustomers.filter(c => c.id !== selectedCustomer.id)
      );
      
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Error deleting customer:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Admin privileges required.',
        variant: 'destructive',
      });
    }
  };
  
  const handleToggleBlock = async (customer: Customer) => {
    try {
      const isBlocked = !!customer.is_blocked;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          is_blocked: !isBlocked,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Customer ${isBlocked ? 'unblocked' : 'blocked'} successfully.`,
      });
      
      setCustomers(prevCustomers => 
        prevCustomers.map(c => 
          c.id === customer.id 
            ? { ...c, is_blocked: !isBlocked } 
            : c
        )
      );
    } catch (error: any) {
      console.error('Error toggling block status:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update customer status.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col w-full group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-grow p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Customer Management</h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-quicksite-blue hover:bg-quicksite-dark-blue">
                    <UserPlus size={16} className="mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input 
                        value={newCustomer.name} 
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} 
                        placeholder="Customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        type="email"
                        value={newCustomer.email} 
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} 
                        placeholder="customer@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <Input 
                        type="password"
                        value={newCustomer.password} 
                        onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})} 
                        placeholder="Password"
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500">Password must be at least 6 characters long.</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={handleAddCustomer}
                      disabled={!newCustomer.name || !newCustomer.email || !newCustomer.password || newCustomer.password.length < 6}
                    >
                      Add Customer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="w-6 h-6 border-2 border-quicksite-blue border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No customers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((customer, index) => (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b"
                        >
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              customer.is_blocked 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {customer.is_blocked ? 'Blocked' : 'Active'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(customer.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleBlock(customer)}
                              className={customer.is_blocked ? 'text-green-600' : 'text-red-600'}
                            >
                              {customer.is_blocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <EditableItem
              item={selectedCustomer}
              fields={[
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'text' },
                { name: 'phone', label: 'Phone', type: 'text' }
              ]}
              onSave={handleUpdateCustomer}
              onChange={() => {}}
              entityType="customer"
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Customer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the following customer?</p>
            <p className="font-medium mt-2">{selectedCustomer?.name} ({selectedCustomer?.email})</p>
            <p className="text-sm text-red-600 mt-4">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
