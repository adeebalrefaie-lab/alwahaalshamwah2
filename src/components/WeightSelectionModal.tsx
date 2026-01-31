import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlaCarteItem, weightOptions, type CustomWeightOption } from '../data/alacarteItems';

interface WeightSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AlaCarteItem | null;
  onAddToCart: (item: AlaCarteItem, weightKg: number, weightLabel: string, pricingMode?: 'weight' | 'amount', customAmount?: number) => void;
}

export default function WeightSelectionModal({ isOpen, onClose, item, onAddToCart }: WeightSelectionModalProps) {
  const [pricingMode, setPricingMode] = useState<'weight' | 'amount'>('weight');
  const [customAmount, setCustomAmount] = useState<string>('');

  if (!item) return null;

  const isDailyItem = item.category === 'daily';

  const handleSelectWeight = (weightKg: number, weightLabel: string) => {
    onAddToCart(item, weightKg, weightLabel, 'weight');
    onClose();
    setPricingMode('weight');
    setCustomAmount('');
  };

  const handleAddByAmount = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      onAddToCart(item, 0, 'حسب المبلغ', 'amount', amount);
      onClose();
      setPricingMode('weight');
      setCustomAmount('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 0.9, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-cream rounded-2xl shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-white rounded-full transition-all shadow-md z-20 hover:scale-110"
            >
              <X className="w-3.5 h-3.5 text-coffee" />
            </button>

            <div className="p-3.5 space-y-2.5">
              {item.imagePlaceholder && (
                <div className="relative w-full h-[160px] rounded-xl overflow-hidden">
                  <img
                    src={item.imagePlaceholder}
                    alt={item.nameAr}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-center space-y-0.5">
                <h2 className="text-[1.52rem] font-bold text-coffee">
                  {item.nameAr}
                </h2>
                {item.pricePerKgJOD && (
                  <p className="text-brown-600 font-medium text-[1.01rem]">
                    {item.pricePerKgJOD?.toFixed(2)} دينار / كيلو
                  </p>
                )}
              </div>

              {isDailyItem && (
                <div className="flex gap-1.5 p-1 bg-cream-100 rounded-lg">
                  <button
                    onClick={() => setPricingMode('weight')}
                    className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
                      pricingMode === 'weight'
                        ? 'bg-gradient-to-br from-brown-500 to-brown-600 text-white shadow-md'
                        : 'text-brown-600 hover:bg-cream-200'
                    }`}
                  >
                    بالوزن
                  </button>
                  <button
                    onClick={() => setPricingMode('amount')}
                    className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
                      pricingMode === 'amount'
                        ? 'bg-gradient-to-br from-brown-500 to-brown-600 text-white shadow-md'
                        : 'text-brown-600 hover:bg-cream-200'
                    }`}
                  >
                    بالدينار
                  </button>
                </div>
              )}

              {pricingMode === 'weight' ? (
                <div className="space-y-1.5">
                  <h3 className="text-[1.01rem] font-semibold text-coffee text-center">
                    اختر الوزن
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5">
                  {(item.customWeightOptions || weightOptions).map((option) => {
                    let weight: number;
                    let label: string;
                    let price: number;

                    if ('id' in option) {
                      weight = (option as typeof weightOptions[0]).weightKg;
                      label = (option as typeof weightOptions[0]).nameAr;
                      price = (item.pricePerKgJOD || 0) * weight;
                    } else {
                      const customOption = option as CustomWeightOption;
                      weight = customOption.weightKg;
                      label = customOption.nameAr;
                      price = customOption.priceJOD;
                    }

                    return (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectWeight(weight, label)}
                        className="px-3 py-2.5 h-[3.5rem] bg-gradient-to-br from-cream-100 to-white border-2 border-brown-400 rounded-lg hover:border-brown-600 hover:shadow-md transition-all flex flex-row items-center justify-between gap-1"
                      >
                        <span className="text-brown-700 font-bold text-[1.09rem]">{price.toFixed(2)} د.أ</span>
                        <span className="font-bold text-coffee text-[1.09rem]">{label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-[1.01rem] font-semibold text-coffee text-center">
                    أدخل المبلغ المطلوب بالدينار
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="مثال: 5"
                      className="w-full px-4 py-3 text-center text-lg font-semibold border-2 border-brown-400 rounded-lg focus:border-brown-600 focus:outline-none bg-white"
                      dir="ltr"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddByAmount}
                      disabled={!customAmount || parseFloat(customAmount) <= 0}
                      className="w-full py-3 bg-gradient-to-br from-brown-500 to-brown-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إضافة للسلة
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
