export interface Container {
  id: string;
  type: 'box' | 'tray';
  nameAr: string;
  nameEn: string;
  heightCm: number;
  widthCm: number;
  basePriceJOD: number;
}

export const REFERENCE_HEIGHT_CM = 17;

export const containers: Container[] = [
  {
    id: 'box-1',
    type: 'box',
    nameAr: 'علبة صغيرة',
    nameEn: 'Small Box',
    heightCm: 17,
    widthCm: 30,
    basePriceJOD: 1.0,
  },
  {
    id: 'box-2',
    type: 'box',
    nameAr: 'علبة وسط',
    nameEn: 'Medium Box',
    heightCm: 19.5,
    widthCm: 33.5,
    basePriceJOD: 1.0,
  },
  {
    id: 'box-3',
    type: 'box',
    nameAr: 'علبة جلد',
    nameEn: 'Leather Box',
    heightCm: 21.5,
    widthCm: 38,
    basePriceJOD: 2.5,
  },
  {
    id: 'tray-1',
    type: 'tray',
    nameAr: 'صحن صغير',
    nameEn: 'Small Tray',
    heightCm: 15,
    widthCm: 21,
    basePriceJOD: 0.0,
  },
  {
    id: 'tray-2',
    type: 'tray',
    nameAr: 'صحن وسط',
    nameEn: 'Medium Tray',
    heightCm: 20,
    widthCm: 28,
    basePriceJOD: 0.0,
  },
  {
    id: 'tray-3',
    type: 'tray',
    nameAr: 'صحن كبير',
    nameEn: 'Large Tray',
    heightCm: 24,
    widthCm: 31,
    basePriceJOD: 0.0,
  },
  {
    id: 'tray-4',
    type: 'tray',
    nameAr: 'صحن كبير جداً',
    nameEn: 'XL Tray',
    heightCm: 26.5,
    widthCm: 34,
    basePriceJOD: 0.0,
  },
];

export function calculateScaledWeight(baseWeightGrams: number, containerHeight: number): number {
  return Math.round(baseWeightGrams * (containerHeight / REFERENCE_HEIGHT_CM));
}

export function calculateScaledPrice(basePriceJOD: number, containerHeight: number): number {
  const scaled = basePriceJOD * (containerHeight / REFERENCE_HEIGHT_CM);
  return Math.round(scaled * 100) / 100;
}
