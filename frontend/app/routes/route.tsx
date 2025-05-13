import { useNavigate } from "react-router";
import { Row, Col, Card, Button, Typography, Space } from "antd";
import {
  ShopOutlined,
  InboxOutlined,
  AppstoreOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { motion } from "motion/react";

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: "Empresas",
      description:
        "Gestionar información de empresas incluyendo NIT, nombre, dirección y teléfono.",
      icon: <ShopOutlined style={{ fontSize: 24 }} />,
      path: "/companies",
      requiresAuth: true,
    },
    {
      title: "Productos",
      description:
        "Crear y gestionar productos con precios en múltiples monedas y características detalladas.",
      icon: <AppstoreOutlined style={{ fontSize: 24 }} />,
      path: "/products",
      requiresAuth: true,
      requiresAdmin: true,
    },
    {
      title: "Inventario",
      description:
        "Seguimiento de niveles de inventario y generación de informes PDF que pueden enviarse por correo electrónico.",
      icon: <InboxOutlined style={{ fontSize: 24 }} />,
      path: "/inventory",
      requiresAuth: true,
      requiresAdmin: true,
    },
  ];

  return (
    <Layout title="Gestión de inventario">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div
          className="motion-div"
          ref={(el) => {
            if (el) {
              el.style.opacity = "0";
              el.style.transform = "translateY(20px)";
              setTimeout(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
                el.style.transition = "opacity 0.5s, transform 0.5s";
              }, 10);
            }
          }}
          style={{
            textAlign: "center",
            paddingTop: 64,
            paddingBottom: 64,
          }}
        >
          <Typography.Title level={1} style={{ fontWeight: "bold" }}>
            Bienvenido a la Gestión de Inventario
          </Typography.Title>
          <Typography.Title
            level={5}
            type="secondary"
            style={{ maxWidth: 800, margin: "0 auto 48px" }}
          >
            Una solución completa para gestionar empresas, productos e
            inventario
          </Typography.Title>

          {!isAuthenticated && (
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              onClick={() => navigate("/login")}
              className="hover-button"
            >
              Comenzar
            </Button>
          )}
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
          {features
            .filter(
              (feature) =>
                (feature.requiresAuth ? isAuthenticated : true) &&
                (feature.requiresAdmin ? isAdmin : true)
            )
            .map((feature) => (
              <Col xs={24} md={8} key={feature.title}>
                <Card
                  hoverable
                  className="feature-card"
                  onClick={() => navigate(feature.path)}
                  style={{ height: "100%", textAlign: "center" }}
                >
                  <div
                    style={{
                      marginBottom: 16,
                      padding: 16,
                      borderRadius: "50%",
                      backgroundColor: "#1976d2",
                      color: "white",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <Typography.Title level={4}>{feature.title}</Typography.Title>
                  <Typography.Text type="secondary">
                    {feature.description}
                  </Typography.Text>
                </Card>
              </Col>
            ))}
        </Row>

        {!isAuthenticated && (
          <div
            className="login-banner"
            ref={(el) => {
              if (el) {
                el.style.opacity = "0";
                setTimeout(() => {
                  el.style.opacity = "1";
                  el.style.transition = "opacity 0.5s";
                }, 500);
              }
            }}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: 32,
              borderRadius: 8,
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            <Typography.Title level={5} style={{ color: "white" }}>
              Por favor, inicia sesión para acceder a todas las funcionalidades
            </Typography.Title>
            <Typography.Paragraph>
              Los usuarios externos pueden ver las empresas, mientras que los
              usuarios administradores tienen acceso completo a todas las
              funcionalidades.
            </Typography.Paragraph>
            <Button
              type="primary"
              onClick={() => navigate("/login")}
              style={{ marginTop: 16 }}
            >
              Iniciar sesión
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
