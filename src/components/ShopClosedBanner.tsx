import { AlertCircle, Clock } from 'lucide-react';
import { useShopStatus } from '../hooks/useShopStatus';

export default function ShopClosedBanner() {
  const { isOpen, reason, nextOpenTime, loading } = useShopStatus();

  if (loading || isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          المحل مغلق حالياً
        </h2>

        {reason === 'manual' && (
          <p className="text-gray-600 mb-6">
            نعتذر، المحل مغلق مؤقتاً. يرجى المحاولة لاحقاً.
          </p>
        )}

        {reason === 'hours' && (
          <div className="space-y-3 mb-6">
            <p className="text-gray-600">
              نعتذر، المحل مغلق خارج أوقات العمل.
            </p>
            {nextOpenTime && (
              <div className="flex items-center justify-center gap-2 text-amber-700 bg-amber-50 py-2 px-4 rounded-lg">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">
                  موعد الفتح: {nextOpenTime}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-semibold mb-2">للتواصل:</p>
          <p>يمكنكم الاتصال بنا على رقم الهاتف</p>
        </div>
      </div>
    </div>
  );
}
