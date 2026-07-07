'use client';

import { AuthGate } from '@/components/AuthGate';
import './org-control.css';

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
