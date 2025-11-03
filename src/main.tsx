import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { api } from "./store/apiSlice";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({
    onUnhandledRequest: "bypass",
  });
}

// Prefetch critical data on app initialization
store.dispatch(api.util.prefetch('getDogs', undefined, { force: false }));
store.dispatch(api.util.prefetch('getServices', undefined, { force: false }));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
