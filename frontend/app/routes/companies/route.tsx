import React, { Suspense } from "react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { Spin } from "antd";
import Layout from "~/components/Layout";

const CompaniesContent = React.lazy(() => import("~/components/Companies"));

export default function CompaniesPage() {
  return (
    <ProtectedRoute>
      <Layout title="Empresas">
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
            </div>
          }
        >
          <CompaniesContent />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}
