import React from 'react';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import useCartStore from '@/stores/cartStore';
import { IProduct } from '@/types/product';
import { toast } from 'sonner';

const ProductCard = ({ product }: { product: IProduct }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = (product: IProduct) => {
    addToCart({
      id: product.id,
      name: product.attributeValues.p_title.value || 'Product',
      price: product.attributeValues.p_price.value || 0,
      quantity: 1,
      image: product.attributeValues.p_image.value.downloadLink,
    });
    toast('Added to Cart', {
      description: `${product.attributeValues.p_title.value} has been added to your cart.`,
      duration: 5000,
    });
  };
  return (
    <div>
      <div className='group relative  overflow-hidden group h-full flex flex-col rounded-lg shadow-lg border-2 border-gray-200 bg-white'>
        <Link
          href={`/product/${product.id}`}
          className='relative w-full pt-[100%] bg-transparent'
        >
          <img
            src={product.attributeValues.p_image.value.downloadLink}
            alt={product.attributeValues.p_title.value}
            className='
            absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 border-b-2 border-gray-200'
          />
        </Link>
        <div className='p-4 flex-grow'>
          <Link href={`/product/${product.id}`}>
            <h3 className='text-xl mb-2 text-gray-700 group-hover:text-purple-500 transition-colors duration-300 line-clamp-1'>
              {product.attributeValues.p_title.value}
            </h3>
          </Link>
          <div
            className='text-gray-500 line-clamp-2 text-sm mb-2'
            dangerouslySetInnerHTML={{
              __html: product.attributeValues.p_description.value[0].htmlValue,
            }}
          />
          <p className='text-gray-600'>
            ${product.attributeValues.p_price.value.toFixed(2)}
          </p>
        </div>
        <div className='p-4'>
          <Button
            className='w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className='w-5 h-5 mr-2' />
            Add to Cart
          </Button>
          <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;