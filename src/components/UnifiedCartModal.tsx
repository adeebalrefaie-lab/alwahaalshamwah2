import { X, Trash2, ShoppingCart, Package, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedCartItem } from '../types';

interface UnifiedCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: UnifiedCartItem[];
  notes: string;
  onRemoveItem: (instanceId: string) => void;
  onClearCart: () => void;
  onNotesChange: (notes: string) => void;
  onCheckout: () => void;
}

export default function UnifiedCartModal({
  isOpen,
  onClose,
  cartItems,
  notes,
  onRemoveItem,
  onClearCart,
  onNotesChange,
  onCheckout,
}: UnifiedCartModalProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative w-full max-w-2xl bg-cream rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="sticky top-0 bg-gradient-to-r from-brown-600 to-brown-700 text-white p-4 rounded-t-3xl sm:rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-xl font-bold">السلة</h2>
            <span className="bg-white text-brown-700 px-2 py-1 rounded-full text-sm font-semibold">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-coffee/60">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="text-lg font-semibold">السلة فارغة</p>
              <p className="text-sm mt-2">ابدأ بإضافة منتجات إلى السلة</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {cartItems.map((cartItem) => (
                  <motion.div
                    key={cartItem.instanceId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-cream-100 rounded-xl p-4 border-2 border-brown-400 relative"
                  >
                    <button
                      onClick={() => onRemoveItem(cartItem.instanceId)}
                      className="absolute top-2 left-2 p-1.5 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>

                    {cartItem.type === 'alacarte' ? (
                      <div className="flex items-start gap-3 pr-8">
                        <div className="w-12 h-12 bg-brown-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {cartItem.item.imagePlaceholder ? (
                            <img
                              src={cartItem.item.imagePlaceholder}
                              alt={cartItem.item.nameAr}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-brown-700" />
                          )}
                        </div>
                        <div className="flex-1 text-right">
                          <h3 className="font-semibold text-coffee">{cartItem.item.nameAr}</h3>
                          {cartItem.pricingMode === 'amount' ? (
                            <p className="text-sm text-brown-600 mt-1">
                              طلب بقيمة {cartItem.totalPrice.toFixed(2)} د.أ
                            </p>
                          ) : (
                            <p className="text-sm text-brown-600 mt-1">{cartItem.weightLabel}</p>
                          )}
                          <p className="text-lg font-bold text-bronze mt-2">
                            {cartItem.totalPrice.toFixed(2)} د.أ
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="pr-8">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-5 h-5 text-brown-700" />
                          <h3 className="font-semibold text-coffee">علبة مخصصة</h3>
                        </div>
                        <div className="text-sm text-brown-600 space-y-1">
                          <p>الحجم: {cartItem.container.nameAr}</p>
                          <p>عدد الحلويات: {cartItem.boxItems.length} قطعة</p>
                          <p>الوزن: {cartItem.totalWeight} غرام</p>
                          <p>نسبة التعبئة: {cartItem.fillPercentage.toFixed(0)}%</p>
                        </div>
                        <p className="text-lg font-bold text-bronze mt-3">
                          {cartItem.totalPrice.toFixed(2)} د.أ
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="w-full py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  مسح السلة بالكامل
                </button>
              )}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-cream-100 border-t-2 border-brown-400 p-4 space-y-3">
            <div>
              <label className="flex items-center gap-2 text-sm text-coffee/70 mb-2">
                <FileText className="w-4 h-4" />
                <span>ملاحظات / Notes</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="أضف أي ملاحظات حول الطلب..."
                className="w-full px-4 py-3 bg-cream-50 border-2 border-brown-400 rounded-xl focus:border-brown-600 outline-none transition-colors resize-none text-right"
                rows={3}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-coffee/60 text-sm">المجموع الكلي</span>
              <span className="text-2xl font-bold text-bronze">{totalPrice.toFixed(2)} د.أ</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              متابعة للدفع
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
