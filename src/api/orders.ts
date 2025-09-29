import axios from './axios';
import type {
  CreateOrderResponse,
  OrderInput,
  OrdersBulkInfoResponse,
} from '../types';

export async function createOrder(
  payload: OrderInput
): Promise<CreateOrderResponse> {
  const res = await axios.post('/orders', payload);
  return res.data as CreateOrderResponse;
}

export async function getOrdersBulkInfo(
  orderIds: string | string[]
): Promise<OrdersBulkInfoResponse> {
  const res = await axios.post('/orders/bulk-info', { orderIds });
  return res.data as OrdersBulkInfoResponse;
}
