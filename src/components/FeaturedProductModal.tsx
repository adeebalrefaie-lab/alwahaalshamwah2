import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface FeaturedProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
    type: 'sweet' | 'alacarte';
  };
  onSuccess?: () => void;
}

export default function FeaturedProductModal({
  isOpen,
  onClose,
  product,
  onSuccess
}: FeaturedProductModalProps) {
  const [specialDescription, setSpecialDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!specialDescription.trim()) {
      setError('يرجى إدخال وصف خاص');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session.session) {
        setError('يجب تسجيل الدخول لإضافة منتجات مميزة');
        setIsSubmitting(false);
        return;
      }

      const { data: existingProduct } = await supabase
        .from('product_featured_status')
        .select('id')
        .eq('product_id', product.id)
        .eq('product_type', product.type)
        .maybeSingle();

      if (existingProduct) {
        const { error: updateError } = await supabase
          .from('product_featured_status')
          .update({
            is_featured: true,
            special_description: specialDescription.trim()
          })
          .eq('id', existingProduct.id);

        if (updateError) {
          console.error('Update error:', updateError);
          setError(`خطأ: ${updateError.message}`);
          setIsSubmitting(false);
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from('product_featured_status')
          .insert({
            product_id: product.id,
            product_type: product.type,
            is_featured: true,
            special_description: specialDescription.trim(),
            display_order: 0
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          if (insertError.code === '42501') {
            setError('ليس لديك صلاحية لإضافة منتجات مميزة');
          } else {
            setError(`خطأ: ${insertError.message}`);
          }
          setIsSubmitting(false);
          return;
        }
      }

      setSpecialDescription('');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error adding featured product:', err);
      setError('حدث خطأ أثناء إضافة المنتج إلى القائمة المميزة');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSpecialDescription('');
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-lg font-bold text-gray-900">إضافة إلى المنتجات المميزة</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-xs text-gray-500 capitalize">{product.type}</span>
                </div>
              </div>

              <div>
                <label htmlFor="special-description" className="block text-xs font-medium text-gray-700 mb-1.5 text-right">
                  الوصف المميز
                </label>
                <textarea
                  id="special-description"
                  value={specialDescription}
                  onChange={(e) => setSpecialDescription(e.target.value)}
                  placeholder="أدخل وصفاً مميزاً يبرز ما يجعل هذا المنتج فريداً..."
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none disabled:opacity-50 disabled:bg-gray-50 text-right text-sm"
                  dir="rtl"
                />
                <p className="mt-1.5 text-xs text-gray-500 text-right">
                  سيظهر هذا الوصف في قسم المنتجات المميزة على الصفحة الرئيسية
                </p>
              </div>

              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs text-right" dir="rtl">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !specialDescription.trim()}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'جاري الإضافة...' : 'إضافة إلى المميزة'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
