import ProtectedRoute from "~/components/ProtectedRoute";
import Layout from "~/components/Layout";
import React, { Suspense } from "react";
import { Spin } from "antd";
const ProductsContent = React.lazy(() => import("~/components/Products"));

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Layout title="Productos">
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
            </div>
          }
        >
          <ProductsContent />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}
