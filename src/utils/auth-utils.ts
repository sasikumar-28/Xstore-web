import { DateUtils } from "./date-utils";
import { api, AuthApiResponse } from "../api/chatbotApi.generated";
import { setAuth } from "../store/authSlice";

let internalDispatch: any;

export const registerDispatch = (dispatch: any) => {
  internalDispatch = dispatch;
};
export const getAccessToken = async (store: any) => {
  try {
    const auth = store.getState().auth as AuthApiResponse;

    if (auth) {
      const accessTokenExpireAt = DateUtils.parse(
        (auth.expires_in ?? 0) * 1000
      );

      console.log("Access token expiration time:", accessTokenExpireAt);

      if (DateUtils.now() >= accessTokenExpireAt) {
        console.log("Access token expired. Refreshing...");
        try {
          const { data } = api.useGetAccessTokenQuery();
          if (data) internalDispatch(setAuth(data));
        } catch (e) {}
      }
    }
  } finally {
  }
};
