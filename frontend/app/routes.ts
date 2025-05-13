import { type RouteConfig } from "@react-router/dev/routes";

export default [
  // Home route
  {
    path: "/",
    file: "./routes/route.tsx",
  },
  // Login route
  {
    path: "/login",
    file: "./routes/login/route.tsx",
  },
  // Companies route
  {
    path: "/companies",
    file: "./routes/companies/route.tsx",
  },
  // Products route
  {
    path: "/products",
    file: "./routes/products/route.tsx",
  },
  // Inventory route
  {
    path: "/inventory",
    file: "./routes/inventory/route.tsx",
  },
  // AI Recommendations route
  {
    path: "/recommendations",
    file: "./routes/recommendations/route.tsx",
  },
] satisfies RouteConfig;
