import { defineOneEntry } from "oneentry";

import retrieveRefreshToken from "@/actions/auth/retrieveRefreshToken";

import storeRefreshtoken from "@/actions/auth/storeRefreshTokens";

export type ApiClientType = ReturnType<typeof defineOneEntry> | null;

let apiClient: ApiClientType = null;

async function setupApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
    // Retrieve the API URL from environment vasriables

    const apiUrll = process.env.ONEENTRY_PROJECT_URL;

    //Throw an error if the API URL is not defined

    if (!apiUrll) {
        throw new Error('ONEENTRY_PROJECT_URL is missing');
    }

    // Check if the API client is already initialized

    if (!apiClient) {
        try {
            // Retreive the refresh token (if avaliable) from storage

            const refreToken = await retrieveRefreshToken();

            // Create a new instace of the API client with the required configuration

            apiClient = defineOneEntry(apiUrll, {
                token: process.env.ONEENTRY_TOKEN, // Token for authentication

                langCode: 'en_US', // Language code for the API

                auth: {
                    refreshToken: refreToken || undefined, // Use de retrieved refresh token or 'undefined'

                    customAuth: false, // Disable custom authentication

                    saveFunction: async (newToken: string) => {
                        // Save the new refresh token it is updated

                        await storeRefreshtoken(newToken);
                    },
                },
            });
        } catch (error) {
            // Log an erro if there is an issue retrieving the refresh token

            console.log('Error fetching refresh token', error);
        }
    }

    // If the API client is still not initialized, throw an error

    if(!apiClient) {
        throw new Error('Failed to initialize API client');
    }

    //return rhw initialized API client

    return apiClient;
}

/**
 * Function to retrieve the current API client instance.
 * If the client is not initialized, it will call `setupApiClient` to create it.
 */
export async function fetchApiClient(): Promise<
  ReturnType<typeof defineOneEntry>
> {
  // Check if the API client is already initialized
  if (!apiClient) {
    // If not, initialize it
    await setupApiClient();
  }

  // At this point, `apiClient` should not be null. If it is, throw an error.
  if (!apiClient) {
    throw new Error('API client is still null after setup');
  }

  // Return the initialized API client
  return apiClient;
}