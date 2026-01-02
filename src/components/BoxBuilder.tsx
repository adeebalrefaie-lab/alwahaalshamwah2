import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Trash2, ShoppingCart, AlertTriangle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sweets, MIN_FILL_PERCENTAGE, type Sweet } from '../data/sweets';
import { type BoxItem } from '../types';
import { Container, calculateScaledWeight, calculateScaledPrice } from '../data/containers';
import { useCart } from '../contexts/CartContext';
import { useProductAvailability } from '../hooks/useProductAvailability';

interface BoxBuilderProps {
  container: Container;
  onBack: () => void;
  onOpenCart: () => void;
}

export default function BoxBuilder({ container, onBack, onOpenCart }: BoxBuilderProps) {
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);
  const [overflowMessage, setOverflowMessage] = useState<string | null>(null);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { addToCart, getItemCount } = useCart();
  const { isAvailable } = useProductAvailability();

  const scaledSweets = useMemo(() => {
    const filteredSweets = container.type === 'box'
      ? sweets
      : sweets.filter(sweet => sweet.id !== 'separator');

    return filteredSweets.map(sweet => ({
      ...sweet,
      weightGrams: calculateScaledWeight(sweet.weightGrams, container.heightCm),
      priceJOD: calculateScaledPrice(sweet.priceJOD, container.heightCm),
    }));
  }, [container.heightCm, container.type]);

  const currentWidth = boxItems.reduce((sum, item) => sum + item.sweet.widthCm, 0);

  const showOverflowWarning = useCallback((itemName: string, remainingSpace: number, isSeparator: boolean) => {
    const itemText = isSeparator ? 'لإضافة هذا الفاصل' : 'لإضافة هذا الصنف';
    const spaceText = isSeparator ? 'لهذا الفاصل' : 'لهذا الصنف';
    
    if (remainingSpace <= 0) {
      // Box is completely full
      setOverflowMessage(
        `لا يمكن إضافة "${itemName}" - العلبة ممتلئة بالكامل. الرجاء إزالة بعض الحلويات أو الفواصل ${itemText}.`
      );
    } else {
      // Box has some space but not enough for this item
      setOverflowMessage(
        `لا يمكن إضافة "${itemName}" - لا توجد مساحة كافية ${spaceText}. الرجاء إزالة بعض الحلويات أو الفواصل ${itemText}.`
      );
    }
  }, []);

  useEffect(() => {
    if (overflowMessage) {
      const timer = setTimeout(() => setOverflowMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [overflowMessage]);

  const addToBox = (sweet: Sweet) => {
    if (!isAvailable(sweet.id)) {
      setOverflowMessage(`"${sweet.nameAr}" غير متوفر حالياً`);
      return;
    }

    const newTotalWidth = currentWidth + sweet.widthCm;
    const remainingSpace = container.widthCm - currentWidth;
    const isSeparator = sweet.id === 'separator';

    if (newTotalWidth > container.widthCm) {
      showOverflowWarning(sweet.nameAr, remainingSpace, isSeparator);
      return;
    }

    const newItem: BoxItem = {
      id: sweet.id,
      sweet,
      instanceId: `${sweet.id}-${Date.now()}-${Math.random()}`,
    };
    setBoxItems([...boxItems, newItem]);
  };

  const removeFromBox = (instanceId: string) => {
    setBoxItems(boxItems.filter((item) => item.instanceId !== instanceId));
  };

  const clearBox = () => {
    setBoxItems([]);
  };

  const totalPrice = container.basePriceJOD + boxItems.reduce((sum, item) => sum + item.sweet.priceJOD, 0);
  const totalWeight = boxItems.reduce((sum, item) => sum + item.sweet.weightGrams, 0);
  const totalWidth = boxItems.reduce((sum, item) => sum + item.sweet.widthCm, 0);
  const fillPercentage = (totalWidth / container.widthCm) * 100;
  const canCheckout = fillPercentage >= MIN_FILL_PERCENTAGE;

  const handleAddToCart = () => {
    if (canCheckout) {
      addToCart({
        type: 'custombox',
        id: `box-${Date.now()}`,
        container,
        boxItems,
        totalPrice,
        totalWeight,
        fillPercentage,
        instanceId: `custombox-${Date.now()}-${Math.random()}`,
      });
      setShowAddedMessage(true);
      setTimeout(() => {
        setShowAddedMessage(false);
        setBoxItems([]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-2 bg-cream-100 hover:bg-cream-200 rounded-lg shadow-sm border border-brown-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-coffee" />
            <span className="text-sm font-medium text-coffee">رجوع</span>
          </button>
          <h1 className="text-xl font-bold text-coffee">بناء علبتك</h1>
          <div className="flex items-center gap-2">
            {boxItems.length > 0 && (
              <button
                onClick={clearBox}
                className="p-2 hover:bg-brown-100 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5 text-brown-600" />
              </button>
            )}
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-brown-600 hover:bg-brown-700 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brown-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-coffee mb-3">اختر الحلويات</h2>
            <div className="grid grid-cols-2 gap-3">
              {scaledSweets.map((sweet) => {
                const available = isAvailable(sweet.id);
                return (
                  <motion.button
                    key={sweet.id}
                    whileTap={available ? { scale: 0.95 } : {}}
                    onClick={() => addToBox(sweet)}
                    disabled={!available}
                    style={{ aspectRatio: '1/1' }}
                    className={`${
                      sweet.id === 'separator'
                        ? 'bg-brown-300 border-2 border-brown-600'
                        : 'bg-cream-100 border-2 border-brown-400'
                    } rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center p-4 relative ${
                      !available ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cream-200'
                    }`}
                  >
                    <h3 className={`font-bold text-base text-center leading-tight ${
                      available ? 'text-coffee' : 'text-gray-500'
                    }`}>
                      {sweet.nameAr}
                    </h3>
                    {!available && (
                      <span className="text-xs text-red-600 font-semibold mt-1">
                        نفذت الكمية
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-coffee">العلبة</h2>
              <span className={`text-sm font-medium ${fillPercentage >= MIN_FILL_PERCENTAGE ? 'text-brown-700' : 'text-brown-500'}`}>
                {fillPercentage.toFixed(0)}%
              </span>
            </div>

            <div className="bg-cream-100 rounded-xl p-3 shadow-md border-2 border-brown-400">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: `${container.widthCm}/${container.heightCm}`,
                  border: '2px solid #8B6F47',
                  backgroundColor: '#FFF8F0',
                  borderRadius: 0
                }}
              >
                {boxItems.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-coffee/40 text-sm">
                    ابدأ بإضافة الحلويات هنا
                  </div>
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      alignItems: 'stretch',
                      justifyContent: 'flex-start',
                      gap: 0,
                      margin: 0,
                      padding: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    {boxItems.map((item) => {
                      // Calculate exact width percentage based on actual sweet width vs container width
                      const widthPercentage = (item.sweet.widthCm / container.widthCm) * 100;
                      
                      return (
                        <motion.div
                          key={item.instanceId}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          onClick={() => removeFromBox(item.instanceId)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            width: `${widthPercentage}%`,
                            minWidth: `${widthPercentage}%`,
                            maxWidth: `${widthPercentage}%`,
                            height: '100%',
                            flexShrink: 0,
                            flexGrow: 0,
                            margin: 0,
                            padding: 0,
                            lineHeight: 0,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={item.sweet.image}
                            alt={item.sweet.nameAr}
                            draggable={false}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              display: 'block',
                              margin: 0,
                              padding: 0,
                              userSelect: 'none',
                              pointerEvents: 'none'
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <div className="absolute bottom-1 right-2 text-[10px] text-coffee/50 bg-white/70 px-1.5 py-0.5 rounded">
                  {totalWidth.toFixed(1)} / {container.widthCm} سم
                </div>
              </div>

              <div
                className="w-full rounded-b-lg flex items-center justify-center gap-3 py-3"
                style={{
                  background: 'linear-gradient(to bottom, #6B5644, #4A3F35)',
                  borderTop: '2px solid #8B6F47'
                }}
              >
                <img
                  src="/assets/logo/logo.png"
                  alt="شعار حلويات الواحة الشامية"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-white font-bold text-lg tracking-wide">
                  حلويات الواحة الشامية
                </span>
              </div>

              <div className="mt-3 flex justify-center">
                <div className="h-1 bg-brown-200 rounded-full w-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    className={`h-full ${
                      fillPercentage >= MIN_FILL_PERCENTAGE
                        ? 'bg-brown-700'
                        : 'bg-brown-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-cream-100/95 backdrop-blur border-t-2 border-brown-400 shadow-lg">
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <div className="space-y-1">
              <p className="text-coffee/60">السعر الإجمالي</p>
              <p className="text-2xl font-bold text-bronze">{totalPrice.toFixed(2)} د.أ</p>
            </div>
            <div className="space-y-1 text-left">
              <p className="text-coffee/60">الوزن الكلي</p>
              <p className="text-xl font-semibold text-coffee">{totalWeight} غرام</p>
            </div>
          </div>

          {!canCheckout && boxItems.length > 0 && (
            <p className="text-xs text-brown-600 text-center">
              الرجاء تعبئة {MIN_FILL_PERCENTAGE}% من العلبة على الأقل ({(MIN_FILL_PERCENTAGE - fillPercentage).toFixed(0)}% متبقي)
            </p>
          )}

          {showAddedMessage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full py-4 rounded-xl font-semibold bg-green-600 text-white flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>تمت الإضافة إلى السلة</span>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!canCheckout}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                canCheckout
                  ? 'bg-brown-700 hover:bg-brown-800 hover:shadow-lg'
                  : 'bg-brown-300 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>أضف إلى السلة</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Error Popup Modal */}
      <AnimatePresence>
        {overflowMessage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOverflowMessage(null)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              {/* Popup Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-brown-400"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-coffee mb-2">تنبيه</h3>
                    <p className="text-sm text-brown-800 text-right leading-relaxed">
                      {overflowMessage}
                    </p>
                  </div>
                  <button
                    onClick={() => setOverflowMessage(null)}
                    className="flex-shrink-0 p-1 hover:bg-brown-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-brown-600" />
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setOverflowMessage(null)}
                    className="px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg font-medium transition-colors"
                  >
                    فهمت
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
