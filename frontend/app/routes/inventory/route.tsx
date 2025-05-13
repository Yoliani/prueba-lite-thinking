import Layout from "../../components/Layout";
import ProtectedRoute from "~/components/ProtectedRoute";
import React, { Suspense } from "react";
import { Spin } from "antd";
const InventoryContent = React.lazy(() => import("~/components/Inventory"));
export default function InventoryPage() {
  return (
    <ProtectedRoute requireAdmin>
      <Layout title="Inventario">
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
            </div>
          }
        >
          <InventoryContent />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}
