'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { StudentProvider } from '@/contexts/StudentContext';
import { orgService } from '@/lib/orgService';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        orgService.bootstrap();
      }
    } catch {
      // Ignore bootstrap errors - app works without org data
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <StudentProvider>
          {children}
        </StudentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

