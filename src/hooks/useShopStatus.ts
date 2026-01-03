import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ShopStatus {
  isOpen: boolean;
  reason: 'manual' | 'hours' | null;
  nextOpenTime?: string;
}

export function useShopStatus() {
  const [status, setStatus] = useState<ShopStatus>({
    isOpen: true,
    reason: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkShopStatus();

    const interval = setInterval(checkShopStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkShopStatus = async () => {
    try {
      const [settingsResult, hoursResult] = await Promise.all([
        supabase.from('shop_settings').select('is_open').single(),
        supabase.from('working_hours').select('*').order('day_of_week'),
      ]);

      if (settingsResult.data && !settingsResult.data.is_open) {
        setStatus({
          isOpen: false,
          reason: 'manual',
        });
        setLoading(false);
        return;
      }

      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.toTimeString().slice(0, 5);

      const todayHours = hoursResult.data?.find(
        (day) => day.day_of_week === currentDay
      );

      if (todayHours?.is_closed) {
        setStatus({
          isOpen: false,
          reason: 'hours',
        });
        setLoading(false);
        return;
      }

      if (todayHours) {
        const openingTime = todayHours.opening_time.slice(0, 5);
        const closingTime = todayHours.closing_time.slice(0, 5);

        if (currentTime < openingTime || currentTime >= closingTime) {
          setStatus({
            isOpen: false,
            reason: 'hours',
            nextOpenTime: openingTime,
          });
          setLoading(false);
          return;
        }
      }

      setStatus({
        isOpen: true,
        reason: null,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error checking shop status:', error);
      setStatus({
        isOpen: true,
        reason: null,
      });
      setLoading(false);
    }
  };

  return { ...status, loading };
}
