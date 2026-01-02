import { useState } from 'react';
import { X, Trash2, Send, User, Phone as PhoneIcon, Truck, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (instanceId: string) => void;
  onClearCart: () => void;
}

export default function CartModal({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }: CartModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup');

  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWeight = cartItems.reduce((sum, item) => sum + item.weightKg, 0);

  const handleCheckout = () => {
    if (!name.trim() || !phone.trim()) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    if (cartItems.length === 0) {
      alert('السلة فارغة');
      return;
    }

    const orderTypeText = orderType === 'delivery' ? 'توصيل' : 'استلام من المحل';

    let message = `📦 طلب أصناف محددة - حلويات الواحة الشامية\n\n`;
    message += `الاسم: ${name}\n`;
    message += `رقم الهاتف: ${phone}\n\n`;
    message += `محتويات الطلب:\n`;
    message += `━━━━━━━━━━━━━━━\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.item.nameAr}\n`;
      message += `   الوزن: ${item.weightLabel}\n`;
      message += `   السعر: ${item.totalPrice.toFixed(2)} دينار\n\n`;
    });

    message += `━━━━━━━━━━━━━━━\n`;
    message += `الوزن الإجمالي: ${totalWeight.toFixed(2)} كغ\n`;
    message += `💰 السعر الإجمالي: ${totalPrice.toFixed(2)} دينار\n\n`;
    message += `نوع الطلب: ${orderTypeText}`;

    const whatsappUrl = `https://wa.me/962781506347?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-cream rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 hover:bg-coffee/10 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-coffee" />
              </button>

              <div className="p-8 overflow-y-auto max-h-[85vh] space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-coffee">السلة</h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="p-2 hover:bg-brown-100 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-brown-600" />
                    </button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-coffee/60">السلة فارغة</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-cream-100 border-2 border-brown-400 rounded-xl p-4 space-y-3">
                      <h3 className="font-semibold text-coffee mb-2">محتويات السلة</h3>

                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div
                            key={item.instanceId}
                            className="flex items-center justify-between p-3 bg-cream-50 rounded-lg"
                          >
                            <button
                              onClick={() => onRemoveItem(item.instanceId)}
                              className="p-1 hover:bg-brown-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-brown-600" />
                            </button>
                            <div className="flex-1 text-right mx-3">
                              <p className="font-medium text-coffee">{item.item.nameAr}</p>
                              <p className="text-sm text-coffee/60">{item.weightLabel}</p>
                            </div>
                            <p className="font-bold text-brown-800">{item.totalPrice.toFixed(2)} د.أ</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-brown-400 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee/70">الوزن الإجمالي</span>
                          <span className="font-medium text-coffee">{totalWeight.toFixed(2)} كغ</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-coffee font-semibold">السعر الإجمالي</span>
                          <span className="font-bold text-brown-800 text-lg">{totalPrice.toFixed(2)} د.أ</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-coffee">معلومات الطلب</h3>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-coffee/70 mb-1">الاسم</label>
                          <div className="relative">
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-coffee/40" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="أدخل اسمك"
                              className="w-full pr-10 pl-4 py-3 bg-cream-50 border-2 border-brown-400 rounded-xl focus:border-brown-600 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-coffee/70 mb-1">رقم الهاتف</label>
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

                        <div>
                          <label className="block text-sm text-coffee/70 mb-2">نوع الطلب</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setOrderType('pickup')}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                orderType === 'pickup'
                                  ? 'border-brown-600 bg-brown-200'
                                  : 'border-brown-400 bg-cream-100 hover:border-brown-500'
                              }`}
                            >
                              <Package className="w-6 h-6 mx-auto mb-1 text-brown-700" />
                              <span className="text-sm font-medium text-coffee">استلام من المحل</span>
                            </button>
                            <button
                              onClick={() => setOrderType('delivery')}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                orderType === 'delivery'
                                  ? 'border-brown-600 bg-brown-200'
                                  : 'border-brown-400 bg-cream-100 hover:border-brown-500'
                              }`}
                            >
                              <Truck className="w-6 h-6 mx-auto mb-1 text-brown-700" />
                              <span className="text-sm font-medium text-coffee">توصيل</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full bg-brown-700 hover:bg-brown-800 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                      <span>إرسال الطلب</span>
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
