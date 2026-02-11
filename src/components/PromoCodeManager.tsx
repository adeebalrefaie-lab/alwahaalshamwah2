import { useState } from 'react';
import { Tag, Plus, Trash2, RefreshCw } from 'lucide-react';
import { usePromoCodes, type PromoCode } from '../hooks/usePromoCodes';

interface PromoCodeManagerProps {
  userId: string;
}

const DISCOUNT_OPTIONS = [10, 20, 30, 40, 50];

export default function PromoCodeManager({ userId }: PromoCodeManagerProps) {
  const { promoCodes, loading, addPromoCode, updatePromoCode, deletePromoCode } = usePromoCodes(userId);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(10);
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newCode.trim()) return;
    if (promoCodes.length >= 4) {
      alert('الحد الأقصى 4 أكواد خصم');
      return;
    }
    setAdding(true);
    const { error } = await addPromoCode(newCode, newDiscount);
    if (error) {
      alert(error.message.includes('duplicate') ? 'هذا الكود موجود مسبقاً' : 'حدث خطأ أثناء الإضافة');
    } else {
      setNewCode('');
      setNewDiscount(10);
    }
    setAdding(false);
  };

  const handleToggleActive = async (promo: PromoCode) => {
    setUpdatingId(promo.id);
    await updatePromoCode(promo.id, { is_active: !promo.is_active });
    setUpdatingId(null);
  };

  const handleDiscountChange = async (promo: PromoCode, percentage: number) => {
    setUpdatingId(promo.id);
    await updatePromoCode(promo.id, { discount_percentage: percentage });
    setUpdatingId(null);
  };

  const handleCodeChange = async (promo: PromoCode, code: string) => {
    if (!code.trim()) return;
    setUpdatingId(promo.id);
    const { error } = await updatePromoCode(promo.id, { code });
    if (error) {
      alert(error.message.includes('duplicate') ? 'هذا الكود موجود مسبقاً' : 'حدث خطأ');
    }
    setUpdatingId(null);
  };

  const handleExpiryChange = async (promo: PromoCode, dateStr: string) => {
    setUpdatingId(promo.id);
    await updatePromoCode(promo.id, {
      expires_at: dateStr ? new Date(dateStr).toISOString() : null,
    });
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذا الكود؟')) return;
    setDeletingId(id);
    await deletePromoCode(id);
    setDeletingId(null);
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white text-right">
            أكواد الخصم
          </h2>
          <span className="bg-white/20 text-white text-sm px-2 py-0.5 rounded-full">
            {promoCodes.length}/4
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {promoCodes.map((promo) => (
          <PromoCodeSlot
            key={promo.id}
            promo={promo}
            isUpdating={updatingId === promo.id}
            isDeleting={deletingId === promo.id}
            onToggleActive={() => handleToggleActive(promo)}
            onDiscountChange={(pct) => handleDiscountChange(promo, pct)}
            onCodeChange={(code) => handleCodeChange(promo, code)}
            onExpiryChange={(date) => handleExpiryChange(promo, date)}
            onDelete={() => handleDelete(promo.id)}
          />
        ))}

        {promoCodes.length < 4 && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  كود جديد
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="مثال: SALE20"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-left uppercase tracking-wider font-mono"
                  maxLength={20}
                  dir="ltr"
                />
              </div>
              <div className="w-full sm:w-36">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  نسبة الخصم
                </label>
                <select
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {DISCOUNT_OPTIONS.map((pct) => (
                    <option key={pct} value={pct}>
                      {pct}%
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAdd}
                disabled={adding || !newCode.trim()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {adding ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>إضافة</span>
              </button>
            </div>
          </div>
        )}

        {promoCodes.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            لا توجد أكواد خصم حالياً. أضف كود جديد أعلاه.
          </p>
        )}
      </div>
    </div>
  );
}

interface PromoCodeSlotProps {
  promo: PromoCode;
  isUpdating: boolean;
  isDeleting: boolean;
  onToggleActive: () => void;
  onDiscountChange: (pct: number) => void;
  onCodeChange: (code: string) => void;
  onExpiryChange: (date: string) => void;
  onDelete: () => void;
}

function PromoCodeSlot({
  promo,
  isUpdating,
  isDeleting,
  onToggleActive,
  onDiscountChange,
  onCodeChange,
  onExpiryChange,
  onDelete,
}: PromoCodeSlotProps) {
  const [editingCode, setEditingCode] = useState(promo.code);
  const [isEditing, setIsEditing] = useState(false);

  const isExpired = promo.expires_at && new Date(promo.expires_at) <= new Date();

  const handleCodeBlur = () => {
    setIsEditing(false);
    if (editingCode.trim() && editingCode.toUpperCase() !== promo.code) {
      onCodeChange(editingCode);
    } else {
      setEditingCode(promo.code);
    }
  };

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        promo.is_active && !isExpired
          ? 'border-teal-300 bg-teal-50/50'
          : 'border-gray-200 bg-gray-50'
      } ${isUpdating || isDeleting ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onToggleActive}
            className={`relative inline-flex h-7 w-14 flex-shrink-0 items-center rounded-full transition-colors ${
              promo.is_active
                ? 'bg-teal-500 hover:bg-teal-600'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                promo.is_active ? 'translate-x-1' : 'translate-x-8'
              }`}
            />
          </button>

          {isEditing ? (
            <input
              type="text"
              value={editingCode}
              onChange={(e) => setEditingCode(e.target.value.toUpperCase())}
              onBlur={handleCodeBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeBlur()}
              className="flex-1 px-3 py-1.5 border border-teal-400 rounded-lg font-mono text-left uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500"
              dir="ltr"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 text-left font-mono text-lg font-bold tracking-wider text-gray-800 hover:text-teal-600 transition-colors"
              dir="ltr"
            >
              {promo.code}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={promo.discount_percentage}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
            className="px-2 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold"
          >
            {DISCOUNT_OPTIONS.map((pct) => (
              <option key={pct} value={pct}>
                {pct}%
              </option>
            ))}
          </select>

          <input
            type="date"
            value={promo.expires_at ? promo.expires_at.slice(0, 10) : ''}
            onChange={(e) => onExpiryChange(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            placeholder="تاريخ الانتهاء"
          />

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs">
        <span
          className={`px-2 py-0.5 rounded-full font-medium ${
            promo.is_active && !isExpired
              ? 'bg-teal-100 text-teal-700'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {promo.is_active ? (isExpired ? 'منتهي الصلاحية' : 'مفعّل') : 'معطّل'}
        </span>
        <span className="text-gray-400">
          خصم {promo.discount_percentage}%
        </span>
        {promo.expires_at && (
          <span className={`${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
            ينتهي: {new Date(promo.expires_at).toLocaleDateString('ar-JO')}
          </span>
        )}
      </div>
    </div>
  );
}
