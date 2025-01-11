import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../store";

const injectedRtkApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    // baseUrl: "https://chat-gpt-server-eight.vercel.app/api",
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.access_token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    getAccessToken: build.query<AuthApiResponse, AuthApiArg>({
      query: () => ({
        url: `/auth/token`,
        method: "GET",
      }),
    }),
    getChatGptResponse: build.query<ChatbotApiResponse, ChatbotApiArg>({
      query: ({ question, customerId, contactQuestionResponse }) => ({
        url: `/web-bff/auras-gpt-spa`,
        method: "POST",
        params: {
          question,
          customerId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        body: contactQuestionResponse,
      }),
    }),
  }),
});
export { injectedRtkApi as api };
export interface IContactQuestion {
  companyName?: string;
  name?: string;
  email?: string;
  designation?: string;
}

export type AuthApiArg = void;
export type AuthApiResponse = {
  token_type: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};
export type ChatbotApiArg = {
  customerId?: number;
  question?: string;
  contactQuestionResponse?: IContactQuestion;
};
export type ChatbotApiResponse = {
  customerId: number;
  chatGptResponse: string;
  contactQuestions: IContactQuestion[];
};
export const { useGetAccessTokenQuery, useGetChatGptResponseQuery } =
  injectedRtkApi;
