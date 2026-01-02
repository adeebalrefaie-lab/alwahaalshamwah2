export interface Sweet {
  id: string;
  nameAr: string;
  widthCm: number;
  weightGrams: number;
  priceJOD: number;
  image: string;
  isSpecial?: boolean;
}

export const sweets: Sweet[] = [
  {
    id: 'harissa-cream',
    nameAr: 'هريسة القشطة',
    widthCm: 4.0,
    weightGrams: 190,
    priceJOD: 1.0,
    image: '/assets/sweets/harissa-qashta.webp',
  },
  {
    id: 'harissa-nuts',
    nameAr: 'هريسة بالمكسرات',
    widthCm: 5.5,
    weightGrams: 225,
    priceJOD: 1.25,
    image: '/assets/sweets/harissa-nuts.webp',
  },
  {
    id: 'greek',
    nameAr: 'يونانية',
    widthCm: 5.0,
    weightGrams: 220,
    priceJOD: 1.5,
    image: '/assets/sweets/greek.webp',
  },
  {
    id: 'nuts',
    nameAr: 'أصابع الجوز',
    widthCm: 9.0,
    weightGrams: 190,
    priceJOD: 2.5,
    image: '/assets/sweets/walnut-fingers.webp',
  },
  {
    id: 'ash-lotus',
    nameAr: 'عش الهنا لوتس',
    widthCm: 3.5,
    weightGrams: 70,
    priceJOD: 0.7,
    image: '/assets/sweets/osh-lotus.webp',
  },
  {
    id: 'ash-nutella',
    nameAr: 'عش الهنا نوتيلا',
    widthCm: 3.5,
    weightGrams: 70,
    priceJOD: 0.7,
    image: '/assets/sweets/osh-nutella.webp',
  },
  {
    id: 'cocoa-fingers',
    nameAr: 'أصابع كاجو',
    widthCm: 5.5,
    weightGrams: 160,
    priceJOD: 1.0,
    image: '/assets/sweets/cocoa-fingers.webp',
  },
  {
    id: 'harissa-nutella',
    nameAr: 'هريسة نوتيلا',
    widthCm: 4.25,
    weightGrams: 150,
    priceJOD: 1.0,
    image: '/assets/sweets/harissa-nutella.webp',
  },
  {
    id: 'halawet-jibn',
    nameAr: 'حلاوة الجبن',
    widthCm: 4.0,
    weightGrams: 190,
    priceJOD: 1.0,
    image: '/assets/sweets/halawet-jibn.webp',
  },
  {
    id: 'separator',
    nameAr: 'فاصل',
    widthCm: 0.5,
    weightGrams: 0,
    priceJOD: 0.05,
    image: '/assets/sweets/separator.webp',
    isSpecial: true,
  },
];

export const BOX_WIDTH_CM = 30;
export const BOX_HEIGHT_CM = 17;
export const BASE_BOX_PRICE = 1.0;
export const MIN_FILL_PERCENTAGE = 85;
export const MIN_FILL_CM = (BOX_WIDTH_CM * MIN_FILL_PERCENTAGE) / 100;
