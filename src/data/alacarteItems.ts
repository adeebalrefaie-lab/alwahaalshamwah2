export interface AlaCarteItem {
  id: string;
  nameAr: string;
  category: 'daily' | 'dry' | 'giftbox';
  pricePerKgJOD?: number;
  fixedWeightKg?: number;
  fixedPriceJOD?: number;
  imagePlaceholder?: string;
}

export interface WeightOption {
  id: string;
  nameAr: string;
  weightKg: number;
}

export const weightOptions: WeightOption[] = [
  { id: 'waqiya', nameAr: 'وقية', weightKg: 0.25 },
  { id: 'half-kg', nameAr: 'نصف كيلو', weightKg: 0.5 },
  { id: '1-kg', nameAr: 'كيلو', weightKg: 1 },
  { id: '1.5-kg', nameAr: 'كيلو ونصف', weightKg: 1.5 },
  { id: '2-kg', nameAr: '2 كيلو', weightKg: 2 },
];

export const alacarteItems: AlaCarteItem[] = [
  // Category: اليوميات (Daily Sweets)
  { id: 'harissa-nuts', nameAr: 'هريسة مكسرات', category: 'daily', pricePerKgJOD: 5.50, imagePlaceholder: '/assets/sweets/هريسة_بالمكسرات.jpg' },
  { id: 'harissa-qashta', nameAr: 'هريسة بالقشطة', category: 'daily', pricePerKgJOD: 5.50, imagePlaceholder: '/assets/sweets/هريسة_قشطة.jpg' },
  { id: 'halawet-jibn', nameAr: 'حلاوة الجبن', category: 'daily', pricePerKgJOD: 5.50, imagePlaceholder: '/assets/sweets/حلاوة_الجبن.jpg' },
  { id: 'warbat-qashta', nameAr: 'وربات بالقشطة', category: 'daily', pricePerKgJOD: 4.50, imagePlaceholder: '/assets/sweets/وربات_بالقشطة.jpg' },
  { id: 'harissa-plain', nameAr: 'هريسة سادة', category: 'daily', pricePerKgJOD: 4.50, imagePlaceholder: '/assets/sweets/هريسة_سادة.jpg' },
  { id: 'greek', nameAr: 'يونانية', category: 'daily', pricePerKgJOD: 6.50, imagePlaceholder: '/assets/sweets/يونانية.jpg' },
  { id: 'harissa-nutella', nameAr: 'هريسة نوتيلا', category: 'daily', pricePerKgJOD: 7.00, imagePlaceholder: '/assets/sweets/هريسة_نوتيلا.jpg' },
  { id: 'cashew-nutella', nameAr: 'أصابع كاجو بالنوتيلا', category: 'daily', pricePerKgJOD: 6.50, imagePlaceholder: '/assets/sweets/أصابع_كاجو_بالنوتيلا.jpg' },
  { id: 'walnut-fingers', nameAr: 'أصابع جوز', category: 'daily', pricePerKgJOD: 7.50, imagePlaceholder: '/assets/sweets/أصابع_جوز.jpg' },
  { id: 'turkish-cake', nameAr: 'كيكة تركية', category: 'daily', pricePerKgJOD: 5.00, imagePlaceholder: '/assets/sweets/كيكة_تركية.jpg' },
  { id: 'osh-lotus', nameAr: 'عش هنا لوتس', category: 'daily', pricePerKgJOD: 10.00, imagePlaceholder: '/assets/sweets/عش_الهنا.jpg' },
  { id: 'osh-nutella', nameAr: 'عش هنا نوتيلا', category: 'daily', pricePerKgJOD: 10.00, imagePlaceholder: '/assets/sweets/عش_الهنا.jpg' },
  { id: 'tem-samaka', nameAr: 'تم السمكة', category: 'daily', pricePerKgJOD: 16.00, imagePlaceholder: '/assets/sweets/تم_السمكة.jpg' },

  // Category: النواشف (Dry Sweets)
  { id: 'barazek', nameAr: 'برازق', category: 'dry', pricePerKgJOD: 7.00 },
  { id: 'ghraybeh', nameAr: 'غريبة', category: 'dry', pricePerKgJOD: 8.00 },
  { id: 'maamoul', nameAr: 'معمول بالتمر', category: 'dry', pricePerKgJOD: 8.00 },
  { id: 'mixed-dry', nameAr: 'مشكل برازق معمول غريبة', category: 'dry', pricePerKgJOD: 8.00 },

  // Category: علب هدايا مشكل (Assorted Gift Boxes)
  { id: 'giftbox-small', nameAr: 'علبة مشكل صغيرة', category: 'giftbox', fixedWeightKg: 0.6, fixedPriceJOD: 12.00, imagePlaceholder: '/assets/sweets/علبة_مشكل_صغيرة.jpg' },
  { id: 'giftbox-medium', nameAr: 'علبة مشكل وسط', category: 'giftbox', fixedWeightKg: 0.85, fixedPriceJOD: 17.00 },
  { id: 'giftbox-large', nameAr: 'علبة مشكل كبيرة هدايا', category: 'giftbox', fixedWeightKg: 1.0, fixedPriceJOD: 22.00, imagePlaceholder: '/assets/sweets/علبة_مشكل_كبيرة.jpg' },
];

export const getCategoryItems = (category: 'daily' | 'dry' | 'giftbox') => {
  return alacarteItems.filter(item => item.category === category);
};

export const getCategoryNameAr = (category: 'daily' | 'dry' | 'giftbox'): string => {
  if (category === 'daily') return 'اليوميات';
  if (category === 'dry') return 'النواشف';
  return 'علب هدايا مشكل';
};
