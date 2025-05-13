"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";

// Create a client-side cache for Ant Design styles
const createClientCache = () => createCache();

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  const cache = React.useMemo(() => createClientCache(), []);

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider>
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
