'use server';

import { fetchApiClient } from '@/lib/oneentry';
import { cookies } from 'next/headers';

export const getOrders = async () => {
  try {
    const apiClient = await fetchApiClient();
    const accessToken = (await cookies()).get('access_token')?.value;

    if (!accessToken) {
      throw new Error('Missing access token.');
    }

    const orders = await apiClient?.Orders.setAccessToken(
      accessToken
    ).getAllOrdersByMarker('orders');

    return orders;
  } catch (error) {
    console.error({ error });
  }
};