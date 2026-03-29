'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function OrgSettings() {
  return (
    <Layout role="org">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organisation Settings</h1>
          <p className="text-gray-600 mt-1">Branding, permissions, billing, and integrations (scaffolding)</p>
        </div>
        <Card className="py-6">
          <div className="text-sm text-gray-500 mb-2">Status</div>
          <div className="text-gray-900 font-medium">Not configured yet</div>
        </Card>
      </div>
    </Layout>
  );
}

