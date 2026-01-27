import { useState } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { sweets } from '../data/sweets';
import { alacarteItems } from '../data/alacarteItems';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    product_id: string;
    product_type: 'sweet' | 'alacarte';
    product_name: string;
    product_image: string;
    special_description: string;
  };
}

const WEIGHT_OPTIONS = [
  { value: 0.5, label: '500 غرام', kg: 0.5 },
  { value: 1, label: '1 كيلو', kg: 1 },
  { value: 1.5, label: '1.5 كيلو', kg: 1.5 },
  { value: 2, label: '2 كيلو', kg: 2 },
];

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product
}: ProductDetailsModalProps) {
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

  const productData = product.product_type === 'sweet'
    ? sweets.find(s => s.id === product.product_id)
    : alacarteItems.find(i => i.id === product.product_id);

  if (!productData) return null;

  const isWeightBased = product.product_type === 'alacarte' && 'pricePerKgJOD' in productData && productData.pricePerKgJOD;
  const basePrice = product.product_type === 'sweet'
    ? productData.priceJOD
    : isWeightBased
      ? (productData as typeof alacarteItems[0]).pricePerKgJOD! * selectedWeight
      : (productData as typeof alacarteItems[0]).fixedPriceJOD || 0;

  const totalPrice = basePrice * quantity;

  const handleAddToCart = () => {
    if (product.product_type === 'sweet') {
      addToCart({
        id: productData.id,
        nameAr: productData.nameAr,
        priceJOD: productData.priceJOD,
        quantity: quantity,
        image: productData.image,
        type: 'alacarte'
      });
    } else {
      const alacarteProduct = productData as typeof alacarteItems[0];
      addToCart({
        id: alacarteProduct.id,
        nameAr: isWeightBased
          ? `${alacarteProduct.nameAr} (${selectedWeight} كغ)`
          : alacarteProduct.nameAr,
        priceJOD: basePrice,
        quantity: quantity,
        image: alacarteProduct.image,
        type: 'alacarte'
      });
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedWeight(1);
    setQuantity(1);
    setShowSuccess(false);
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
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 left-3 z-10 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto">
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                    منتج مميز
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-right mb-2">
                    {product.product_name}
                  </h2>
                  <p className="text-gray-600 text-right text-sm leading-relaxed">
                    {product.special_description}
                  </p>
                </div>

                {isWeightBased && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 text-right mb-2">
                      اختر الوزن
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {WEIGHT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedWeight(option.kg)}
                          className={`p-2 rounded-xl border-2 transition-all text-sm font-medium ${
                            selectedWeight === option.kg
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 text-right mb-2">
                    الكمية
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-gray-900 w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base text-gray-600 text-right">السعر الإجمالي:</span>
                    <span className="text-2xl font-bold text-amber-600">
                      {totalPrice.toFixed(2)} د.أ
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={showSuccess}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-base hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {showSuccess ? (
                      <>
                        <Check className="w-5 h-5" />
                        تمت الإضافة
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        أضف إلى السلة
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
