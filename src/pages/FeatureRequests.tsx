
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/userStore';
import { ORDERS } from '@/lib/data';
import {
  Search,
  Lightbulb,
  Plus,
  Filter,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  ArrowUpDown
} from 'lucide-react';

// Define types
interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  submittedBy: {
    id: string;
    name: string;
  };
  orderId?: string;
  dateSubmitted: string;
  dateUpdated?: string;
  adminNotes?: string;
  estimatedDelivery?: string;
}

// Mock data
const initialFeatureRequests: FeatureRequest[] = [
  {
    id: 'fr-001',
    title: 'Add a blog section to the website',
    description: 'I would like to have a blog section where I can post updates about my business.',
    category: 'content',
    status: 'approved',
    priority: 'medium',
    submittedBy: {
      id: 'user-1',
      name: 'John Doe'
    },
    orderId: 'ORD-2023-001',
    dateSubmitted: '2023-11-20',
    dateUpdated: '2023-11-25',
    estimatedDelivery: '2023-12-10'
  },
  {
    id: 'fr-002',
    title: 'Integrate Instagram feed',
    description: 'Please add an Instagram feed widget to the homepage that displays my latest posts.',
    category: 'integration',
    status: 'in-review',
    priority: 'low',
    submittedBy: {
      id: 'user-1',
      name: 'John Doe'
    },
    orderId: 'ORD-2023-001',
    dateSubmitted: '2023-11-22'
  },
  {
    id: 'fr-003',
    title: 'Add a newsletter signup form',
    description: 'I need a newsletter signup form in the footer of the website that integrates with Mailchimp.',
    category: 'marketing',
    status: 'completed',
    priority: 'high',
    submittedBy: {
      id: 'user-1',
      name: 'John Doe'
    },
    orderId: 'ORD-2023-001',
    dateSubmitted: '2023-11-15',
    dateUpdated: '2023-11-30'
  }
];

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in-review': 'bg-blue-100 text-blue-800',
  'approved': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'completed': 'bg-purple-100 text-purple-800'
};

const priorityColors = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-orange-100 text-orange-800',
  'high': 'bg-red-100 text-red-800'
};

const categoryOptions = [
  { value: 'content', label: 'Content' },
  { value: 'design', label: 'Design' },
  { value: 'functionality', label: 'Functionality' },
  { value: 'integration', label: 'Integration' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'seo', label: 'SEO' },
  { value: 'other', label: 'Other' }
];

