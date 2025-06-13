import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import SideBarContext from "./context/nav-toggle";
import { ConfigProvider } from "antd";
import FormDrawerProvider from "./context/FormDrawerProvider";
import ImageResizerProvider from "./context/ImageResizerProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
function renderReactDom() {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemSelectedBg: "#045838",
              },
            },
          }}
        >
          <SideBarContext>
            <ImageResizerProvider>
              <FormDrawerProvider>
                <App />
              </FormDrawerProvider>
            </ImageResizerProvider>
          </SideBarContext>
        </ConfigProvider>
      </Provider>
    </React.StrictMode>
  );
}
renderReactDom();
