// src/components/OrderSummary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from '@/stores/userStore';
import { Order } from '@/lib/data';

interface OrderSummaryProps {
  orders: Order[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orders }) => {
  const { profile } = useUserStore();
  const isAdmin = profile?.role === 'admin';

  // Filter orders based on user role
  const ordersForCustomer = orders.filter(order => isAdmin || order.customer.email === profile?.email);

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
