import { Suspense } from 'react';
import LearningMapClient from './LearningMapClient';

export default function LearningMapPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <LearningMapClient />
    </Suspense>
  );
}
