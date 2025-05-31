'use server';

import { fetchApiClient } from '@/lib/oneentry';
import { cookies } from 'next/headers';

interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  pageData: null;
}

export default async function logoutAction() {
  const cookieStore = cookies();
  const refreshTokenCookie = (await cookieStore).get('refresh_token')?.value;
  const accessTokenCookie = (await cookieStore).get('access_token')?.value;
  const apiClient = await fetchApiClient();

  // If tokens are missing, return early
  if (!refreshTokenCookie || !accessTokenCookie) {
    return {
      message: 'You are not currently logged in.',
    };
  }

  try {
    // Perform the logout request using access and refresh tokens
    const logoutResponse = await apiClient?.AuthProvider.setAccessToken(
      accessTokenCookie
    ).logout('email', refreshTokenCookie);

    // Check if the response is not a boolean, indicating an error
    if (typeof logoutResponse !== 'boolean') {
      const errorResponse = logoutResponse as unknown as IErrorResponse;
      return {
        message: errorResponse.message,
      };
    }

    // If logout is successful, delete the cookies
    (
      await // If logout is successful, delete the cookies
      cookieStore
    ).delete('refresh_token');
    (await cookieStore).delete('access_token');
    (await cookieStore).delete('user_identifier');

    // Set the cookies to expire immediately
    (
      await // Set the cookies to expire immediately
      cookieStore
    ).set('refresh_token', '', { maxAge: 0 });
    (await cookieStore).set('access_token', '', { maxAge: 0 });
    (await cookieStore).set('user_identifier', '', { maxAge: 0 });

    return { message: 'Logout successful.' };
  } catch (err) {
    console.error('Error during logout:', err);
    throw new Error('An error occurred while logging out. Please try again.');
  }
}