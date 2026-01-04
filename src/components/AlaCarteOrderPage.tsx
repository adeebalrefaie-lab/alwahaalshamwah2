import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { alacarteItems, getCategoryItems, getCategoryNameAr, AlaCarteItem } from '../data/alacarteItems';
import WeightSelectionModal from './WeightSelectionModal';
import GiftBoxPreviewModal from './GiftBoxPreviewModal';
import { useProductAvailability } from '../hooks/useProductAvailability';
import { useCart } from '../contexts/CartContext';

interface AlaCarteOrderPageProps {
  onBack: () => void;
  onOpenCart: () => void;
}

export default function AlaCarteOrderPage({ onBack, onOpenCart }: AlaCarteOrderPageProps) {
  const [selectedItem, setSelectedItem] = useState<AlaCarteItem | null>(null);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [selectedGiftBox, setSelectedGiftBox] = useState<AlaCarteItem | null>(null);
  const [isGiftBoxModalOpen, setIsGiftBoxModalOpen] = useState(false);
  const { isAvailable } = useProductAvailability();
  const { addToCart, getItemCount } = useCart();

  const dailyItems = getCategoryItems('daily');
  const dryItems = getCategoryItems('dry');
  const giftBoxItems = getCategoryItems('giftbox');

  const handleItemClick = (item: AlaCarteItem) => {
    if (!isAvailable(item.id)) {
      return;
    }

    if (item.category === 'giftbox' && item.fixedWeightKg && item.fixedPriceJOD) {
      setSelectedGiftBox(item);
      setIsGiftBoxModalOpen(true);
    } else {
      setSelectedItem(item);
      setIsWeightModalOpen(true);
    }
  };

  const handleAddGiftBoxToCart = (item: AlaCarteItem) => {
    if (!item.fixedWeightKg || !item.fixedPriceJOD) return;

    const weightLabel = `${item.fixedWeightKg * 1000} غرام`;
    addToCart({
      type: 'alacarte',
      id: item.id,
      item,
      weightKg: item.fixedWeightKg,
      weightLabel,
      totalPrice: item.fixedPriceJOD,
      instanceId: `${item.id}-${Date.now()}-${Math.random()}`,
    });
  };

  const handleAddToCart = (item: AlaCarteItem, weightKg: number, weightLabel: string) => {
    let totalPrice = (item.pricePerKgJOD || 0) * weightKg;

    if (item.customWeightOptions) {
      const customOption = item.customWeightOptions.find(o => o.weightKg === weightKg);
      if (customOption) {
        totalPrice = customOption.priceJOD;
      }
    }

    addToCart({
      type: 'alacarte',
      id: item.id,
      item,
      weightKg,
      weightLabel,
      totalPrice,
      instanceId: `${item.id}-${Date.now()}-${Math.random()}`,
    });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-2 bg-cream-100 hover:bg-cream-200 rounded-lg shadow-sm border border-brown-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-coffee" />
            <span className="text-sm font-medium text-coffee">رجوع</span>
          </button>
          <h1 className="text-xl font-bold text-coffee">اطلب أصناف محددة</h1>
          <button
            onClick={onOpenCart}
            className="relative p-2 bg-brown-600 hover:bg-brown-700 rounded-full transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {getItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-brown-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="p-4 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-coffee mb-4 text-center">
              {getCategoryNameAr('daily')}
            </h2>
            <div className="space-y-2">
              {dailyItems.map((item) => {
                const available = isAvailable(item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: available ? 0.98 : 1 }}
                    onClick={() => handleItemClick(item)}
                    disabled={!available}
                    className={`w-full p-4 border-2 rounded-xl transition-all flex items-center justify-between gap-4 ${
                      available
                        ? 'bg-cream-100 border-brown-400 hover:bg-brown-100 hover:border-brown-600 cursor-pointer'
                        : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      available ? 'bg-brown-200' : 'bg-gray-300'
                    }`}>
                      {item.imagePlaceholder ? (
                        <img
                          src={item.imagePlaceholder}
                          alt={item.nameAr}
                          loading="lazy"
                          className={`w-full h-full object-cover ${!available ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <Package className={`w-6 h-6 ${available ? 'text-brown-700' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div className={`font-semibold ${available ? 'text-coffee' : 'text-gray-500'}`}>
                        {item.nameAr}
                      </div>
                      {!available && (
                        <div className="text-sm text-red-600 font-medium">نفذت الكمية</div>
                      )}
                    </div>
                    <span className={`font-bold ${available ? 'text-brown-700' : 'text-gray-500'}`}>
                      {item.pricePerKgJOD?.toFixed(2)} د.أ/كغ
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="border-t-2 border-brown-400 pt-6">
            <h2 className="text-2xl font-bold text-coffee mb-4 text-center">
              {getCategoryNameAr('dry')}
            </h2>
            <div className="space-y-2">
              {dryItems.map((item) => {
                const available = isAvailable(item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: available ? 0.98 : 1 }}
                    onClick={() => handleItemClick(item)}
                    disabled={!available}
                    className={`w-full p-4 border-2 rounded-xl transition-all flex items-center justify-between gap-4 ${
                      available
                        ? 'bg-cream-100 border-brown-400 hover:bg-brown-100 hover:border-brown-600 cursor-pointer'
                        : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      available ? 'bg-brown-200' : 'bg-gray-300'
                    }`}>
                      {item.imagePlaceholder ? (
                        <img
                          src={item.imagePlaceholder}
                          alt={item.nameAr}
                          loading="lazy"
                          className={`w-full h-full object-cover ${!available ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <Package className={`w-6 h-6 ${available ? 'text-brown-700' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div className={`font-semibold ${available ? 'text-coffee' : 'text-gray-500'}`}>
                        {item.nameAr}
                      </div>
                      {!available && (
                        <div className="text-sm text-red-600 font-medium">نفذت الكمية</div>
                      )}
                    </div>
                    <span className={`font-bold ${available ? 'text-brown-700' : 'text-gray-500'}`}>
                      {item.pricePerKgJOD ? (
                        `${item.pricePerKgJOD.toFixed(2)} د.أ/كغ`
                      ) : item.customWeightOptions ? (
                        `من ${Math.min(...item.customWeightOptions.map(o => o.priceJOD)).toFixed(2)} د.أ`
                      ) : (
                        ''
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="border-t-2 border-brown-400 pt-6">
            <h2 className="text-2xl font-bold text-coffee mb-4 text-center">
              {getCategoryNameAr('giftbox')}
            </h2>
            <div className="space-y-2">
              {giftBoxItems.map((item) => {
                const available = isAvailable(item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: available ? 0.98 : 1 }}
                    onClick={() => handleItemClick(item)}
                    disabled={!available}
                    className={`w-full p-4 border-2 rounded-xl transition-all flex items-center justify-between gap-4 ${
                      available
                        ? 'bg-cream-100 border-brown-400 hover:bg-brown-100 hover:border-brown-600 cursor-pointer'
                        : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      available ? 'bg-brown-200' : 'bg-gray-300'
                    }`}>
                      {item.imagePlaceholder ? (
                        <img
                          src={item.imagePlaceholder}
                          alt={item.nameAr}
                          loading="lazy"
                          className={`w-full h-full object-cover ${!available ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <Package className={`w-6 h-6 ${available ? 'text-brown-700' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div className={`font-semibold ${available ? 'text-coffee' : 'text-gray-500'}`}>
                        {item.nameAr}
                      </div>
                      <div className={`text-sm ${available ? 'text-brown-600' : 'text-gray-500'}`}>
                        {item.fixedWeightKg && `${item.fixedWeightKg * 1000} غرام`}
                      </div>
                      {!available && (
                        <div className="text-sm text-red-600 font-medium">نفذت الكمية</div>
                      )}
                    </div>
                    <span className={`font-bold ${available ? 'text-brown-700' : 'text-gray-500'}`}>
                      {item.fixedPriceJOD?.toFixed(2)} د.أ
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <WeightSelectionModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        item={selectedItem}
        onAddToCart={handleAddToCart}
      />

      <GiftBoxPreviewModal
        isOpen={isGiftBoxModalOpen}
        onClose={() => setIsGiftBoxModalOpen(false)}
        item={selectedGiftBox}
        onAddToCart={handleAddGiftBoxToCart}
      />
    </div>
  );
}
