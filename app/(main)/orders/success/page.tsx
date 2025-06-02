'use client';

import { CheckCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderSuccess() {
  return (
    <div className=' text-gray-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-gray-100 p-8 rounded-lg shadow-lg border-2'>
        <div className='text-center mb-8'>
          <CheckCheckIcon className='w-20 h-20 text-green-500 mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-purple-500 mb-2'>
            Order Successful!
          </h1>
          <p className='text-gray-400'>
            Your order has been placed and is being processed.
          </p>
        </div>

        <div className='space-y-4 mb-8'></div>

        <div className='text-center space-y-4'>
          <p className='text-gray-400 pb-5'>Thank you for your purchase!</p>
          <Link href='/'>
            <Button className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}