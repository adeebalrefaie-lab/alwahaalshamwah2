import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ZoomableImage from './ZoomableImage';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 md:inset-4 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-cream shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: '100vh' }}
          >
            <div className="flex-shrink-0 sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-brown-400 shadow-sm">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-coffee/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-coffee" />
                </button>
                <h2 className="text-2xl font-bold text-coffee">
                  قائمة الأسعار
                </h2>
                <div className="w-10"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <ZoomableImage
                src="/assets/menu/menu_web.webp"
                alt="قائمة الأسعار"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
