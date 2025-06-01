'use server';

import { fetchApiClient } from '@/lib/oneentry';

interface SearchParams {
  query: string;
}

export const searchProductsAction = async ({ query }: SearchParams) => {
  try {
    const apiClient = await fetchApiClient();

    const products = await apiClient?.Products.searchProduct(query, 'en_US');

    return products || []; // Return product items or empty array
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error(
      `Product search failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};