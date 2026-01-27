import { useState } from 'react';
import { Menu, Phone, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import PWAInstallButton from './PWAInstallButton';
import FeaturedProductsCarousel from './FeaturedProductsCarousel';
import ProductDetailsModal from './ProductDetailsModal';

interface LandingPageProps {
  onStartBuilder: () => void;
  onStartAlaCarte: () => void;
  onOpenMenu: () => void;
  onOpenContact: () => void;
  onOpenAdminLogin: () => void;
}

export default function LandingPage({ onStartBuilder, onStartAlaCarte, onOpenMenu, onOpenContact, onOpenAdminLogin }: LandingPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<{
    product_id: string;
    product_type: 'sweet' | 'alacarte';
    product_name: string;
    product_image: string;
    special_description: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-cream flex flex-col relative">
      {/* Hidden Admin Access Button - Three Dots */}
      <button
        onClick={onOpenAdminLogin}
        className="absolute top-6 right-6 opacity-20 hover:opacity-40 transition-opacity duration-500 z-20"
        aria-label="Admin"
      >
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-coffee/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-coffee/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-coffee/30"></div>
        </div>
      </button>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block"
          >
            <img
              src="/assets/logo/logo.png"
              alt="شعار حلويات الواحة الشامية"
              className="h-32 w-auto mx-auto object-contain"
            />
          </motion.div>

          <h1 className="text-3xl font-bold text-coffee">
            حلويات الواحة الشامية
          </h1>
          <p className="text-lg text-coffee/70">
            اصنع علبتك الخاصة من أشهى الحلويات
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartBuilder}
            className="w-full bg-brown-600 hover:bg-brown-700 text-white py-5 rounded-2xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ابـدأ بتعبئـة علبتـك
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartAlaCarte}
            className="w-full bg-brown-500 hover:bg-brown-600 text-white py-5 rounded-2xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Package className="w-6 h-6" />
            <span>اطلب أصناف محددة</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenMenu}
            className="bg-cream-100 text-coffee py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-2 border-2 border-brown-400"
          >
            <Menu className="w-6 h-6" />
            <span>قائمة الأسعار</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenContact}
            className="bg-cream-100 text-coffee py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-2 border-2 border-brown-400"
          >
            <Phone className="w-6 h-6" />
            <span>تواصل معنا</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <PWAInstallButton />
        </motion.div>
      </motion.div>
      </div>

      <FeaturedProductsCarousel
        onProductClick={(product) => {
          setSelectedProduct({
            product_id: product.product_id,
            product_type: product.product_type,
            product_name: product.product_name,
            product_image: product.product_image,
            special_description: product.special_description
          });
        }}
      />

      {selectedProduct && (
        <ProductDetailsModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
