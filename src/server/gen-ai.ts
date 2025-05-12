/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken";

export const getRequirementCapture = async (
  data: any,
  storeCode: string,
  customerId: string
) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.error("Failed to fetch token. Please try again.");
      return;
    }
    const URL = import.meta.env.VITE_SERVER_BASE_URL;
    const formData = new FormData();
    formData.append("file", data);
    // Add storeCode to the form data
    formData.append("storeCode", storeCode);
    const response = await axios.post(
      `${URL}/api/web-bff/requirement-capture?userId=${customerId}&registered=true`,
      formData,
      {
        headers: {
          "Content-Type": "form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error during login:", error.response || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export const getDocumentGenerationBedRock = async (
  data: any,
  message: string,
  storeCode: string,
  customerId: string
) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.error("Failed to fetch token. Please try again.");
      return;
    }
    const URL = import.meta.env.VITE_SERVER_BASE_URL;
    const formData = new FormData();
    formData.append("file", data);
    // Add storeCode and message to the form data
    formData.append("storeCode", storeCode);
    formData.append("message", message);
    const response = await axios.post(
      `${URL}/api/web-bff/document-generation-bedrock?userId=${customerId}&registered=true`,
      formData,
      {
        headers: {
          "Content-Type": "form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error during login:", error.response || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};
