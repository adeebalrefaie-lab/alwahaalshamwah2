import { X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlaCarteItem } from '../data/alacarteItems';

interface GiftBoxPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AlaCarteItem | null;
  onAddToCart: (item: AlaCarteItem) => void;
}

export default function GiftBoxPreviewModal({ isOpen, onClose, item, onAddToCart }: GiftBoxPreviewModalProps) {
  if (!item) return null;

  const handleAddToCart = () => {
    onAddToCart(item);
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

              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold text-coffee">
                  {item.nameAr}
                </h2>
                {item.fixedWeightKg && (
                  <p className="text-brown-600 font-medium text-xs">
                    الوزن: {item.fixedWeightKg * 1000} غرام
                  </p>
                )}
                <p className="text-xl font-bold text-brown-700">
                  {item.fixedPriceJOD?.toFixed(2)} دينار
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>أضف إلى السلة</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
