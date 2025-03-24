
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/lib/data/types';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';
import { ORDERS } from '@/lib/data';

interface UseOrdersOptions {
  customerId?: string;
  orderId?: string;
  status?: string;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useUserStore();

  const fetchOrders = async () => {
    if (!profile) {
      setError(new Error('User not authenticated'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would fetch orders from the database
      // For this demo, we're using mocked data from ORDERS
      
      let filteredOrders = [...ORDERS];
      
      // Apply role-based filtering - admins see all orders, customers see only their own
      if (profile.role !== 'admin') {
        filteredOrders = filteredOrders.filter(order => 
          order.customer.email === profile.email
        );
      }
      
      // Apply additional filters if provided
      if (options.customerId) {
        filteredOrders = filteredOrders.filter(order => 
          order.customer.id === options.customerId
        );
      }
      
      if (options.orderId) {
        filteredOrders = filteredOrders.filter(order => 
          order.id === options.orderId
        );
      }
      
      if (options.status) {
        filteredOrders = filteredOrders.filter(order => 
          order.status.label.toLowerCase() === options.status?.toLowerCase()
        );
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch orders'));
      toast({
        title: 'Error',
        description: 'Failed to fetch orders. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [profile, options.customerId, options.orderId, options.status]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders
  };
};
