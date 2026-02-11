import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function usePromoCodes(userId?: string) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPromoCodes = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error loading promo codes:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  const addPromoCode = async (code: string, discountPercentage: number) => {
    if (!userId) return { error: new Error('Not authenticated') };
    try {
      const { error } = await supabase.from('promo_codes').insert({
        code: code.toUpperCase().trim(),
        discount_percentage: discountPercentage,
        is_active: false,
        created_by: userId,
      });
      if (error) throw error;
      await loadPromoCodes();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePromoCode = async (
    id: string,
    updates: Partial<Pick<PromoCode, 'code' | 'discount_percentage' | 'is_active' | 'expires_at'>>
  ) => {
    try {
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.code !== undefined) payload.code = updates.code.toUpperCase().trim();
      if (updates.discount_percentage !== undefined) payload.discount_percentage = updates.discount_percentage;
      if (updates.is_active !== undefined) payload.is_active = updates.is_active;
      if (updates.expires_at !== undefined) payload.expires_at = updates.expires_at;

      const { error } = await supabase
        .from('promo_codes')
        .update(payload)
        .eq('id', id);

      if (error) throw error;
      await loadPromoCodes();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadPromoCodes();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return {
    promoCodes,
    loading,
    addPromoCode,
    updatePromoCode,
    deletePromoCode,
    refresh: loadPromoCodes,
  };
}

export async function validatePromoCode(code: string): Promise<{
  valid: boolean;
  discountPercentage: number;
  code: string;
}> {
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('code, discount_percentage, is_active, expires_at')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return { valid: false, discountPercentage: 0, code: '' };
    }

    if (data.expires_at && new Date(data.expires_at) <= new Date()) {
      return { valid: false, discountPercentage: 0, code: '' };
    }

    return {
      valid: true,
      discountPercentage: data.discount_percentage,
      code: data.code,
    };
  } catch {
    return { valid: false, discountPercentage: 0, code: '' };
  }
}
