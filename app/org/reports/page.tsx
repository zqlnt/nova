'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function OrgReportsPage() {
  return (
    <Layout role="org">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Exports and analytics</p>
        </div>

        <Card className="p-6">
          <div className="text-sm text-gray-500 mb-2">Status</div>
          <p className="text-gray-700">Reports and exports coming soon. Planned features:</p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc list-inside">
            <li>Attendance export (CSV)</li>
            <li>Payment summary</li>
            <li>Student roster export</li>
            <li>Funding breakdown</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
}
