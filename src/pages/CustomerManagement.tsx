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
import { UserPlus, Trash2, Edit, Ban, CheckCircle, FileText as FileIcon, CreditCard, ExternalLink } from 'lucide-react';
import EditableItem from '@/components/EditableItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStore } from '@/stores/userStore';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/data/types';
import { ORDERS } from '@/lib/data';

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  is_blocked?: boolean;
  company?: string;
  phone?: string;
  status?: string;
}

interface CustomerActivity {
  id: string;
  customer_id: string;
  action: string;
  details: string;
  timestamp: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    phone: '',
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('profiles');
  const { profile } = useUserStore();
  
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

  const fetchCustomerOrders = (customerId: string) => {
    const filteredOrders = ORDERS.filter(order => order.customer.id === customerId);
    setCustomerOrders(filteredOrders);
  };
  
  const handleAddCustomer = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newCustomer.email,
        password: newCustomer.password,
        options: {
          data: {
            name: newCustomer.name,
            role: 'customer',
            company: newCustomer.company,
            phone: newCustomer.phone
          }
        }
      });
      
      if (authError) throw authError;
      
      toast({
        title: 'Success',
        description: `Customer ${newCustomer.name} has been added successfully.`,
      });
      
      setNewCustomer({ 
        name: '', 
        email: '', 
        password: '', 
        company: '', 
        phone: '' 
      });
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
          company: updatedCustomer.company,
          phone: updatedCustomer.phone,
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

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.id);
    setActiveTab('overview');
  };

  const getStatusBadgeVariant = (status: string | undefined): "default" | "destructive" | "outline" | "secondary" => {
    if (!status) return "secondary";
    
    switch(status.toLowerCase()) {
      case 'active':
        return "default";
      case 'inactive':
        return "secondary";
      case 'suspended':
        return "destructive";
      case 'pending':
        return "outline";
      default:
        return "secondary";
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <Input 
                        value={newCustomer.company} 
                        onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})} 
                        placeholder="Company name (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input 
                        value={newCustomer.phone} 
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} 
                        placeholder="Phone number (optional)"
                      />
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
            
            {selectedCustomer ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedCustomer(null)}
                    >
                      Back to All Customers
                    </Button>
                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                    <Badge variant={selectedCustomer.is_blocked ? "destructive" : "default"}>
                      {selectedCustomer.is_blocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant={selectedCustomer.is_blocked ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleToggleBlock(selectedCustomer)}
                      className={selectedCustomer.is_blocked ? "bg-green-600 hover:bg-green-700" : "text-red-600 hover:text-red-700"}
                    >
                      {selectedCustomer.is_blocked ? 
                        <><CheckCircle size={16} className="mr-2" />Unblock</> : 
                        <><Ban size={16} className="mr-2" />Block</>
                      }
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="mt-1">{selectedCustomer.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Company</h3>
                            <p className="mt-1">{selectedCustomer.company || 'Not specified'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1">{selectedCustomer.phone || 'Not specified'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                            <p className="mt-1">{new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Orders</h3>
                          {customerOrders.length === 0 ? (
                            <p className="text-gray-500">No orders found for this customer.</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Package</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {customerOrders.slice(0, 3).map((order) => (
                                    <TableRow key={order.id}>
                                      <TableCell>{order.id}</TableCell>
                                      <TableCell>{order.package.name}</TableCell>
                                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                      <TableCell>
                                        <Badge variant={
                                          order.paymentStatus === 'paid' ? 'default' : 
                                          order.paymentStatus === 'pending' ? 'secondary' : 'destructive'
                                        }>
                                          {order.paymentStatus}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                                      <TableCell>
                                        <Button variant="ghost" size="sm">
                                          <ExternalLink size={16} />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                          {customerOrders.length > 3 && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setActiveTab('orders')}
                            >
                              View all orders
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {customerOrders.length === 0 ? (
                          <p className="text-gray-500">No orders found for this customer.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Order ID</TableHead>
                                  <TableHead>Package</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Payment</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {customerOrders.map((order) => (
                                  <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.package.name}</TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        order.status.color === 'success' ? 'default' : 
                                        order.status.color === 'warning' ? 'secondary' : 
                                        order.status.color === 'error' ? 'destructive' : 'secondary'
                                      }>
                                        {order.status.label}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        order.paymentStatus === 'paid' ? 'default' : 
                                        order.paymentStatus === 'pending' ? 'secondary' : 'destructive'
                                      }>
                                        {order.paymentStatus}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                      <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" title="View Details">
                                          <FileIcon size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Manage Payment">
                                          <CreditCard size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Edit">
                                          <Edit size={16} />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-b pb-4">
                            <div className="flex justify-between">
                              <span className="font-medium">Logged in</span>
                              <span className="text-gray-500 text-sm">{new Date().toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Customer logged in from Chrome on Windows.</p>
                          </div>
                          <div className="border-b pb-4">
                            <div className="flex justify-between">
                              <span className="font-medium">Updated profile</span>
                              <span className="text-gray-500 text-sm">{new Date(Date.now() - 86400000).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Customer updated their profile information.</p>
                          </div>
                          <div className="border-b pb-4">
                            <div className="flex justify-between">
                              <span className="font-medium">Placed order</span>
                              <span className="text-gray-500 text-sm">{new Date(Date.now() - 172800000).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Customer placed a new order (#ORD-12345).</p>
                          </div>
                          <p className="text-center text-gray-500 text-sm">
                            Activity log is for demonstration purposes only.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex justify-center">
                                <div className="w-6 h-6 border-2 border-quicksite-blue border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredCustomers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              No customers found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCustomers.map((customer, index) => (
                            <motion.tr
                              key={customer.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b cursor-pointer hover:bg-gray-50"
                              onClick={() => handleViewCustomerDetails(customer)}
                            >
                              <TableCell className="font-medium">{customer.name}</TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>{customer.company || 'N/A'}</TableCell>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(customer);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleBlock(customer);
                                  }}
                                  className={customer.is_blocked ? 'text-green-600' : 'text-red-600'}
                                >
                                  {customer.is_blocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
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
              </>
            )}
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
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'text', required: true },
                { name: 'company', label: 'Company', type: 'text' },
                { name: 'phone', label: 'Phone', type: 'text' }
              ]}
              onSave={handleUpdateCustomer}
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

