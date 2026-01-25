import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Trash2, ShoppingCart, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sweets, MIN_FILL_PERCENTAGE, type Sweet } from '../data/sweets';
import { type BoxItem } from '../types';
import { Container, calculateScaledWeight, calculateScaledPrice, REFERENCE_HEIGHT_CM } from '../data/containers';
import { useCart } from '../contexts/CartContext';
import { useProductAvailability } from '../hooks/useProductAvailability';

interface BoxBuilderProps {
  container: Container;
  onBack: () => void;
  onOpenCart: () => void;
}

export default function BoxBuilder({ container, onBack, onOpenCart }: BoxBuilderProps) {
  const VISUAL_HEIGHT_PX = 140;

  const getVisualWidth = () => {
    const aspectRatio = container.widthCm / container.heightCm;
    return VISUAL_HEIGHT_PX * aspectRatio;
  };
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

  const showOverflowWarning = useCallback((itemName: string) => {
    setOverflowMessage(`لا يمكن إضافة "${itemName}"، تجاوز الحد الأقصى للتعبئة (${container.widthCm} سم)`);
  }, [container.widthCm]);

  useEffect(() => {
    if (overflowMessage) {
      const timer = setTimeout(() => setOverflowMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [overflowMessage]);

  const addToBox = (sweet: Sweet) => {
    if (!isAvailable(sweet.id)) {
      setOverflowMessage(`"${sweet.nameAr}" غير متوفر حالياً`);
      return;
    }

    const newTotalWidth = currentWidth + sweet.widthCm;

    if (newTotalWidth > container.widthCm) {
      showOverflowWarning(sweet.nameAr);
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
            <h2 className="text-base font-semibold text-coffee mb-2">اختر الحلويات</h2>
            <div className="grid grid-cols-2 gap-2">
              {scaledSweets.map((sweet) => {
                const available = isAvailable(sweet.id);
                return (
                  <motion.button
                    key={sweet.id}
                    whileTap={available ? { scale: 0.98 } : {}}
                    onClick={() => addToBox(sweet)}
                    disabled={!available}
                    className={`${
                      sweet.id === 'separator'
                        ? 'bg-brown-300 border-2 border-brown-600'
                        : 'bg-cream-100 border-2 border-brown-400'
                    } rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center relative ${
                      !available ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cream-200'
                    }`}
                    style={{
                      height: '53.55px',
                      padding: '0.4rem'
                    }}
                  >
                    <div className="text-center w-full flex flex-col items-center justify-center h-full">
                      <h3 className={`font-bold leading-tight ${
                        available ? 'text-coffee' : 'text-gray-500'
                      }`}
                      style={{ fontSize: '108%' }}>
                        {sweet.nameAr}
                      </h3>
                      <p className="text-coffee/60 mt-0.5"
                         style={{ fontSize: '81%' }}>
                        {sweet.priceJOD.toFixed(2)} د.أ
                      </p>
                    </div>
                    {!available && (
                      <span className="absolute -top-1 -right-1 text-[9px] text-red-600 font-semibold bg-white px-1.5 py-0.5 rounded shadow">
                        نفذت
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

            <div className="flex justify-center">
              <div className="inline-flex flex-col">
                <div
                  className="relative rounded-lg overflow-hidden shadow-md"
                  style={{
                    height: `${VISUAL_HEIGHT_PX}px`,
                    width: `${getVisualWidth()}px`,
                    border: '2px solid #8B6F47',
                    backgroundColor: '#FBAF76'
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
                      padding: 0
                    }}
                  >
                    {boxItems.map((item) => {
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
                            height: '100%',
                            flexShrink: 0,
                            flexGrow: 0,
                            margin: 0,
                            padding: 0,
                            lineHeight: 0
                          }}
                        >
                          <img
                            src={item.sweet.image}
                            alt={item.sweet.nameAr}
                            draggable={false}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              display: 'block',
                              margin: 0,
                              padding: 0
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
                  className="rounded-b-lg flex items-center justify-center py-3 px-2 shadow-md"
                  style={{
                    width: `${getVisualWidth()}px`,
                    background: 'linear-gradient(to bottom, #6B5644, #4A3F35)',
                    borderTop: '2px solid #8B6F47'
                  }}
                >
                  <span className="text-white font-semibold text-sm text-center leading-tight">
                    للإزالة، اضغط على الصنف داخل العلبة
                  </span>
                </div>

              <div
                className="h-1 bg-brown-200 rounded-full overflow-hidden mt-3 shadow-sm"
                style={{
                  width: `${getVisualWidth()}px`
                }}
              >
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

            <AnimatePresence>
              {overflowMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 bg-brown-50 border border-brown-400 rounded-lg p-3 flex items-center gap-2 max-w-md mx-auto"
                >
                  <AlertTriangle className="w-5 h-5 text-brown-700 flex-shrink-0" />
                  <p className="text-sm text-brown-800 text-right">{overflowMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-cream-100/95 backdrop-blur border-t-2 border-brown-400 shadow-lg">
        <div style={{ padding: '12.512px', display: 'flex', flexDirection: 'column', gap: '9.384px' }}>
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-coffee/60" style={{ fontSize: '11.718px' }}>السعر الإجمالي</p>
              <p className="font-bold text-bronze" style={{ fontSize: '20.088px' }}>{totalPrice.toFixed(2)} د.أ</p>
            </div>
            <div className="space-y-1 text-left">
              <p className="text-coffee/60" style={{ fontSize: '11.718px' }}>الوزن الكلي</p>
              <p className="font-semibold text-coffee" style={{ fontSize: '16.74px' }}>{totalWeight} غرام</p>
            </div>
          </div>

          {!canCheckout && boxItems.length > 0 && (
            <p className="text-brown-600 text-center" style={{ fontSize: '10.044px' }}>
              الرجاء تعبئة {MIN_FILL_PERCENTAGE}% من العلبة على الأقل ({(MIN_FILL_PERCENTAGE - fillPercentage).toFixed(0)}% متبقي)
            </p>
          )}

          {showAddedMessage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full rounded-xl font-semibold bg-green-600 text-white flex items-center justify-center gap-2"
              style={{ paddingTop: '12.512px', paddingBottom: '12.512px', fontSize: '13.392px' }}
            >
              <Check className="w-5 h-5" />
              <span>تمت الإضافة إلى السلة</span>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!canCheckout}
              className={`w-full rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                canCheckout
                  ? 'bg-brown-700 hover:bg-brown-800 hover:shadow-lg'
                  : 'bg-brown-300 cursor-not-allowed'
              }`}
              style={{ paddingTop: '12.512px', paddingBottom: '12.512px', fontSize: '13.392px' }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>أضف إلى السلة</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
