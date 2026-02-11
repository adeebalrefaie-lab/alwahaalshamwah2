import { useState } from 'react';
import { X, Trash2, ShoppingCart, Package, FileText, Tag, Check, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedCartItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { validatePromoCode } from '../hooks/usePromoCodes';

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
  const { appliedPromo, setAppliedPromo, getDiscountedTotal } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [promoMessage, setPromoMessage] = useState('');

  const { subtotal, discountAmount, finalTotal } = getDiscountedTotal();

  const handleValidatePromo = async () => {
    if (!promoInput.trim()) return;

    setPromoStatus('loading');
    const result = await validatePromoCode(promoInput);

    if (result.valid) {
      setAppliedPromo({ code: result.code, discountPercentage: result.discountPercentage });
      setPromoStatus('valid');
      setPromoMessage(`تم تطبيق الخصم (${result.discountPercentage}%)`);
    } else {
      setPromoStatus('invalid');
      setPromoMessage('الكود غير صحيح');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoStatus('idle');
    setPromoMessage('');
  };

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

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-coffee/70">
                <Tag className="w-4 h-4" />
                <span>كود الخصم</span>
              </label>

              {appliedPromo ? (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-teal-50 border-2 border-teal-300 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-teal-600" />
                    <span className="font-mono font-bold text-teal-700 tracking-wider" dir="ltr">
                      {appliedPromo.code}
                    </span>
                    <span className="text-sm text-teal-600">
                      ({appliedPromo.discountPercentage}% خصم)
                    </span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="p-1 text-teal-500 hover:text-red-500 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      if (promoStatus === 'invalid') {
                        setPromoStatus('idle');
                        setPromoMessage('');
                      }
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidatePromo()}
                    placeholder="أدخل كود الخصم"
                    className={`flex-1 px-4 py-3 bg-cream-50 border-2 rounded-xl outline-none transition-colors text-left font-mono uppercase tracking-wider ${
                      promoStatus === 'invalid'
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-brown-400 focus:border-brown-600'
                    }`}
                    dir="ltr"
                  />
                  <button
                    onClick={handleValidatePromo}
                    disabled={!promoInput.trim() || promoStatus === 'loading'}
                    className="px-5 py-3 bg-brown-600 hover:bg-brown-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {promoStatus === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>تحقق</span>
                    )}
                  </button>
                </div>
              )}

              <AnimatePresence>
                {promoMessage && promoStatus !== 'idle' && !appliedPromo && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`text-sm font-medium text-right ${
                      promoStatus === 'invalid' ? 'text-red-600' : 'text-teal-600'
                    }`}
                  >
                    {promoMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1 pt-2">
              {appliedPromo ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-coffee/60 text-sm">المجموع الفرعي</span>
                    <span className="text-lg font-semibold text-coffee/70">{subtotal.toFixed(2)} د.أ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-600 text-sm font-medium">
                      خصم ({appliedPromo.discountPercentage}%)
                    </span>
                    <span className="text-lg font-semibold text-teal-600">
                      -{discountAmount.toFixed(2)} د.أ
                    </span>
                  </div>
                  <div className="border-t border-brown-300 pt-2 mt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-coffee font-semibold text-sm">المجموع النهائي</span>
                      <span className="text-2xl font-bold text-bronze">{finalTotal.toFixed(2)} د.أ</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-coffee/60 text-sm">المجموع الكلي</span>
                  <span className="text-2xl font-bold text-bronze">{subtotal.toFixed(2)} د.أ</span>
                </div>
              )}
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
