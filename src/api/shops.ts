import axios from './axios';
import type { Shop } from '../types';

export async function getShops(): Promise<Shop[]> {
  const res = await axios.get('/shops');
  return res.data as Shop[];
}

export async function getShopById(id: string): Promise<Shop> {
  const res = await axios.get(`/shops/${id}`);
  return res.data as Shop;
}
