import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Dropdown,
  Badge,
  Drawer,
  Space,
  Typography,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ShopOutlined,
  ShoppingOutlined,
  DatabaseOutlined,
  BulbOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleSidebar, setSidebarOpen } from "../../store/slices/uiSlice";
import { useAuth } from "../../hooks/useAuth";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface DashboardProps {
  children: React.ReactNode;
  title: string;
}

const Dashboard: React.FC<DashboardProps> = ({ children, title }) => {
  const dispatch = useAppDispatch();
  // Set a default value for sidebarOpen if state.ui is not available yet
  const sidebarOpen = useAppSelector((state) => {
    if (state.ui && "sidebarOpen" in state.ui) {
      return (state.ui as any).sidebarOpen;
    }
    return true;
  });
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileView, setMobileView] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const {
    token: { colorBgContainer, colorBgElevated, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        dispatch(setSidebarOpen(false));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const menuItems = useMemo(() => ([
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">Inicio</Link>,
    },
    ...(user
      ? [
          {
            key: "/companies",
            icon: <ShopOutlined />,
            label: <Link to="/companies">Empresas</Link>,
          },
        ]
      : []),
    ...(user?.role === "admin"
      ? [
          {
            key: "/products",
            icon: <ShoppingOutlined />,
            label: <Link to="/products">Productos</Link>,
          },
          {
            key: "/inventory",
            icon: <DatabaseOutlined />,
            label: <Link to="/inventory">Inventario</Link>,
          },
          {
            key: "/recommendations",
            icon: <BulbOutlined />,
            label: <Link to="/recommendations">Recomendaciones IA</Link>,
          },
        ]
      : []),
  ]), [user]);

  const auxUser = useMemo(() => ([
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Perfil",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configuración",
    },
  ]), []);

  const userMenuItems = useMemo((): any => ([
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      onClick: logout,
    },
  ]), [logout]);

  const renderSidebar = useCallback(() => (
    <Sider
      trigger={null}
      collapsible
      collapsed={!sidebarOpen}
      width={240}
      style={{
        background: colorBgElevated,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          padding: sidebarOpen ? "0 16px" : "0",
        }}
      >
        {sidebarOpen ? (
          <Title level={4} style={{ margin: 0, color: "#1976d2" }}>
            Lite Thinking
          </Title>
        ) : (
          <Avatar
            style={{ backgroundColor: "#1976d2", color: "#fff" }}
            size="large"
          >
            LT
          </Avatar>
        )}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ borderRight: 0, background: "transparent" }}
        items={menuItems}
      />
    </Sider>
  ), [sidebarOpen, menuItems, location.pathname]);

  const toggleMobileDrawer = useCallback(() => {
    setMobileDrawerOpen(prev => !prev);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {mobileView ? (
        <Drawer
          placement="left"
          onClose={toggleMobileDrawer}
          open={mobileDrawerOpen}
          width={240}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ display: "none" }}
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0 16px",
            }}
          >
            <Title level={4} style={{ margin: 0, color: "#1976d2" }}>
              Lite Thinking
            </Title>
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ borderRight: 0 }}
            items={menuItems}
          />
        </Drawer>
      ) : (
        renderSidebar()
      )}
      <Layout
        style={{
          marginLeft: mobileView ? 0 : sidebarOpen ? 240 : 80,
          transition: "all 0.2s",
        }}
      >
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {mobileView ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={toggleMobileDrawer}
                style={{ fontSize: "16px", width: 48, height: 48 }}
              />
            ) : (
              <Button
                type="text"
                icon={
                  sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />
                }
                onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
                style={{ fontSize: "16px", width: 48, height: 48 }}
              />
            )}
            <Title level={4} style={{ margin: 0, marginLeft: 12 }}>
              {title}
            </Title>
          </div>
          <Space size="large">
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Button type="text" style={{ height: 48 }}>
                <Space>
                  <Avatar
                    style={{ backgroundColor: "#1976d2" }}
                    icon={<UserOutlined />}
                  />
                  {!mobileView && (
                    <span style={{ marginLeft: 8 }}>
                      {user?.email || "Usuario"}
                    </span>
                  )}
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default React.memo(Dashboard);
