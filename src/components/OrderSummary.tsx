
import React from 'react';
import { Order } from '@/lib/data';
import { Calendar, CreditCard, Package } from 'lucide-react';

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  // Create date formatter
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="glass-card p-6 hover-lift">
      <h3 className="text-xl font-semibold mb-6 text-gradient">Order Summary</h3>
      
      <div className="mb-6 flex items-center">
        <div className="w-16 h-16 rounded-xl bg-quicksite-blue/10 flex items-center justify-center mr-4">
          <Package size={24} className="text-quicksite-blue" />
        </div>
        <div>
          <h4 className="font-medium text-lg">{order.package.name}</h4>
          <p className="text-gray-600">{order.package.description}</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center text-gray-600">
            <span className="font-medium">Order ID</span>
          </div>
          <span className="font-medium">{order.id}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-t border-white/10">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>Order Date</span>
          </div>
          <span>{formatDate(order.orderDate)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-t border-white/10">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>Estimated Delivery</span>
          </div>
          <span>{formatDate(order.estimatedDelivery)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-t border-white/10">
          <div className="flex items-center text-gray-600">
            <CreditCard size={16} className="mr-2" />
            <span>Payment Status</span>
          </div>
          <span className={`
            ${order.paymentStatus === 'paid' ? 'text-quicksite-success' : 
              order.paymentStatus === 'pending' ? 'text-quicksite-warning' : 
              'text-quicksite-error'}
            font-medium
          `}>
            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm -mx-6 px-6 py-4 mt-6 border-t border-white/10 rounded-b-2xl">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount</span>
          <span className="text-lg font-semibold">₹{order.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
