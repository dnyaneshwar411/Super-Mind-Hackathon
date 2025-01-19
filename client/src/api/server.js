"use server";

import { cookies } from "next/headers";
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const ASTRO_API_ENDPOINT = process.env.NEXT_PUBLIC_ASTROLOGY_ENDPOINT;
const ASTRO_TOKEN = process.env.NEXT_PUBLIC_ASTRO_TOKEN;

export async function fetchData(endpoint) {
  try {
    const cookieStore = await cookies();
    const TOKEN = cookieStore.get("token")?.value;

    const response = await fetch(`${API_ENDPOINT}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      },
      cache: "no-store"
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function sendData(endpoint, method = "POST", data) {
  try {
    if (typeof method !== "string") {
      throw new Error("HTTP method must be a string");
    }

    const cookieStore = await cookies();
    const TOKEN = cookieStore.get("token")?.value;

    const response = await fetch(`${API_ENDPOINT}/${endpoint}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(data),
      cache: "no-store"
    });
    const retrievedData = await response.json();
    return retrievedData;
  } catch (error) {
    return error;
  }
}

export async function sendDataWithFormData(endpoint, method = "POST", formData) {
  try {
    if (typeof method !== "string") {
      throw new Error("HTTP method must be a string");
    }

    const cookieStore = await cookies();
    const TOKEN = cookieStore.get("token")?.value;

    const response = await fetch(`${API_ENDPOINT}/${endpoint}`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
      cache: "no-store",
    });

    const retrievedData = await response.json();
    return retrievedData;
  } catch (error) {
    return error;
  }
}


/**
 * Astrology related functions
 */
export async function sendDataAstrology(endpoint, method = "POST", data) {
  try {
    if (typeof method !== "string") {
      throw new Error("HTTP method must be a string");
    }

    const response = await fetch(`${ASTRO_API_ENDPOINT}/${endpoint}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: ASTRO_TOKEN,
        "x-api-key": ASTRO_TOKEN
      },
      body: JSON.stringify(data),
      cache: "no-store"
    });

    const retrievedData = await response.json();
    return retrievedData;
  } catch (error) {
    return error;
  }
}