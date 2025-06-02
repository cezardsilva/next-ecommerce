'use client';

import { XSquareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderCanceled() {
  return (
    <div className=' text-gray-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-gray-200 border-2 p-8 rounded-lg shadow-lg'>
        <div className='text-center mb-8'>
          <XSquareIcon className='w-20 h-20 text-red-400 mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-purple-500 mb-2'>
            Order Canceled
          </h1>
          <p className='text-gray-400'>
            Your order has been canceled successfully.
          </p>
        </div>

        <div className='text-center space-y-4'>
          <div className='space-x-4'>
            <Link href='/' passHref>
              <Button className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}