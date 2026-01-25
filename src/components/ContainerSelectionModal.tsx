import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Container, containers, REFERENCE_HEIGHT_CM } from '../data/containers';

interface ContainerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (container: Container) => void;
}

export default function ContainerSelectionModal({ isOpen, onClose, onSelect }: ContainerSelectionModalProps) {
  const boxes = containers.filter(c => c.type === 'box');
  const trays = containers.filter(c => c.type === 'tray');

  const VISUAL_HEIGHT_PX = 140;

  const getVisualWidth = (container: Container) => {
    const aspectRatio = container.widthCm / container.heightCm;
    return VISUAL_HEIGHT_PX * aspectRatio;
  };

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

              <h2 className="text-3xl font-bold text-white text-center">
                اختر العلبة
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-coffee mb-4 text-center">
                  العلب
                </h3>

                <div className="space-y-4 max-w-3xl mx-auto">
                  {boxes.map((container) => {
                    const visualWidth = getVisualWidth(container);
                    return (
                      <motion.button
                        key={container.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(container)}
                        className="relative w-full bg-cream-100 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-brown-400 hover:border-brown-600 flex items-center justify-center overflow-hidden"
                        style={{
                          minHeight: `${VISUAL_HEIGHT_PX + 80}px`
                        }}
                      >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-6 w-full">
                          <div
                            className="relative rounded-lg border-2 border-brown-500 bg-gradient-to-b from-orange-200 to-orange-300 shadow-inner flex-shrink-0"
                            style={{
                              height: `${VISUAL_HEIGHT_PX}px`,
                              width: `${visualWidth}px`,
                              maxWidth: '100%'
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-brown-700 font-semibold text-sm opacity-60">
                                  {container.widthCm} سم
                                </div>
                              </div>
                            </div>
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
                              <div className="text-brown-700 font-semibold text-sm opacity-60 whitespace-nowrap">
                                {container.heightCm} سم
                              </div>
                            </div>
                          </div>

                          <div className="text-center md:text-right flex-1">
                            <h4 className="text-xl font-bold text-coffee mb-2">
                              {container.nameAr}
                            </h4>

                            <p className="text-sm text-brown-700 mb-1 font-semibold">
                              الأبعاد: {container.heightCm} × {container.widthCm} سم
                            </p>

                            <p className="text-sm text-brown-600 leading-tight">
                              سعر فارغة: <span className="font-bold text-brown-800">{container.basePriceJOD.toFixed(2)} دينار</span>
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t-2 border-brown-400 pt-6">
                <h3 className="text-xl font-bold text-coffee mb-4 text-center">
                  الصحون
                </h3>

                <div className="space-y-3 max-w-3xl mx-auto">
                  {trays.map((container) => {
                    const visualWidth = getVisualWidth(container);
                    return (
                      <motion.button
                        key={container.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(container)}
                        className="relative w-full bg-cream-100 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-brown-400 hover:border-brown-600 flex items-center justify-center overflow-hidden"
                        style={{
                          minHeight: `${VISUAL_HEIGHT_PX + 60}px`
                        }}
                      >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 w-full">
                          <div
                            className="relative rounded-lg border-2 border-brown-500 bg-gradient-to-b from-amber-100 to-amber-200 shadow-inner flex-shrink-0"
                            style={{
                              height: `${VISUAL_HEIGHT_PX}px`,
                              width: `${visualWidth}px`,
                              maxWidth: '100%'
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-brown-700 font-semibold text-sm opacity-60">
                                  {container.widthCm} سم
                                </div>
                              </div>
                            </div>
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
                              <div className="text-brown-700 font-semibold text-sm opacity-60 whitespace-nowrap">
                                {container.heightCm} سم
                              </div>
                            </div>
                          </div>

                          <div className="text-center md:text-right flex-1">
                            <h4 className="text-lg font-bold text-coffee mb-1">
                              {container.nameAr}
                            </h4>

                            <p className="text-sm text-brown-700 font-semibold">
                              الأبعاد: {container.heightCm} × {container.widthCm} سم
                            </p>
                          </div>
                        </div>
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
