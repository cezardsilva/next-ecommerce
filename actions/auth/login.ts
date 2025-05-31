"use server";

import { IAttributes } from "oneentry/dist/base/utils";

import { fetchApiClient } from "@/lib/oneentry";

import { cookies } from "next/headers";

import { redirect } from "next/navigation";

interface IErroredResponse {
  statusCode: number;

  message: string;
}

export const getLoginFormData = async (): Promise<IAttributes[]> => {
  try {
    const apiClient = await fetchApiClient();

    const response = await apiClient?.Forms.getFormByMarker("sign_in", "es_US");

    return response?.attributes as unknown as IAttributes[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }

    throw new Error("Fetching from data failed.");
  }
};

export const handleLoginSubmit = async (inputValues: {
  email: string;

  password: string;
}) => {
  try {
    const apiClient = await fetchApiClient();

    const data = {
      authData: [
        { marker: "email", value: inputValues.email },

        { marker: "password", value: inputValues.password },
      ],
    };

    const response = await apiClient?.AuthProvider.auth("email", data);

    if (!response?.userIdentifier) {
      const error = response as unknown as IErroredResponse;

      return {
        message: error.message,
      };
    }

    (await cookies()).set("acces_token", response.accessToken, {
      maxAge: 60 * 60 * 24, // 24 hours
    });

    (await cookies()).set("refresh_token", response.refreshToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (error: unknown) {
    console.error(error);

    // Check if error matches IErroredResponse
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      const typedError = error as IErroredResponse;

      if (typedError.statusCode === 401) {
        return { message: typedError.message };
      }
    }

    if (error instanceof Error) {
      throw new Error("Failed to login. Please try again.");
    }

    throw new Error("An unexpected error occurred.");
  }

  redirect("/");
};
