'use client';

import { AuthGate } from '@/components/AuthGate';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
