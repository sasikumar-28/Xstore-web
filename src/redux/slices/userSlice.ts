import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Get customerId from localStorage if it exists
const getSavedCustomerId = (): string => {
  if (typeof window !== 'undefined') {
    const savedCustomerId = localStorage.getItem('customerId');
    return savedCustomerId || '';
  }
  return '';
};

interface UserState {
  customerId: string;
}

const initialState: UserState = {
  customerId: getSavedCustomerId(),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload;
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('customerId', action.payload);
      }
    },
  },
});

export const { setCustomerId } = userSlice.actions;

// Selectors
export const selectCustomerId = (state: RootState) => state.user.customerId;
export const selectIsCustomerIdSelected = (state: RootState) => state.user.customerId !== '';

export default userSlice.reducer;
