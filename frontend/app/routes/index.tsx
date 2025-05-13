import React, { Suspense } from 'react';
import { Spin } from 'antd';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load the home page content
const HomeContent = React.lazy(() => import('../components/Home'));

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Layout title="Inicio">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>}>
          <HomeContent />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}
