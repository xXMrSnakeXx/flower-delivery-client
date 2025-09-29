import axios from './axios';
import type { GetProductsOptions, Product } from '../types';

export async function getProductsByShop(
  shopId: string,
  opts?: GetProductsOptions
): Promise<Product[]> {
  if (!shopId) return [];
  const params: Record<string, string> = {};
  if (opts?.sort) params.sort = opts.sort;
  if (opts?.order) params.order = opts.order;
  if (opts?.search) params.search = opts.search;
  const q = new URLSearchParams(params).toString();
  const url = `/shops/${shopId}/products${q ? `?${q}` : ''}`;
  const res = await axios.get(url);
  return res.data as Product[];
}

export async function getProductById(productId: string): Promise<Product> {
  const res = await axios.get(`/products/${productId}`);
  return res.data as Product;
}
