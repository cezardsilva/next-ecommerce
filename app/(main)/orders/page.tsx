'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  XSquareIcon,
} from 'lucide-react';
import { getOrders } from '@/actions/orders/get-orders';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number | null;
}

interface OrderItem {
  id: number;
  createdDate: string;
  statusIdentifier: string;
  totalSum: string;
  products: Product[];
}

interface IOrder {
  items: OrderItem[];
  total: number;
}

const orderStatusIcons = {
  processing: <Package className='w-5 h-5 text-yellow-500' />,
  shipped: <Truck className='w-5 h-5 text-blue-500' />,
  delivered: <CheckCircle className='w-5 h-5 text-green-500' />,
  cancelled: <AlertCircle className='w-5 h-5 text-red-500' />,
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<IOrder>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulating API call to fetch orders
    const fetchOrders = async () => {
      const data = await getOrders();
      console.log({ data });
      if (data !== undefined)
        setOrders({ items: data.items.reverse(), total: data.total });
      else setOrders({ total: 0, items: [] });
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-12  bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          My Orders
        </h1>

        {isLoading ? (
          <div className='flex items-center justify-center pt-7'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
          </div>
        ) : (
          <>
            {orders?.items?.map((order) => (
              <div
                key={order.id}
                className='bg-gray-100 rounded-lg shadow-lg mb-6 overflow-hidden border-2'
              >
                <div className='p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-semibold text-purple-500'>
                      Order #{order.id}
                    </h2>
                    <Badge className={` text-white bg-purple-900`}>
                      {
                        orderStatusIcons[
                          order.statusIdentifier as keyof typeof orderStatusIcons
                        ]
                      }
                      <span className='ml-2 capitalize'>
                        {order.statusIdentifier}
                      </span>
                    </Badge>
                  </div>
                  <div className='flex justify-between text-gray-600 mb-4'>
                    <span>
                      Order Date: {order.createdDate.split('T').shift()}
                    </span>
                    <span>Total: ${order.totalSum}</span>
                  </div>
                  <div className='w-full'>
                    <div className='border-t border-gray-300 pt-4'>
                      <div className='space-y-4 mt-4'>
                        {order.products.map((item) => (
                          <div
                            key={item.id}
                            className='flex items-center space-x-4'
                          >
                            <div className='flex-1'>
                              <h3 className='font-semibold text-purple-500'>
                                {item.title}
                              </h3>
                              <p className='text-gray-500'>
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <span className='text-purple-500 font-semibold'>
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && orders?.total === 0 && (
          <div className='text-center py-12 border-2 border-gray-200 rounded-lg bg-gray-100'>
            <XSquareIcon className='mx-auto h-16 w-16 text-red-400 mb-4' />
            <h2 className='text-2xl font-semibold mb-2 text-purple-500'>
              No orders found
            </h2>
            <p className='text-gray-400 mb-6'>
              You haven`&apos;`t placed any orders yet. Start shopping now!
            </p>
            <Button
              className='flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
              onClick={() => router.push('/')}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}