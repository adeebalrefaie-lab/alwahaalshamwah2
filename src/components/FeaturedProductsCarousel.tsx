import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sweets, type Sweet } from '../data/sweets';
import { alacarteItems, getAlaCarteItemImage, type AlaCarteItem } from '../data/alacarteItems';

interface FeaturedProduct {
  id: string;
  product_id: string;
  product_type: 'sweet' | 'alacarte';
  special_description: string;
  display_order: number;
  product_name: string;
  product_image: string;
  product_price: number;
  productData: Sweet | AlaCarteItem;
}

interface FeaturedProductsCarouselProps {
  onProductClick: (product: FeaturedProduct) => void;
}

export default function FeaturedProductsCarousel({ onProductClick }: FeaturedProductsCarouselProps) {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadFeaturedProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('product_featured_status')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const enrichedProducts: FeaturedProduct[] = (data || []).map(fp => {
        if (fp.product_type === 'sweet') {
          const sweet = sweets.find(s => s.id === fp.product_id);
          if (!sweet) return null;
          return {
            ...fp,
            product_name: sweet.nameAr,
            product_image: sweet.image,
            product_price: sweet.priceJOD,
            special_description: fp.special_description || '',
            productData: sweet
          };
        } else {
          const item = alacarteItems.find(i => i.id === fp.product_id);
          if (!item) return null;
          return {
            ...fp,
            product_name: item.nameAr,
            product_image: getAlaCarteItemImage(item),
            product_price: item.pricePerKgJOD || item.fixedPriceJOD || 0,
            special_description: fp.special_description || '',
            productData: item
          };
        }
      }).filter((fp): fp is FeaturedProduct => fp !== null);

      setFeaturedProducts(enrichedProducts);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredProducts.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return null;
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  const visibleProducts = featuredProducts.length >= 3
    ? [
        featuredProducts[(currentIndex - 1 + featuredProducts.length) % featuredProducts.length],
        featuredProducts[currentIndex],
        featuredProducts[(currentIndex + 1) % featuredProducts.length]
      ]
    : featuredProducts;

  return (
    <div className="relative w-full bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-6 px-2 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNiIgZmlsbD0iI0ZGQjMzMyIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-30" />

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              منتجاتنا المميزة
            </h2>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-gray-600 text-sm">اكتشف أشهى المنتجات المختارة بعناية</p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <button
              onClick={goToPrevious}
              className="hidden md:flex items-center justify-center w-7 h-7 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Previous"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-2 md:gap-3 overflow-hidden">
              <AnimatePresence mode="wait">
                {visibleProducts.map((product, idx) => {
                  const isCenter = featuredProducts.length >= 3 ? idx === 1 : idx === currentIndex;

                  return (
                    <motion.div
                      key={`${product.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: isCenter ? 1 : 0.5,
                        scale: isCenter ? 1 : 0.85,
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className={`relative bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all ${
                        isCenter ? 'w-full md:w-45' : 'hidden md:block w-36'
                      }`}
                      onClick={() => isCenter && onProductClick(product)}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="w-full h-full object-cover rounded-t-xl"
                        />
                        <div className="absolute top-1.5 right-1.5">
                          <div className="bg-amber-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-lg">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            <span className="text-xs font-bold">مميز</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="text-base font-bold text-gray-900 text-right mb-1">
                          {product.product_name}
                        </h3>
                        <p className="text-gray-600 text-xs text-right mb-2 line-clamp-2">
                          {product.special_description}
                        </p>
                        <div className="flex items-center justify-between">
                          <button className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold hover:shadow-lg transition-all hover:scale-105">
                            اطلب الآن
                          </button>
                          <span className="text-lg font-bold text-amber-600">
                            {product.product_price.toFixed(2)} د.أ
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <button
              onClick={goToNext}
              className="hidden md:flex items-center justify-center w-7 h-7 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Next"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="flex justify-center gap-1 mt-3">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? 'w-4 h-1.5 bg-amber-500'
                    : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="md:hidden flex gap-2 justify-center mt-3">
          <button
            onClick={goToPrevious}
            className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
