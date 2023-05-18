import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import "antd/dist/antd.css";
import "antd-button-color/dist/css/style.css";
import { PersistGate } from "redux-persist/integration/react";
import { ChakraProvider } from "@chakra-ui/react";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import '@shopify/polaris/build/esm/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <AppProvider i18n={enTranslations}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </AppProvider>,
);
