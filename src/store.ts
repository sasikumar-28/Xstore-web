import { configureStore } from "@reduxjs/toolkit";
import { chatbotReducer } from "./store/chatbotSlice";
import { authReducer } from "./store/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api/chatbotApi.generated";
import { registerDispatch } from "./utils";

export const store = configureStore({
  reducer: {
    chatbot: chatbotReducer,
    auth: authReducer,
    api: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

setupListeners(store.dispatch);
registerDispatch(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
