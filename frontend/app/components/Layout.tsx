import React from "react";
import Dashboard from "./Dashboard";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return <Dashboard title={title}>{children}</Dashboard>;
};

export default Layout;
