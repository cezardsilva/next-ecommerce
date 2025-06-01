'use server';
import { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { fetchApiClient } from '@/lib/oneentry';
import { getCatalogs } from './getCatalog';

export const getCatalogWithProducts = async () => {
  const apiClient = await fetchApiClient();
  const catalogs: IPagesEntity[] = await getCatalogs();

  const catalogWithProducts = [];
  if (catalogs) {
    for (const catalog of catalogs) {
      const products = await apiClient?.Products.getProductsByPageId(
        catalog.id,
        undefined,
        'en_US',
        {
          limit: 4,
          offset: 0,
          sortOrder: null,
          sortKey: null,
        }
      );
      catalogWithProducts.push({ ...catalog, catalogProducts: products });
    }
    return catalogWithProducts;
  }
};