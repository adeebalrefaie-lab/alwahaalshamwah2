import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sweets } from '../data/sweets';
import { alacarteItems } from '../data/alacarteItems';

interface FeaturedProduct {
  id: string;
  product_id: string;
  product_type: 'sweet' | 'alacarte';
  special_description: string;
  display_order: number;
  product_name: string;
  product_image: string;
  product_price: number;
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
        .from('featured_products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      const enrichedProducts: FeaturedProduct[] = (data || []).map(fp => {
        if (fp.product_type === 'sweet') {
          const sweet = sweets.find(s => s.id === fp.product_id);
          return {
            ...fp,
            product_name: sweet?.nameAr || '',
            product_image: sweet?.image || '',
            product_price: sweet?.priceJOD || 0
          };
        } else {
          const item = alacarteItems.find(i => i.id === fp.product_id);
          return {
            ...fp,
            product_name: item?.nameAr || '',
            product_image: item?.image || '',
            product_price: item?.pricePerKgJOD || item?.fixedPriceJOD || 0
          };
        }
      }).filter(fp => fp.product_name);

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
    }, 2000);

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
    <div className="relative w-full bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-12 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNiIgZmlsbD0iI0ZGQjMzMyIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-30" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              منتجاتنا المميزة
            </h2>
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-gray-600 text-lg">اكتشف أشهى المنتجات المختارة بعناية</p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <button
              onClick={goToPrevious}
              className="hidden md:flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Previous"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-4 md:gap-6 overflow-hidden">
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
                      className={`relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all ${
                        isCenter ? 'w-full md:w-80' : 'hidden md:block w-64'
                      }`}
                      onClick={() => isCenter && onProductClick(product)}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <div className="bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Star className="w-4 h-4 fill-white" />
                            <span className="text-sm font-bold">مميز</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 text-right mb-2">
                          {product.product_name}
                        </h3>
                        <p className="text-gray-600 text-sm text-right mb-4 line-clamp-2">
                          {product.special_description}
                        </p>
                        <div className="flex items-center justify-between">
                          <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105">
                            اطلب الآن
                          </button>
                          <span className="text-2xl font-bold text-amber-600">
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
              className="hidden md:flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Next"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-3 bg-amber-500'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="md:hidden flex gap-4 justify-center mt-6">
          <button
            onClick={goToPrevious}
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
