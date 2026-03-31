'use client';

import { AuthGate } from '@/components/AuthGate';

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
