import ProtectedRoute from "~/components/ProtectedRoute";
import Layout from "~/components/Layout";
import React, { Suspense } from "react";
import { Spin } from "antd";
const RecommendationsContent = React.lazy(
  () => import("~/components/Recomendations")
);
export default function RecommendationsPage() {
  return (
    <ProtectedRoute>
      <Layout title="Recomendaciones IA">
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
            </div>
          }
        >
          <RecommendationsContent />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}
