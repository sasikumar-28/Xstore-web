import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AuthApiResponse } from "../api/chatbotApi.generated";

const initialState: AuthApiResponse = {
  token_type: "",
  expires_in: 0,
  ext_expires_in: 0,
  access_token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthApiResponse>) => {
      state.token_type = action.payload.token_type;
      state.expires_in = action.payload.expires_in;
      state.ext_expires_in = action.payload.ext_expires_in;
      state.access_token = action.payload.access_token;
    },
  },
});

export const { setAuth } = authSlice.actions;

export const getAuth = (state: RootState) => state.auth;

export const authReducer = authSlice.reducer;
