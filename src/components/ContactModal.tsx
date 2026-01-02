import { X, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-cream rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 hover:bg-coffee/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-coffee" />
              </button>

              <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-coffee text-center mb-8">
                  تواصل معنا
                </h2>

                <div className="space-y-4">
                  <a
                    href="tel:0781506347"
                    className="flex items-center gap-4 p-4 bg-cream-100 border-2 border-brown-400 rounded-xl hover:bg-brown-100 transition-colors group"
                  >
                    <div className="p-3 bg-brown-300 rounded-full group-hover:bg-brown-400 transition-colors">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-coffee/60">اتصل بنا</p>
                      <p className="text-xl font-semibold text-coffee" dir="ltr">
                        0781506347
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://maps.app.goo.gl/KRm4FWHXghgEp5Fv7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-cream-100 border-2 border-brown-400 rounded-xl hover:bg-brown-100 transition-colors group"
                  >
                    <div className="p-3 bg-brown-300 rounded-full group-hover:bg-brown-400 transition-colors">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-coffee/60">موقع المحل</p>
                      <p className="text-lg font-semibold text-coffee">
                        افتح في الخرائط
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
