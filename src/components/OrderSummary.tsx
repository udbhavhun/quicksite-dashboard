
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from '@/stores/userStore';
import { Order } from '@/lib/data';

interface OrderSummaryProps {
  orders?: Order[];
  order?: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orders = [], order }) => {
  const { profile } = useUserStore();
  const isAdmin = profile?.role === 'admin';
  
  // Handle single order case (for the dashboard)
  if (order) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Package</p>
              <p className="text-2xl font-bold">{order.package.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-2xl font-bold">${order.package.price.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure orders is an array before filtering
  if (!Array.isArray(orders) || orders.length === 0) {
    // Return a fallback UI when orders is not available
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No order data available</p>
        </CardContent>
      </Card>
    );
  }

  // Filter orders based on user role - safely check if profile exists first
  const ordersForCustomer = profile ? (isAdmin 
    ? orders 
    : orders.filter(order => order.customer.email === profile.email)
  ) : [];

  // Calculate total orders
  const totalOrders = ordersForCustomer.length;

  // Calculate total revenue (sum of all order amounts)
  const totalRevenue = ordersForCustomer.reduce((sum, order) => sum + order.package.price, 0);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
