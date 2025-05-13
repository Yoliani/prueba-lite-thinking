import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { ConfigProvider, theme, App as AntApp } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { useAppSelector } from "./store";
// i18n removed

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>Gestión de inventario</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content="Gestión de inventario" />
        <meta name="description" content="Gestión de inventario" />
        <meta name="keywords" content="inventario, gestión, productos" />
        <meta name="author" content="Lite Thinking" />
        <meta name="robots" content="index, follow" />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export const cache = createCache();

export default function App() {
  const antTheme = {
    token: {
      colorPrimary: "#1976d2",
      colorError: "#dc004e",
      borderRadius: 8,
      colorBgContainer: "#ffffff",
      colorBgElevated: "#f5f5f5",
      colorText: "#333333",
      colorTextSecondary: "#666666",
    },
    algorithm: theme.defaultAlgorithm,
    components: {
      Button: {
        borderRadius: 6,
        controlHeight: 40,
      },
      Card: {
        borderRadius: 12,
      },
      Table: {
        borderRadius: 8,
      },
      Input: {
        borderRadius: 6,
      },
    },
  };

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <StyleProvider cache={cache}>
          <ConfigProvider theme={antTheme}>
            <AntApp>
              <AuthProvider>
                <Outlet />
              </AuthProvider>
            </AntApp>
          </ConfigProvider>
        </StyleProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "¡Ups!";
  let details = "Ocurrió un error inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "La página solicitada no pudo ser encontrada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
