import { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { supabase, ProductAvailability } from '../lib/supabase';
import { alacarteItems, getCategoryNameAr } from '../data/alacarteItems';
import { sweets } from '../data/sweets';
import { LogOut, Package, RefreshCw, Star, Trash2, Home } from 'lucide-react';
import { ShopSettingsPanel } from './ShopSettingsPanel';
import FeaturedProductModal from './FeaturedProductModal';

interface FeaturedProduct {
  id: string;
  product_id: string;
  product_type: 'sweet' | 'alacarte';
  special_description: string;
  display_order: number;
}

interface AdminDashboardProps {
  onGoHome?: () => void;
}

export const AdminDashboard = ({ onGoHome }: AdminDashboardProps = {}) => {
  const { signOut, user } = useAdminAuth();
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    image: string;
    type: 'sweet' | 'alacarte';
  } | null>(null);
  const [removingFeatured, setRemovingFeatured] = useState<string | null>(null);

  useEffect(() => {
    loadAvailability();
    loadFeaturedProducts();
  }, []);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_availability')
        .select('*');

      if (error) throw error;

      const availabilityMap: Record<string, boolean> = {};
      data?.forEach((item: ProductAvailability) => {
        availabilityMap[item.product_id] = item.is_available;
      });

      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('product_featured_status')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    if (!user) return;

    setUpdating(productId);
    const newStatus = !currentStatus;

    try {
      const { data: existing } = await supabase
        .from('product_availability')
        .select('id')
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('product_availability')
          .update({
            is_available: newStatus,
            updated_at: new Date().toISOString(),
            updated_by: user.id,
          })
          .eq('product_id', productId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_availability')
          .insert({
            product_id: productId,
            is_available: newStatus,
            updated_by: user.id,
          });

        if (error) throw error;
      }

      setAvailability((prev) => ({
        ...prev,
        [productId]: newStatus,
      }));
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('حدث خطأ أثناء تحديث حالة المنتج');
    } finally {
      setUpdating(null);
    }
  };

  const getAvailabilityStatus = (productId: string) => {
    return availability[productId] !== undefined ? availability[productId] : true;
  };

  const handleAddToFeatured = (productId: string, name: string, image: string, type: 'sweet' | 'alacarte') => {
    setSelectedProduct({ id: productId, name, image, type });
    setFeaturedModalOpen(true);
  };

  const handleRemoveFromFeatured = async (featuredId: string) => {
    if (!confirm('هل تريد إزالة هذا المنتج من المنتجات المميزة؟')) return;

    setRemovingFeatured(featuredId);
    try {
      const { error } = await supabase
        .from('product_featured_status')
        .update({ is_featured: false })
        .eq('id', featuredId);

      if (error) throw error;

      await loadFeaturedProducts();
    } catch (error) {
      console.error('Error removing featured product:', error);
      alert('حدث خطأ أثناء إزالة المنتج من المميزة');
    } finally {
      setRemovingFeatured(null);
    }
  };

  const getProductDetails = (productId: string, productType: 'sweet' | 'alacarte') => {
    if (productType === 'sweet') {
      const sweet = sweets.find(s => s.id === productId);
      return sweet ? { name: sweet.nameAr, image: sweet.image, price: sweet.priceJOD } : null;
    } else {
      const item = alacarteItems.find(i => i.id === productId);
      return item ? {
        name: item.nameAr,
        image: item.image,
        price: item.pricePerKgJOD || item.fixedPriceJOD
      } : null;
    }
  };

  const isFeatured = (productId: string, productType: 'sweet' | 'alacarte') => {
    return featuredProducts.some(fp => fp.product_id === productId && fp.product_type === productType);
  };

  const groupedItems = alacarteItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof alacarteItems>);

  const sweetsCategory = {
    sweets: sweets.map(sweet => ({
      id: sweet.id,
      nameAr: sweet.nameAr,
      pricePerKgJOD: undefined,
      fixedPriceJOD: sweet.priceJOD,
      category: 'sweets' as const,
    }))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-sm text-gray-600">إدارة توفر المنتجات</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onGoHome && (
                <button
                  onClick={onGoHome}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>العودة للموقع</span>
                </button>
              )}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {featuredProducts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-white fill-white" />
                <h2 className="text-xl font-bold text-white text-right">
                  المنتجات المميزة
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredProducts.map((featured) => {
                    const productDetails = getProductDetails(featured.product_id, featured.product_type);
                    if (!productDetails) return null;

                    return (
                      <div
                        key={featured.id}
                        className="relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <button
                          onClick={() => handleRemoveFromFeatured(featured.id)}
                          disabled={removingFeatured === featured.id}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 z-10"
                          title="إزالة من المميزة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex gap-4">
                          <img
                            src={productDetails.image}
                            alt={productDetails.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1 text-right">
                            <h3 className="font-semibold text-gray-900">{productDetails.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {productDetails.price?.toFixed(2)} دينار
                            </p>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                              {featured.special_description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <ShopSettingsPanel />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white text-right">
                حلويات العلبة المخصصة
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {sweetsCategory.sweets.map((item) => {
                  const isAvailable = getAvailabilityStatus(item.id);
                  const isUpdating = updating === item.id;
                  const sweet = sweets.find(s => s.id === item.id);
                  const featured = isFeatured(item.id, 'sweet');

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 text-right">
                        <h3 className="font-semibold text-gray-900">{item.nameAr}</h3>
                        <p className="text-sm text-gray-600">
                          {item.fixedPriceJOD?.toFixed(2)} دينار
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {!featured && sweet && (
                          <button
                            onClick={() => handleAddToFeatured(item.id, item.nameAr, sweet.image, 'sweet')}
                            className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                            title="إضافة للمميزة"
                          >
                            <Star className="w-4 h-4" />
                            <span>مميز</span>
                          </button>
                        )}
                        <button
                          onClick={() => toggleAvailability(item.id, isAvailable)}
                          disabled={isUpdating}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                            isAvailable
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-500 hover:bg-red-600'
                          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              isAvailable ? 'translate-x-1' : 'translate-x-9'
                            }`}
                          />
                          <span className="sr-only">
                            {isAvailable ? 'متوفر' : 'غير متوفر'}
                          </span>
                        </button>
                        <div className="ml-3 min-w-[100px] text-left">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isAvailable ? 'متوفر' : 'غير متوفر'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white text-right">
                  {getCategoryNameAr(category as 'daily' | 'dry' | 'giftbox')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {items.map((item) => {
                    const isAvailable = getAvailabilityStatus(item.id);
                    const isUpdating = updating === item.id;
                    const featured = isFeatured(item.id, 'alacarte');

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 text-right">
                          <h3 className="font-semibold text-gray-900">{item.nameAr}</h3>
                          <p className="text-sm text-gray-600">
                            {item.pricePerKgJOD
                              ? `${item.pricePerKgJOD.toFixed(2)} دينار / كغ`
                              : `${item.fixedPriceJOD?.toFixed(2)} دينار`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {!featured && (
                            <button
                              onClick={() => handleAddToFeatured(item.id, item.nameAr, item.image, 'alacarte')}
                              className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                              title="إضافة للمميزة"
                            >
                              <Star className="w-4 h-4" />
                              <span>مميز</span>
                            </button>
                          )}
                          <button
                            onClick={() => toggleAvailability(item.id, isAvailable)}
                            disabled={isUpdating}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                              isAvailable
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-red-500 hover:bg-red-600'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                isAvailable ? 'translate-x-1' : 'translate-x-9'
                              }`}
                            />
                            <span className="sr-only">
                              {isAvailable ? 'متوفر' : 'غير متوفر'}
                            </span>
                          </button>
                          <div className="ml-3 min-w-[100px] text-left">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                isAvailable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {isAvailable ? 'متوفر' : 'غير متوفر'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <FeaturedProductModal
          isOpen={featuredModalOpen}
          onClose={() => {
            setFeaturedModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSuccess={loadFeaturedProducts}
        />
      )}
    </div>
  );
};
