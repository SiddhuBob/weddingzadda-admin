import React, { createContext } from "react";
import { Layout, theme } from "antd";
import Sidebar from "../components/sidebar/sidebar";
import Headers from "../components/header/header-app";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Content } = Layout;

  return (
    <LayoutContext.Provider value="">
      <Layout>
        <Sidebar />
        <Layout>
          <Headers colorBgContainer={colorBgContainer} />
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;
