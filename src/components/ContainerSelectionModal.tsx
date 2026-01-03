import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Container, containers } from '../data/containers';

interface ContainerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (container: Container) => void;
}

export default function ContainerSelectionModal({ isOpen, onClose, onSelect }: ContainerSelectionModalProps) {
  const boxes = containers.filter(c => c.type === 'box');
  const trays = containers.filter(c => c.type === 'tray');

  const handleSelect = (container: Container) => {
    onSelect(container);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-cream rounded-2xl shadow-2xl"
          >
            <div className="sticky top-0 z-10 bg-brown-600 p-6 rounded-t-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <h2 className="text-3xl font-bold text-white text-center mb-2">
                اختر الحاوية
              </h2>
              <p className="text-cream-100 text-center">
                Choose Your Container
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-coffee mb-4 text-center">
                  العلب
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {boxes.map((container) => (
                    <motion.button
                      key={container.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(container)}
                      className="relative p-4 bg-cream-100 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-brown-400 hover:border-brown-600 text-right"
                    >
                      <h4 className="text-base font-bold text-coffee mb-2">
                        {container.nameAr}
                      </h4>

                      <p className="text-sm text-brown-700 mb-2 font-semibold">
                        {container.heightCm} × {container.widthCm} cm
                      </p>

                      <p className="text-xs text-brown-600 leading-tight">
                        سعر فارغة: <span className="font-bold text-brown-800">{container.basePriceJOD.toFixed(2)} دينار</span>
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-brown-400 pt-6">
                <h3 className="text-xl font-bold text-coffee mb-4 text-center">
                  الصحون
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {trays.map((container) => (
                    <motion.button
                      key={container.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(container)}
                      className="relative p-4 bg-cream-100 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-brown-400 hover:border-brown-600 text-right"
                    >
                      <h4 className="text-sm font-bold text-coffee mb-2">
                        {container.nameAr}
                      </h4>

                      <p className="text-xs text-brown-700 font-semibold">
                        {container.heightCm} × {container.widthCm} cm
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
