
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import { Order, ORDERS } from '@/lib/data';
import { 
  ArrowUpDown, 
  Search, 
  Plus, 
  FileText, 
  Edit, 
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort orders
  const filteredOrders = ORDERS.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.package.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = !statusFilter || 
      (statusFilter === 'completed' && order.stages.every(s => s.status === 'completed')) ||
      (statusFilter === 'in-progress' && order.stages.some(s => s.status === 'in-progress')) ||
      (statusFilter === 'pending' && !order.stages.some(s => s.status === 'in-progress') && !order.stages.every(s => s.status === 'completed'));
      
    return matchesSearch && matchesStatus;
  });
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortField) return 0;
    
    let valA: any;
    let valB: any;
    
    switch (sortField) {
      case 'id':
        valA = a.id;
        valB = b.id;
        break;
      case 'customer':
        valA = a.customer.name;
        valB = b.customer.name;
        break;
      case 'package':
        valA = a.package.name;
        valB = b.package.name;
        break;
      case 'date':
        valA = new Date(a.orderDate).getTime();
        valB = new Date(b.orderDate).getTime();
        break;
      case 'amount':
        valA = a.totalAmount;
        valB = b.totalAmount;
        break;
      default:
        return 0;
    }
    
    const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };
  
  const handleEditOrder = (orderId: string) => {
    navigate(`/orders/${orderId}?edit=true`);
  };
  
  const handleDeleteOrder = (orderId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Order deleted",
      description: `Order ${orderId} has been deleted successfully.`,
    });
  };
  
  const handleCreateOrder = () => {
    // In a real app, navigate to a new order form
    toast({
      title: "Feature coming soon",
      description: "Creating new orders will be available in the next update.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Orders</h1>
            <button
              onClick={handleCreateOrder}
              className="py-2 px-4 bg-quicksite-blue text-white rounded-lg hover:bg-quicksite-dark-blue transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              New Order
            </button>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-64"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
                
                <button className="flex items-center text-gray-600 py-2 px-3 bg-gray-100 rounded-md">
                  <Filter size={16} className="mr-2" />
                  <span className="hidden sm:inline">More Filters</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        Order ID
                        {sortField === 'id' && (
                          <ArrowUpDown size={14} className="ml-2" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('customer')}
                    >
                      <div className="flex items-center">
                        Customer
                        {sortField === 'customer' && (
                          <ArrowUpDown size={14} className="ml-2" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('package')}
                    >
                      <div className="flex items-center">
                        Package
                        {sortField === 'package' && (
                          <ArrowUpDown size={14} className="ml-2" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        {sortField === 'amount' && (
                          <ArrowUpDown size={14} className="ml-2" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === 'date' && (
                          <ArrowUpDown size={14} className="ml-2" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell onClick={() => handleViewOrder(order.id)}>
                        <span className="font-medium">{order.id}</span>
                      </TableCell>
                      <TableCell onClick={() => handleViewOrder(order.id)}>
                        {order.customer.name}
                      </TableCell>
                      <TableCell onClick={() => handleViewOrder(order.id)}>
                        {order.package.name}
                      </TableCell>
                      <TableCell onClick={() => handleViewOrder(order.id)}>
                        <StatusBadge 
                          status={
                            order.stages.every(s => s.status === 'completed') ? 'completed' :
                            order.stages.some(s => s.status === 'in-progress') ? 'in-progress' :
                            'pending'
                          } 
                          size="sm" 
                        />
                      </TableCell>
                      <TableCell onClick={() => handleViewOrder(order.id)}>
                        ₹{order.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell onClick={() => handleViewOrder(order.id)}>
                        {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order.id);
                          }}
                          className="text-gray-500 hover:text-quicksite-blue transition-colors p-1"
                        >
                          <FileText size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditOrder(order.id);
                          }}
                          className="text-gray-500 hover:text-amber-500 transition-colors p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(order.id);
                          }}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </TableCell>
                    </motion.tr>
                  ))}
                  
                  {currentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-200 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === page 
                          ? 'bg-quicksite-blue text-white' 
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-200 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
