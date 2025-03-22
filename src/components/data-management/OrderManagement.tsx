
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Order, PROJECT_STATUSES } from '@/lib/data';
import { Edit, Trash, PlusCircle, Save } from 'lucide-react';

interface OrderManagementProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, setOrders }) => {
  const { toast } = useToast();
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  // Edit order
  const handleEditOrder = (orderId: string) => {
    const orderToEdit = orders.find(order => order.id === orderId);
    if (orderToEdit) {
      setEditedOrder({ ...orderToEdit });
      setEditingOrderId(orderId);
    }
  };

  // Save order changes
  const handleSaveOrderChanges = () => {
    if (editedOrder) {
      const updatedOrders = orders.map(order => 
        order.id === editedOrder.id ? editedOrder : order
      );
      setOrders(updatedOrders);
      setEditingOrderId(null);
      setEditedOrder(null);
      toast({
        title: "Order Updated",
        description: "The order has been successfully updated."
      });
    }
  };

  // Cancel order edit
  const handleCancelOrderEdit = () => {
    setEditingOrderId(null);
    setEditedOrder(null);
  };

  // Save all changes
  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes to orders data have been saved."
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order Management</CardTitle>
        <Button size="sm">
          <PlusCircle size={16} className="mr-2" />
          Add New Order
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.package.name}</TableCell>
                    <TableCell>
                      {editingOrderId === order.id ? (
                        <select
                          className="p-1 border rounded"
                          value={editedOrder?.status.id || ''}
                          onChange={(e) => setEditedOrder({
                            ...editedOrder!,
                            status: {
                              id: e.target.value,
                              label: PROJECT_STATUSES.find(s => s.id === e.target.value)?.label || ''
                            }
                          })}
                        >
                          {PROJECT_STATUSES.map(status => (
                            <option key={status.id} value={status.id}>{status.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status.id === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status.id === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          order.status.id === 'pending-input' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.label}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrderId === order.id ? (
                        <Input
                          type="number"
                          value={editedOrder?.totalAmount || 0}
                          onChange={(e) => setEditedOrder({
                            ...editedOrder!,
                            totalAmount: parseFloat(e.target.value)
                          })}
                          className="w-20 p-1"
                        />
                      ) : (
                        `$${order.totalAmount}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrderId === order.id ? (
                        <Input
                          type="date"
                          value={new Date(editedOrder?.orderDate || new Date()).toISOString().split('T')[0]}
                          onChange={(e) => setEditedOrder({
                            ...editedOrder!,
                            orderDate: new Date(e.target.value).toISOString()
                          })}
                          className="w-32 p-1"
                        />
                      ) : (
                        new Date(order.orderDate).toLocaleDateString()
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrderId === order.id ? (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="default" onClick={handleSaveOrderChanges}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelOrderEdit}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditOrder(order.id)}>
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="text-right">
            <Button onClick={handleSaveChanges}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
