'use server';
import { fetchApiClient } from '@/lib/oneentry';

// Server action to fetch related products
export const getRelatedProducts = async (pageId: number, productId: number) => {
  const apiClient = await fetchApiClient();

  if (!pageId) {
    throw new Error('Product ID is required to fetch related products.');
  }

  try {
    const products = await apiClient?.Products.getProductsByPageId(
      pageId,
      undefined,
      'en_US',
      {
        limit: 5,
        offset: 0,
        sortOrder: null,
        sortKey: null,
      }
    );

    const relatedProducts = [];

    for (let i = 0; i < products?.total; i++) {
      if (relatedProducts.length < 4) {
        if (products?.items[i].id !== productId)
          relatedProducts.push(products?.items[i]);
      } else {
        break;
      }
    }

    return relatedProducts;
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    throw new Error('Failed to fetch related products.');
  }
};