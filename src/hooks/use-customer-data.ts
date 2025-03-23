
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';

export interface CustomerDataEntry {
  id: string;
  user_id: string;
  order_id: string;
  content_type: string;
  content_key: string;
  content_value: any;
  created_at: string;
  updated_at: string;
}

interface UseCustomerDataProps {
  orderId?: string;
  contentType?: string;
  key?: string;
}

export const useCustomerData = ({ orderId, contentType, key }: UseCustomerDataProps = {}) => {
  const [data, setData] = useState<CustomerDataEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useUserStore();

  const fetchData = async () => {
    if (!profile?.id) {
      setError(new Error('User not authenticated'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('customer_content')
        .select('*');
      
      // Apply filters
      if (profile.role !== 'admin') {
        // Regular users can only see their own data
        query = query.eq('user_id', profile.id);
      }
      
      if (orderId) {
        query = query.eq('order_id', orderId);
      }
      
      if (contentType) {
        query = query.eq('content_type', contentType);
      }
      
      if (key) {
        query = query.eq('content_key', key);
      }
      
      const { data: customerData, error: queryError } = await query;
      
      if (queryError) throw queryError;
      
      setData(customerData || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch customer data'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (id: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('customer_content')
        .update({ 
          content_value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setData(data.map(item => 
        item.id === id 
          ? { ...item, content_value: newValue, updated_at: new Date().toISOString() } 
          : item
      ));
      
      toast({
        title: 'Success',
        description: 'Data updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating customer data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update data',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createData = async (newData: Omit<CustomerDataEntry, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: insertedData, error } = await supabase
        .from('customer_content')
        .insert({
          user_id: newData.user_id,
          order_id: newData.order_id,
          content_type: newData.content_type,
          content_key: newData.content_key,
          content_value: newData.content_value
        })
        .select();
      
      if (error) throw error;
      
      // Update local state if data was returned
      if (insertedData && insertedData.length > 0) {
        setData([...data, insertedData[0]]);
      } else {
        // If no data was returned, refetch
        fetchData();
      }
      
      toast({
        title: 'Success',
        description: 'Data created successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error creating customer data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create data',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteData = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setData(data.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Data deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting customer data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete data',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile?.id, orderId, contentType, key]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    updateData,
    createData,
    deleteData
  };
};
