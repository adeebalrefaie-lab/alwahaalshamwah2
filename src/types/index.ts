import { type Sweet } from '../data/sweets';
import { type AlaCarteItem } from '../data/alacarteItems';
import { type Container } from '../data/containers';

export interface BoxItem {
  id: string;
  sweet: Sweet;
  instanceId: string;
}

export interface AlaCarteCartItem {
  type: 'alacarte';
  id: string;
  item: AlaCarteItem;
  weightKg: number;
  weightLabel: string;
  totalPrice: number;
  instanceId: string;
}

export interface CustomBoxCartItem {
  type: 'custombox';
  id: string;
  container: Container;
  boxItems: BoxItem[];
  totalPrice: number;
  totalWeight: number;
  fillPercentage: number;
  instanceId: string;
}

export type UnifiedCartItem = AlaCarteCartItem | CustomBoxCartItem;

export interface CartItem {
  id: string;
  item: AlaCarteItem;
  weightKg: number;
  weightLabel: string;
  totalPrice: number;
  instanceId: string;
}
