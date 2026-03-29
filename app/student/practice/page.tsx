import { Suspense } from 'react';
import PracticeClient from './PracticeClient';

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <PracticeClient />
    </Suspense>
  );
}

