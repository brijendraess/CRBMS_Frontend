import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store.js";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ErrorBoundary from "./pages/Error/ErrorBoundary.jsx";
import { Suspense } from "react";
import Loader from "./components/Common/Loader/Loader.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </LocalizationProvider>
  </Provider>
);
