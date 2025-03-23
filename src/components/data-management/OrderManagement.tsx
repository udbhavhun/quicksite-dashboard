
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

// Define the allowed status colors for use in the component
type StatusColor = "error" | "pending" | "blue" | "success" | "warning";

// Helper function to convert a status string to a badge variant
const getStatusBadgeVariant = (statusColor: StatusColor): "default" | "destructive" | "outline" | "secondary" => {
  switch(statusColor) {
    case "error":
      return "destructive";
    case "success":
      return "default";
    case "warning":
    case "pending":
    case "blue":
    default:
      return "secondary";
  }
};

// Helper function to safely convert a status string to its matching color
const getStatusColor = (status: string): StatusColor => {
  switch(status.toLowerCase()) {
    case 'canceled':
    case 'rejected':
      return "error";
    case 'pending':
    case 'not-started':
      return "pending";
    case 'approved':
    case 'in-progress':
    case 'review':
      return "blue";
    case 'completed':
    case 'live':
      return "success";
    case 'delayed':
    case 'testing':
      return "warning";
    default:
      return "pending";
  }
};

// Helper function to safely get status ID
const getStatusId = (status: any): string => {
  if (!status) return '';
  
  if (typeof status === 'object' && status.id) {
    return status.id;
  }
  
  return String(status);
};

interface TransformedOrder {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  package: {
    name: string;
    price: number;
  };
}

interface OrderManagementProps {
  orders: TransformedOrder[];
  onSelectCustomerOrder?: (customerId?: string, orderId?: string) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ 
  orders,
  onSelectCustomerOrder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<TransformedOrder[]>(orders);

  React.useEffect(() => {
    if (!orders) {
      setFilteredOrders([]);
      return;
    }
    
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = orders.filter(order => 
        order.id.toLowerCase().includes(lowerCaseQuery) ||
        order.customer.name.toLowerCase().includes(lowerCaseQuery) ||
        order.package.name.toLowerCase().includes(lowerCaseQuery) ||
        getStatusId(order.status).toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (id: string, customerId?: string) => {
    if (onSelectCustomerOrder) {
      onSelectCustomerOrder(customerId, id);
    }
    
    toast({
      title: "Edit Order",
      description: `Edit order with ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Delete Order",
      description: `Delete order with ID: ${id}`,
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Orders</span>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Package</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customer.name}</td>
                    <td className="py-3 px-4">{order.package.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(getStatusColor(getStatusId(order.status)))}>
                        {getStatusId(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">${order.package.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2" 
                        onClick={() => handleEdit(order.id, order.customer.id)}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
