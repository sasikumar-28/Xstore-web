import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IContactQuestion } from "../api/chatbotApi.generated";
import { RootState } from "../store";

export interface IChat {
  question?: string;
  chatGptResponse?: string;
  chatType: number;
}
interface IChatbotState {
  customerId?: number;
  chats: IChat[];
  contactQuestions?: IContactQuestion[] | null;
  contactQuestionResponse?: IContactQuestion;
}

const initialState: IChatbotState = {
  chats: [],
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<IChat>) => {
      state.chats.push(action.payload);
    },
    setCustomerId: (state, action: PayloadAction<number>) => {
      state.customerId = action.payload;
    },
    setContactQuestions: (
      state,
      action: PayloadAction<Array<IContactQuestion>>
    ) => {
      state.contactQuestions = action.payload;
    },
    clearContactQuestions: (state) => {
      state.contactQuestions = null;
    },
    setContactQuestionResponse: (
      state,
      action: PayloadAction<IContactQuestion>
    ) => {
      state.contactQuestionResponse = action.payload;
    },
  },
});

export const {
  addChat,
  setCustomerId,
  setContactQuestions,
  clearContactQuestions,
  setContactQuestionResponse,
} = chatbotSlice.actions;
export const getChats = (state: RootState) => state.chatbot.chats;
export const getContactQuestions = (state: RootState) =>
  state.chatbot.contactQuestions;
export const getCustomerId = (state: RootState) => state.chatbot.customerId;

export const chatbotReducer = chatbotSlice.reducer;
