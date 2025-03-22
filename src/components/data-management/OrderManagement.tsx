
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash, FileEdit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/StatusBadge';
import { Order, ProjectStatus } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface OrderManagementProps {
  orders: Order[];
  onUpdate: (orderId: string, status: ProjectStatus, assignedTo?: string) => void;
  onDelete: (orderId: string) => void;
  setItemToDelete: (item: {id: string, type: string} | null) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ 
  orders, 
  onUpdate,
  onDelete,
  setItemToDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');

  const statusOptions: ProjectStatus[] = [
    { id: 'planning', label: 'Planning', color: 'gray' },
    { id: 'inProgress', label: 'In Progress', color: 'blue' },
    { id: 'review', label: 'In Review', color: 'yellow' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'delayed', label: 'Delayed', color: 'orange' },
    { id: 'canceled', label: 'Canceled', color: 'red' }
  ];

  const handleUpdateOrder = () => {
    if (editingOrder && selectedStatus) {
      const status = statusOptions.find(option => option.id === selectedStatus);
      if (status) {
        onUpdate(editingOrder.id, status, assignedTo || undefined);
        setEditingOrder(null);
        setSelectedStatus('');
        setAssignedTo('');
        toast({
          title: "Order updated",
          description: `Order #${editingOrder.id} has been updated.`
        });
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.package.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="group">
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{order.package.name}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingOrder(order);
                            setSelectedStatus(order.status.id);
                            setAssignedTo(order.assignedTo || '');
                          }}
                        >
                          <FileEdit size={14} className="mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Order {editingOrder?.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="status" className="text-right text-sm font-medium">
                              Status
                            </label>
                            <Select 
                              value={selectedStatus} 
                              onValueChange={setSelectedStatus}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem key={status.id} value={status.id}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="assignedTo" className="text-right text-sm font-medium">
                              Assigned To
                            </label>
                            <Input
                              id="assignedTo"
                              value={assignedTo}
                              onChange={(e) => setAssignedTo(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={handleUpdateOrder}>Save Changes</Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setItemToDelete({ id: order.id, type: 'order' })}
                    >
                      <Trash size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderManagement;
