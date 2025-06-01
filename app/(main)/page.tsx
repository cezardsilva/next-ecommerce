'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCatalogWithProducts } from '@/actions/catalog/getCatalogWithProducts';

import ProductCatalog from '@/components/productCatalog';
import { ICatalog } from '@/types/catalog';
import { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

export default function HomePage() {
  const [products, setProducts] = useState<ICatalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const catalogs = await getCatalogWithProducts();

      if (catalogs?.length) {
        const transformedCatalogs = catalogs.map((catalog) => ({
          ...catalog,
          catalogProducts: {
            items: catalog.catalogProducts.items.map(
              (item: { localizeInfos: { title: string } }) => ({
                ...item,
                localizeInfos: {
                  title: item.localizeInfos?.title || 'Default Title',
                },
              })
            ),
          },
        }));
        setProducts(transformedCatalogs);
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <div className='min-h-screen'>
      <main className='container mx-auto px-4 py-8'>
        <section className='mb-12 '>
          <div className='relative overflow-hidden rounded-lg shadow-lg '>
            <div className='w-full h-[400px] relative'>
              <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-8'>
                <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent z-3'>
                  Welcome to our Store!
                </h2>
                <p className='text-xl mb-8 text-gray-700 z-4'>
                  Discover the latest trends and exclusive deals on your
                  favorite products. Shop now and enjoy a seamless shopping
                  experience!
                </p>
                <img
                  src='https://assets.entrepreneur.com/content/3x2/2000/20150812074510-Online-shopping.jpeg?format=pjeg&auto=webp&crop=16:9&width=675&height=380'
                  alt='Hero Image'
                  className='absolute inset-0 w-full h-full object-cover opacity-20 z-1'
                />
                <Button className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white z-2 cursor-pointer'>
                  Shop Now
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </section>
        {isLoading && (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
          </div>
        )}
        {products.map((catalog) => (
          <ProductCatalog
            key={catalog?.id}
            title={catalog?.localizeInfos?.title as string}
            products={
              catalog.catalogProducts.items as unknown as IProductsEntity[]
            }
          />
        ))}
      </main>
    </div>
  );
}