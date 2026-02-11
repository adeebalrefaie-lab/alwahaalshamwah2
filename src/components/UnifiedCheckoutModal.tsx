import { useState } from 'react';
import { X, Send, User, Phone as PhoneIcon, Truck, Store, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedCartItem } from '../types';
import { useShopStatus } from '../hooks/useShopStatus';
import { useCart } from '../contexts/CartContext';

interface UnifiedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: UnifiedCartItem[];
  notes: string;
  totalPrice: number;
  clearCart: () => void;
}

type DeliveryMethod = 'delivery' | 'pickup' | '';

export default function UnifiedCheckoutModal({
  isOpen,
  onClose,
  cartItems,
  notes,
  totalPrice,
  clearCart,
}: UnifiedCheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('');
  const { isOpen: isShopOpen } = useShopStatus();
  const { appliedPromo, getDiscountedTotal } = useCart();
  const { subtotal, discountAmount, finalTotal } = getDiscountedTotal();

  const displayTotal = appliedPromo ? finalTotal : totalPrice;

  const generateWhatsAppMessage = () => {
    let message = `🌟 طلب جديد - حلويات الواحة الشامية 🌟\n\n`;

    const customBoxes = cartItems.filter(item => item.type === 'custombox');
    const alacarteItems = cartItems.filter(item => item.type === 'alacarte');

    if (customBoxes.length > 0) {
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📦 العلب المخصصة / علب المشكل:\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

      customBoxes.forEach((box, index) => {
        const boxContents = box.boxItems
          .map(item => {
            if (item.sweet.id === 'separator') {
              return '🔲 قاطع';
            }
            return `🍬 ${item.sweet.nameAr}`;
          })
          .reverse()
          .join('\n   ');

        message += `${index + 1}️⃣ علبة مخصصة (${box.container.nameAr})\n`;
        message += `   📝 المحتويات (من اليمين إلى اليسار):\n`;
        message += `   ${boxContents}\n`;
        message += `   💰 السعر: ${box.totalPrice.toFixed(2)} د.أ\n\n`;
      });
    }

    if (alacarteItems.length > 0) {
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🍯 الأصناف المحددة:\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

      const itemGroups = new Map<string, { item: typeof alacarteItems[0], count: number }>();

      alacarteItems.forEach(item => {
        const key = `${item.item.id}-${item.weightLabel}`;
        if (itemGroups.has(key)) {
          itemGroups.get(key)!.count++;
        } else {
          itemGroups.set(key, { item, count: 1 });
        }
      });

      let itemIndex = 1;
      itemGroups.forEach(({ item, count }) => {
        message += `${itemIndex}️⃣ ${item.item.nameAr}\n`;

        if (item.pricingMode === 'amount') {
          message += `   💵 طلب بقيمة: ${item.totalPrice.toFixed(2)} د.أ\n`;
          message += `   🔢 الكمية: ${count}\n`;
          if (count > 1) {
            message += `   💰 المجموع الفرعي: ${(item.totalPrice * count).toFixed(2)} د.أ\n`;
          }
        } else {
          message += `   📏 الحجم: ${item.weightLabel}\n`;
          message += `   🔢 الكمية: ${count}\n`;
          message += `   💰 سعر الوحدة: ${item.totalPrice.toFixed(2)} د.أ\n`;
          if (count > 1) {
            message += `   💵 المجموع الفرعي: ${(item.totalPrice * count).toFixed(2)} د.أ\n`;
          }
        }

        message += `\n`;
        itemIndex++;
      });
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n`;

    if (appliedPromo) {
      message += `المجموع الفرعي: ${subtotal.toFixed(2)} دينار أردني\n`;
      message += `🏷️ خصم (Code: ${appliedPromo.code}): -${discountAmount.toFixed(2)} دينار أردني\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `*المجموع النهائي: ${finalTotal.toFixed(2)} دينار أردني*\n`;
    } else {
      message += `💰 المجموع الكلي: ${totalPrice.toFixed(2)} دينار أردني\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `👤 الاسم: ${name}\n`;
    message += `📞 رقم الهاتف: ${phone}\n`;
    message += `🚚 طريقة الاستلام: ${deliveryMethod === 'delivery' ? 'توصيل 🚗' : 'استلام من الفرع 🏪'}\n`;

    if (notes.trim()) {
      message += `\n📝 ملاحظات إضافية:\n${notes}\n`;
    }

    return message;
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !deliveryMethod) {
      alert('الرجاء ملء جميع الحقول المطلوبة واختيار طريقة الاستلام');
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/962781506347?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-cream rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="sticky top-0 bg-gradient-to-r from-brown-600 to-brown-700 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">إتمام الطلب</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-brown-200 border-2 border-brown-400 rounded-xl p-4 text-center space-y-2">
                {appliedPromo ? (
                  <>
                    <div className="text-coffee/70 text-sm">المجموع الفرعي</div>
                    <div className="text-xl text-coffee/60 line-through">{subtotal.toFixed(2)} د.أ</div>
                    <div className="flex items-center justify-center gap-2 text-sm text-teal-700 font-medium">
                      <span className="bg-teal-100 px-2 py-0.5 rounded-full">
                        {appliedPromo.code}
                      </span>
                      <span>خصم {appliedPromo.discountPercentage}% (-{discountAmount.toFixed(2)} د.أ)</span>
                    </div>
                    <div className="text-coffee/70 text-sm">المجموع النهائي</div>
                    <div className="text-3xl font-bold text-bronze">{finalTotal.toFixed(2)} د.أ</div>
                  </>
                ) : (
                  <>
                    <div className="text-coffee/70 text-sm">المجموع الكلي</div>
                    <div className="text-3xl font-bold text-bronze">{displayTotal.toFixed(2)} د.أ</div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-coffee text-center">معلومات العميل</h3>

                <div>
                  <label className="block text-sm text-coffee/70 mb-2 text-right">
                    الاسم <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-coffee/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full pr-10 pl-4 py-3 bg-cream-50 border-2 border-brown-400 rounded-xl focus:border-brown-600 outline-none transition-colors text-right"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-coffee/70 mb-2 text-right">
                    رقم الهاتف <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-coffee/40" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XXXXXXXX"
                      className="w-full pr-10 pl-4 py-3 bg-cream-50 border-2 border-brown-400 rounded-xl focus:border-brown-600 outline-none transition-colors"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm text-coffee/70 text-right">
                  طريقة الاستلام <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      deliveryMethod === 'delivery'
                        ? 'bg-brown-600 border-brown-600 text-white'
                        : 'bg-cream-50 border-brown-400 text-coffee hover:border-brown-600'
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                    <span className="font-semibold">توصيل</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      deliveryMethod === 'pickup'
                        ? 'bg-brown-600 border-brown-600 text-white'
                        : 'bg-cream-50 border-brown-400 text-coffee hover:border-brown-600'
                    }`}
                  >
                    <Store className="w-6 h-6" />
                    <span className="font-semibold">استلام من الفرع</span>
                  </motion.button>
                </div>
              </div>

              {!isShopOpen && (
                <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-center gap-3 text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-semibold">
                    المحل مغلق حالياً، لا يمكن إتمام الطلب الآن
                  </p>
                </div>
              )}

              <motion.button
                whileTap={isShopOpen ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={!isShopOpen}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isShopOpen
                    ? 'bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white hover:shadow-lg cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>إرسال الطلب عبر واتساب</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
