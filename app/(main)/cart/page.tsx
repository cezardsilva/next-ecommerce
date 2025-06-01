'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  LogIn,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/stores/cartStore';
import getUserSession from '@/actions/auth/getUserSession';
import { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import createOrder from '@/actions/orders/create-order';
import { IOrderData } from 'oneentry/dist/orders/ordersInterfaces';

export default function CartPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUserEntity | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const userData = await getUserSession();
        if (userData) setUser(userData as IUserEntity);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setUser(null);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  const createOrderAndCheckout = async () => {
    const data: IOrderData = {
      formData: [],
      formIdentifier: 'order_form',
      paymentAccountIdentifier: 'stripe_payment',
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };
    const url = await createOrder(data);
    clearCart();
    router.push(url);
  };

  return (
    <div className='min-h-screen  p-4 sm:p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          Your Cart
        </h1>

        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900'></div>
          </div>
        ) : (
          <>
            <div>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className=' p-4 sm:p-6 rounded-lg shadow-lg mb-4 relative overflow-hidden border-2 border-gray-200'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4'>
                    <div className='flex items-center space-x-4 mb-4 sm:mb-0'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md'
                      />
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent line-clamp-1'>
                          {item.name}
                        </h3>
                        <p className='text-gray-400'>
                          ${item?.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between sm:justify-end sm:flex-1'>
                      <div className='flex items-center space-x-2'>
                        <Button
                          size='icon'
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white cursor-pointer'
                        >
                          <Minus className='h-4 w-4' />
                        </Button>
                        <Input
                          type='number'
                          min='0'
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          className='w-16  border-gray-600 text-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'
                        />
                        <Button
                          size='icon'
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white cursor-pointer'
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => removeItem(item.id)}
                        className='text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 ml-4 cursor-pointer'
                      >
                        <Trash2 className='h-5 w-5' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='p-4 sm:p-6 rounded-lg border-gray-200 border-2 shadow-lg mt-8'>
              <h2 className='text-xl sm:text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
                Order Summary
              </h2>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t border-gray-700 my-2'></div>
                <div className='flex justify-between text-lg font-semibold'>
                  <span>Total</span>
                  <span className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              {user ? (
                <Button
                  className='w-full mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
                  disabled={!cartItems.length}
                  onClick={createOrderAndCheckout}
                >
                  <CreditCard className='mr-2 h-5 w-5' />
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className='w-full mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
                  onClick={() => router.push('/auth?type=login')}
                >
                  <LogIn className='mr-2 h-5 w-5' />
                  Login to Checkout
                </Button>
              )}
            </div>
          </>
        )}

        {!isLoading && cartItems.length === 0 && (
          <div className='text-center py-12'>
            <ShoppingCart className='mx-auto h-16 w-16 text-gray-400 mb-4' />
            <h2 className='text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent'>
              Your cart is empty
            </h2>
            <p className='text-gray-400 mb-6'>
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button
              className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer'
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