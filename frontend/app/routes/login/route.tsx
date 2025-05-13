import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Card,
  Input,
  Button,
  Typography,
  Alert,
  Tabs,
  Form,
  Space,
} from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { appClient } from "../../integrations";
// i18n removed

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/";
  // i18n removed
  const loginMutation = useMutation({
    mutationFn: async () => {
      await login(email, password);
    },
    onSuccess: () => {
      appClient.logger("Inicio de sesión exitoso", "success");
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      appClient.logger("Error al iniciar sesión", "error");
      setError(error.response?.data?.detail || "Correo o contraseña inválidos");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      await register(email, password);
    },
    onSuccess: () => {
      appClient.logger("Registro exitoso", "success");
      setTabValue(0); // Switch to login tab
      setError("");
    },
    onError: (error: any) => {
      appClient.logger("Error al registrarse", "error");
      setError(error.response?.data?.detail || "Error al registrarse");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    setError("");

    if (!email || !password) {
      setError("El correo y la contraseña son requeridos");
      return;
    }

    if (tabValue === 0) {
      loginMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  const handleTabChange = (key: string) => {
    setTabValue(parseInt(key));
    setError("");
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 16px" }}>
      <div
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
      >
        <Card
          style={{
            padding: 24,
            marginTop: 64,
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <Typography.Title
            level={3}
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            {tabValue === 0 ? "Bienvenido de Nuevo" : "Crear Cuenta"}
          </Typography.Title>

          <Tabs
            activeKey={tabValue.toString()}
            onChange={handleTabChange}
            centered
            items={[
              { key: "0", label: "Iniciar sesión" },
              { key: "1", label: "Registrarse" },
            ]}
            style={{ marginBottom: 24 }}
          />

          {error && (
            <Alert
              message={error}
              type="error"
              style={{ marginBottom: 24 }}
              className="error-alert"
            />
          )}

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Correo electrónico" required>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Contraseña" required>
              <Input.Password
                name="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: 40, marginTop: 16 }}
                loading={loginMutation.isPending || registerMutation.isPending}
                className="hover-button"
              >
                {loginMutation.isPending || registerMutation.isPending
                  ? "Procesando..."
                  : tabValue === 0
                  ? "Ingresar"
                  : "Crear Cuenta"}
              </Button>

              <Button
                type="default"
                onClick={() => navigate("/")}
                block
                style={{ height: 40, marginTop: 16 }}
                className="hover-button"
              >
                Ir al Inicio
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
