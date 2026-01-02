import { X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlaCarteItem } from '../data/alacarteItems';
import { useState } from 'react';
import ZoomableImage from './ZoomableImage';

interface GiftBoxPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AlaCarteItem | null;
  onAddToCart: (item: AlaCarteItem) => void;
}

export default function GiftBoxPreviewModal({ isOpen, onClose, item, onAddToCart }: GiftBoxPreviewModalProps) {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

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
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[85vh] bg-cream rounded-2xl shadow-2xl flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-md z-20 hover:scale-110"
            >
              <X className="w-5 h-5 text-coffee" />
            </button>

            <div className="overflow-y-auto">
              <div className="p-5 space-y-5">
                {item.imagePlaceholder && (
                  <div
                    onClick={() => setIsImageZoomed(true)}
                    className="relative w-full h-72 rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={item.imagePlaceholder}
                      alt={item.nameAr}
                      className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white bg-black/60 px-4 py-2 rounded-full text-sm font-medium">
                        اضغط للتكبير
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-center space-y-3 bg-white/50 rounded-xl p-4">
                  <h2 className="text-2xl font-bold text-coffee">
                    {item.nameAr}
                  </h2>
                  {item.fixedWeightKg && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="bg-brown-100 px-4 py-2 rounded-lg">
                        <p className="text-coffee font-semibold">
                          الوزن: {item.fixedWeightKg * 1000} غرام
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-3xl font-bold text-brown-700">
                    {item.fixedPriceJOD?.toFixed(2)} دينار
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>أضف إلى السلة</span>
                </motion.button>
              </div>
            </div>

            {item.imagePlaceholder && (
              <ZoomableImage
                src={item.imagePlaceholder}
                alt={item.nameAr}
                isOpen={isImageZoomed}
                onClose={() => setIsImageZoomed(false)}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
