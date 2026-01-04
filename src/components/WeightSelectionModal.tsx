import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlaCarteItem, weightOptions, type CustomWeightOption } from '../data/alacarteItems';

interface WeightSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AlaCarteItem | null;
  onAddToCart: (item: AlaCarteItem, weightKg: number, weightLabel: string) => void;
}

export default function WeightSelectionModal({ isOpen, onClose, item, onAddToCart }: WeightSelectionModalProps) {
  if (!item) return null;

  const handleSelectWeight = (weightKg: number, weightLabel: string) => {
    onAddToCart(item, weightKg, weightLabel);
    onClose();
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
