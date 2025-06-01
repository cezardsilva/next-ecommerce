'use server';

import { fetchApiClient } from '@/lib/oneentry';
import { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

export const getCatalogs = async (): Promise<IPagesEntity[]> => {
  try {
    const apiClient = await fetchApiClient();
    const pages = await apiClient?.Pages.getRootPages('en_US');

    const catalogPages = pages?.filter(
      (page: { type: string }) => page.type === 'catalog_page'
    );

    // Always return an array
    return catalogPages?.length ? catalogPages : [];
  } catch (error) {
    console.error({ error });
    return []; // In case of error, return an empty array
  }
};