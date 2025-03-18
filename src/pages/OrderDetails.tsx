
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import OrderForm from '@/components/OrderForm';
import { Order, ORDERS } from '@/lib/data';
import { ArrowLeft, Edit, Save, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch order details
  useEffect(() => {
    if (orderId) {
      // In a real app, this would be an API call
      const foundOrder = ORDERS.find(o => o.id === orderId);
      setOrder(foundOrder || null);
      
      if (!foundOrder) {
        toast({
          title: "Order not found",
          description: `We couldn't find an order with ID ${orderId}`,
          variant: "destructive"
        });
      }
    }
  }, [orderId, toast]);

  const handleSaveOrder = (updatedOrder: Order) => {
    // In a real app, this would be an API call
    setOrder(updatedOrder);
    
    toast({
      title: "Changes saved",
      description: "Order details have been updated successfully.",
    });
    
    setIsEditing(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow p-6">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate('/')}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </button>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
              <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
              <button 
                onClick={() => navigate('/')}
                className="py-2 px-4 bg-quicksite-blue text-white rounded-lg"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </button>
            
            <div className="flex gap-2">
              {isEditing ? (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Order
                </button>
              )}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">
                Order {order.id}
              </h1>
              <StatusBadge status={
                order.stages.every(s => s.status === 'completed') ? 'completed' :
                order.stages.some(s => s.status === 'in-progress') ? 'in-progress' :
                'pending'
              } size="lg" />
            </div>
            
            {isEditing ? (
              <OrderForm 
                order={order} 
                onSave={handleSaveOrder} 
                onCancel={() => setIsEditing(false)} 
              />
            ) : (
              <OrderDetailsView order={order} />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Separate component for the read-only view
const OrderDetailsView = ({ order }: { order: Order }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{order.customer.email}</p>
            </div>
            {order.customer.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-base font-medium mb-3">Package Details</h4>
            <p className="text-lg font-semibold mb-1">{order.package.name}</p>
            <p className="text-gray-600 mb-3">{order.package.description}</p>
            <p className="text-lg font-semibold">₹{order.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-xl font-semibold mb-4">Order Timeline</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-quicksite-success' : 
                  order.paymentStatus === 'pending' ? 'text-quicksite-warning' : 
                  'text-quicksite-error'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-base font-medium mb-4">Progress Status</h4>
              <div className="space-y-4">
                {order.stages.map((stage) => (
                  <div key={stage.id} className="flex items-center">
                    <StatusBadge status={stage.status} size="sm" className="min-w-24" />
                    <div className="flex-grow ml-3">
                      <p className="text-sm font-medium">{stage.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`rounded-full h-2 ${
                            stage.status === 'completed' ? 'bg-quicksite-success' : 
                            stage.status === 'in-progress' ? 'bg-quicksite-blue' : 
                            stage.status === 'pending' ? 'bg-quicksite-warning' : 
                            'bg-gray-300'
                          }`}
                          style={{ width: `${stage.percentComplete}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-3 text-sm">{stage.percentComplete}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {order.requirements && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Requirements</h3>
              <span className="text-sm text-gray-500">
                {order.requirements.filter(r => r.fulfilled).length}/{order.requirements.length} Fulfilled
              </span>
            </div>
            
            <div className="space-y-3">
              {order.requirements.map((req) => (
                <div key={req.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{req.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{req.description}</p>
                    </div>
                    <div className="flex items-center">
                      {req.fulfilled ? (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          Fulfilled
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                      {req.priority === 'high' && (
                        <span className="ml-2 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                          High Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