const FeatureRequests = () => {
  const { toast } = useToast();
  const { userType } = useUserStore();
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(initialFeatureRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dateSubmitted');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    orderId: ''
  });

  // Filter and sort feature requests
  const filteredRequests = featureRequests
    .filter(request => {
      const matchesSearch = 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'dateSubmitted':
          valueA = new Date(a.dateSubmitted).getTime();
          valueB = new Date(b.dateSubmitted).getTime();
          break;
        case 'dateUpdated':
          valueA = a.dateUpdated ? new Date(a.dateUpdated).getTime() : 0;
          valueB = b.dateUpdated ? new Date(b.dateUpdated).getTime() : 0;
          break;
        case 'title':
          valueA = a.title;
          valueB = b.title;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
        case 'status':
          const statusOrder = { pending: 1, 'in-review': 2, approved: 3, rejected: 4, completed: 5 };
          valueA = statusOrder[a.status] || 0;
          valueB = statusOrder[b.status] || 0;
          break;
        default:
          valueA = a.dateSubmitted;
          valueB = b.dateSubmitted;
      }
      
      if (valueA === valueB) {
        return 0;
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      orderId: ''
    });
    setIsEditMode(false);
  };

  const handleSubmitRequest = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.orderId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    if (isEditMode && selectedRequest) {
      // Update existing request
      const updatedRequests = featureRequests.map(request => {
        if (request.id === selectedRequest.id) {
          return {
            ...request,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priority: formData.priority as 'low' | 'medium' | 'high',
            orderId: formData.orderId,
            dateUpdated: currentDate
          };
        }
        return request;
      });
      
      setFeatureRequests(updatedRequests);
      setSelectedRequest(null);
      toast({
        title: "Request updated",
        description: "Your feature request has been updated successfully."
      });
    } else {
      // Create new request
      const newRequest: FeatureRequest = {
        id: `fr-${Date.now().toString().slice(-6)}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: 'pending',
        priority: formData.priority as 'low' | 'medium' | 'high',
        submittedBy: {
          id: 'user-1',
          name: 'John Doe'
        },
        orderId: formData.orderId,
        dateSubmitted: currentDate
      };
      
      setFeatureRequests([newRequest, ...featureRequests]);
      toast({
        title: "Request submitted",
        description: "Your feature request has been submitted successfully."
      });
    }
    
    resetForm();
    setIsNewRequestOpen(false);
  };

  const handleEditRequest = (request: FeatureRequest) => {
    setSelectedRequest(request);
    setFormData({
      title: request.title,
      description: request.description,
      category: request.category,
      priority: request.priority,
      orderId: request.orderId || ''
    });
    setIsEditMode(true);
    setIsNewRequestOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    const updatedRequests = featureRequests.filter(request => request.id !== id);
    setFeatureRequests(updatedRequests);
    setSelectedRequest(null);
    
    toast({
      title: "Request deleted",
      description: "The feature request has been deleted."
    });
  };

  const handleUpdateStatus = (id: string, newStatus: FeatureRequest['status']) => {
    const updatedRequests = featureRequests.map(request => {
      if (request.id === id) {
        return {
          ...request,
          status: newStatus,
          dateUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return request;
    });
    
    setFeatureRequests(updatedRequests);
    
    // If viewing a request, update the selected request
    if (selectedRequest && selectedRequest.id === id) {
      const updatedRequest = updatedRequests.find(r => r.id === id);
      if (updatedRequest) {
        setSelectedRequest(updatedRequest);
      }
    }
    
    toast({
      title: "Status updated",
      description: `Request status has been changed to ${newStatus}.`
    });
  };
  
  // Get the user's orders for the dropdown
  const userOrders = ORDERS;

  return (
    <div className="min-h-screen w-full flex group/sidebar-wrapper">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <SidebarTrigger className="mr-2 sm:hidden" />
                <h1 className="text-3xl font-bold text-gradient">Feature Requests</h1>
              </div>
              
              {userType === 'customer' && (
                <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-quicksite-blue hover:bg-quicksite-dark-blue text-white">
                      <Plus size={16} className="mr-2" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{isEditMode ? 'Edit Feature Request' : 'Submit a New Feature Request'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Related Order <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={formData.orderId}
                          onValueChange={(value) => handleInputChange('orderId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an order" />
                          </SelectTrigger>
                          <SelectContent>
                            {userOrders.map(order => (
                              <SelectItem key={order.id} value={order.id}>
                                {order.id} - {order.package.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Enter a concise title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          placeholder="Describe the feature you're requesting in detail"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={5}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange('category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                          </label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) => handleInputChange('priority', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {
                        resetForm();
                        setIsNewRequestOpen(false);
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitRequest}>
                        {isEditMode ? 'Update Request' : 'Submit Request'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="glass-card p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search feature requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-${selectedRequest ? '2' : '3'}`}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('title')}
                          >
                            <div className="flex items-center">
                              Title
                              {sortBy === 'title' && (
                                <ArrowUpDown size={14} className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center">
                              Status
                              {sortBy === 'status' && (
                                <ArrowUpDown size={14} className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            onClick={() => handleSort('priority')}
                          >
                            <div className="flex items-center">
                              Priority
                              {sortBy === 'priority' && (
                                <ArrowUpDown size={14} className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            onClick={() => handleSort('dateSubmitted')}
                          >
                            <div className="flex items-center">
                              Date Submitted
                              {sortBy === 'dateSubmitted' && (
                                <ArrowUpDown size={14} className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.length > 0 ? (
                          filteredRequests.map((request, index) => (
                            <motion.tr
                              key={request.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`hover:bg-gray-50 border-b border-gray-100 ${
                                selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                              }`}
                            >
                              <td 
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{request.title}</span>
                                  <span className="text-xs text-gray-500 mt-1">{request.id}</span>
                                </div>
                              </td>
                              <td 
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[request.status]}`}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                                </span>
                              </td>
                              <td 
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[request.priority]}`}>
                                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                                </span>
                              </td>
                              <td 
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() => setSelectedRequest(request)}
                              >
                                {new Date(request.dateSubmitted).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                {userType === 'admin' ? (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleUpdateStatus(request.id, 'approved')}
                                      className="text-green-600"
                                    >
                                      <CheckCircle2 size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                      className="text-red-600"
                                    >
                                      <XCircle size={16} />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEditRequest(request)}
                                      className="text-blue-600"
                                      disabled={request.status !== 'pending'}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteRequest(request.id)}
                                      className="text-red-600"
                                      disabled={request.status !== 'pending'}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </>
                                )}
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              No feature requests found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {selectedRequest && (
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedRequest.title}</CardTitle>
                          <CardDescription className="mt-1">{selectedRequest.id}</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setSelectedRequest(null)}
                          className="h-8 w-8"
                        >
                          <ArrowRight size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                        <p className="text-sm">{selectedRequest.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[selectedRequest.status]}`}>
                            {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1).replace('-', ' ')}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[selectedRequest.priority]}`}>
                            {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                        <p className="text-sm capitalize">{selectedRequest.category}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Related Order</h3>
                        <p className="text-sm">{selectedRequest.orderId || 'None'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Submitted On</h3>
                          <p className="text-sm">{new Date(selectedRequest.dateSubmitted).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</p>
                        </div>
                        
                        {selectedRequest.dateUpdated && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                            <p className="text-sm">{new Date(selectedRequest.dateUpdated).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedRequest.estimatedDelivery && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1 text-gray-400" />
                            <p className="text-sm">{new Date(selectedRequest.estimatedDelivery).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedRequest.adminNotes && userType === 'admin' && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Admin Notes</h3>
                          <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.adminNotes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {userType === 'customer' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(null)}
                          >
                            Close
                          </Button>
                          {selectedRequest.status === 'pending' && (
                            <Button 
                              size="sm"
                              className="bg-quicksite-blue hover:bg-quicksite-dark-blue text-white"
                              onClick={() => handleEditRequest(selectedRequest)}
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="w-full">
                          <Tabs defaultValue="status" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="status">Status</TabsTrigger>
                              <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="status" className="pt-4">
                              <div className="flex flex-col space-y-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(selectedRequest.id, 'in-review')}
                                  className={`justify-start ${selectedRequest.status === 'in-review' ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                  <Clock size={14} className="mr-2 text-blue-500" />
                                  Mark as In Review
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                                  className={`justify-start ${selectedRequest.status === 'approved' ? 'border-green-500 bg-green-50' : ''}`}
                                >
                                  <CheckCircle2 size={14} className="mr-2 text-green-500" />
                                  Approve Request
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                                  className={`justify-start ${selectedRequest.status === 'rejected' ? 'border-red-500 bg-red-50' : ''}`}
                                >
                                  <XCircle size={14} className="mr-2 text-red-500" />
                                  Reject Request
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(selectedRequest.id, 'completed')}
                                  className={`justify-start ${selectedRequest.status === 'completed' ? 'border-purple-500 bg-purple-50' : ''}`}
                                >
                                  <CheckCircle2 size={14} className="mr-2 text-purple-500" />
                                  Mark as Completed
                                </Button>
                              </div>
                            </TabsContent>
                            <TabsContent value="notes" className="pt-4">
                              <Textarea
                                placeholder="Add admin notes here..."
                                rows={3}
                                className="mb-2"
                                value={selectedRequest.adminNotes || ''}
                                onChange={(e) => {
                                  const updatedRequests = featureRequests.map(request => {
                                    if (request.id === selectedRequest.id) {
                                      return {
                                        ...request,
                                        adminNotes: e.target.value,
                                        dateUpdated: new Date().toISOString().split('T')[0]
                                      };
                                    }
                                    return request;
                                  });
                                  
                                  setFeatureRequests(updatedRequests);
                                  const updatedRequest = updatedRequests.find(r => r.id === selectedRequest.id);
                                  if (updatedRequest) {
                                    setSelectedRequest(updatedRequest);
                                  }
                                }}
                              />
                              <div className="flex justify-end">
                                <Button size="sm" onClick={() => {
                                  toast({
                                    title: "Notes saved",
                                    description: "Your notes have been saved successfully."
                                  });
                                }}>
                                  Save Notes
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default FeatureRequests;
