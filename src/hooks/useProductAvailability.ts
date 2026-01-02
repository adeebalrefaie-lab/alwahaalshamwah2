import { useState, useEffect } from 'react';
import { supabase, ProductAvailability } from '../lib/supabase';

export const useProductAvailability = () => {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailability();

    const channel = supabase
      .channel('product_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_availability',
        },
        () => {
          loadAvailability();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('product_availability')
        .select('*');

      if (error) throw error;

      const availabilityMap: Record<string, boolean> = {};
      data?.forEach((item: ProductAvailability) => {
        availabilityMap[item.product_id] = item.is_available;
      });

      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAvailable = (productId: string): boolean => {
    return availability[productId] !== undefined ? availability[productId] : true;
  };

  return { availability, loading, isAvailable };
};
