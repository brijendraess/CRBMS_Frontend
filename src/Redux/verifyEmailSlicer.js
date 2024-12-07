// verifyEmailSlicer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  verifyLoginEmail: localStorage.getItem("verifyLoginEmail") || null,
};

export const getEmail = createSlice({
  name: "verifyLoginEmail",
  initialState,
  reducers: {
    setLoginEmail: (state, action) => {
      state.verifyLoginEmail = action.payload;
      // Store in localStorage when email is set
      localStorage.setItem("verifyLoginEmail", action.payload);
    },
    clearLoginEmail: (state) => {
      state.verifyLoginEmail = null;
      // Remove from localStorage when cleared
      localStorage.removeItem("verifyLoginEmail");
    },
  },
});

export const { setLoginEmail, clearLoginEmail } = getEmail.actions;
export default getEmail.reducer;
