'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function TeacherInsights() {
  return (
    <Layout role="teacher">
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <p className="text-gray-600 mt-1">Trends, risks, and recommendations (scaffolding)</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="py-6">
            <div className="text-sm text-gray-500 mb-2">Students needing attention</div>
            <div className="text-3xl font-bold text-gray-900">—</div>
          </Card>
          <Card className="py-6">
            <div className="text-sm text-gray-500 mb-2">Engagement drop</div>
            <div className="text-3xl font-bold text-gray-900">—</div>
          </Card>
          <Card className="py-6">
            <div className="text-sm text-gray-500 mb-2">Objectives at risk</div>
            <div className="text-3xl font-bold text-gray-900">—</div>
          </Card>
        </div>

        <Card className="py-6">
          <div className="text-sm text-gray-500 mb-2">Next</div>
          <div className="text-gray-900 font-medium">
            Add evidence-based risk flags and drill-down tables.
          </div>
        </Card>
      </div>
    </Layout>
  );
}

