import type { PrefillResponse } from '../types';
import axios from './axios';

export async function prefillCustomer(
  email: string,
  phone: string
): Promise<PrefillResponse> {
  const res = await axios.post('/customers/prefill', { email, phone });
  return res.data as PrefillResponse;
}
