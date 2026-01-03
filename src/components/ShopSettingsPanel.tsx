import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Store, RefreshCw } from 'lucide-react';

interface ShopSettings {
  id: string;
  is_open: boolean;
  shop_name: string;
}

interface WorkingHours {
  id: string;
  day_of_week: number;
  day_name_ar: string;
  is_closed: boolean;
  opening_time: string;
  closing_time: string;
}

export const ShopSettingsPanel = () => {
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [settingsResult, hoursResult] = await Promise.all([
        supabase.from('shop_settings').select('*').single(),
        supabase.from('working_hours').select('*').order('day_of_week'),
      ]);

      if (settingsResult.data) {
        setShopSettings(settingsResult.data);
      }

      if (hoursResult.data) {
        setWorkingHours(hoursResult.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleShopStatus = async () => {
    if (!shopSettings) return;

    setUpdating(true);
    try {
      const newStatus = !shopSettings.is_open;
      const { error } = await supabase
        .from('shop_settings')
        .update({ is_open: newStatus })
        .eq('id', shopSettings.id);

      if (error) throw error;

      setShopSettings({ ...shopSettings, is_open: newStatus });
    } catch (error) {
      console.error('Error updating shop status:', error);
      alert('حدث خطأ أثناء تحديث حالة المحل');
    } finally {
      setUpdating(false);
    }
  };

  const updateWorkingHours = async (
    dayId: string,
    field: 'is_closed' | 'opening_time' | 'closing_time',
    value: boolean | string
  ) => {
    try {
      const { error } = await supabase
        .from('working_hours')
        .update({ [field]: value })
        .eq('id', dayId);

      if (error) throw error;

      setWorkingHours((prev) =>
        prev.map((day) =>
          day.id === dayId ? { ...day, [field]: value } : day
        )
      );
    } catch (error) {
      console.error('Error updating working hours:', error);
      alert('حدث خطأ أثناء تحديث ساعات العمل');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white text-right">حالة المحل</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {shopSettings?.shop_name}
              </h3>
              <p className="text-sm text-gray-600">
                تحكم بحالة المحل (مفتوح/مغلق)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  shopSettings?.is_open
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {shopSettings?.is_open ? 'مفتوح' : 'مغلق'}
              </span>
              <button
                onClick={toggleShopStatus}
                disabled={updating}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  shopSettings?.is_open
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                    shopSettings?.is_open ? 'translate-x-1' : 'translate-x-11'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white text-right">
              ساعات العمل
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                    اليوم
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                    وقت الفتح
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                    وقت الإغلاق
                  </th>
                </tr>
              </thead>
              <tbody>
                {workingHours.map((day) => (
                  <tr
                    key={day.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {day.day_name_ar}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() =>
                          updateWorkingHours(day.id, 'is_closed', !day.is_closed)
                        }
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                          !day.is_closed
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            !day.is_closed ? 'translate-x-1' : 'translate-x-8'
                          }`}
                        />
                      </button>
                      <span className="mr-2 text-xs text-gray-600">
                        {day.is_closed ? 'مغلق' : 'مفتوح'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="time"
                        value={day.opening_time}
                        disabled={day.is_closed}
                        onChange={(e) =>
                          updateWorkingHours(
                            day.id,
                            'opening_time',
                            e.target.value
                          )
                        }
                        className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          day.is_closed
                            ? 'bg-gray-100 cursor-not-allowed'
                            : 'bg-white'
                        }`}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="time"
                        value={day.closing_time}
                        disabled={day.is_closed}
                        onChange={(e) =>
                          updateWorkingHours(
                            day.id,
                            'closing_time',
                            e.target.value
                          )
                        }
                        className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          day.is_closed
                            ? 'bg-gray-100 cursor-not-allowed'
                            : 'bg-white'
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
