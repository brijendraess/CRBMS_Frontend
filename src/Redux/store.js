import { configureStore } from "@reduxjs/toolkit";

import { combineReducers } from "@reduxjs/toolkit";
import { alertsSlice } from "./alertSlicer";
import { authSlice } from "./authSlicer";
import { getEmail } from "./verifyEmailSlicer";

const rootReducer = combineReducers({
  alerts: alertsSlice.reducer,
  user: authSlice.reducer,
  verifyLoginEmail: getEmail.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
