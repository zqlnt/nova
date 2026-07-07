import { ReactNode } from 'react';

export type OrgCardTone = 'white' | 'blue' | 'lilac' | 'pink' | 'grey' | 'green';

interface OrgCardProps {
  children: ReactNode;
  tone?: OrgCardTone;
  className?: string;
  span?: 3 | 4 | 5 | 6 | 7 | 8 | 12;
}

export function OrgCard({ children, tone = 'white', className = '', span }: OrgCardProps) {
  return (
    <article
      className={`org-surface org-card org-card--${tone} ${span ? `org-span-${span}` : ''} ${className}`}
    >
      {children}
    </article>
  );
}

interface OrgCardHeadProps {
  label: string;
  title: string;
  action?: ReactNode;
}

export function OrgCardHead({ label, title, action }: OrgCardHeadProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="grid gap-1">
        <span className="text-xs font-bold text-[var(--org-muted)]">{label}</span>
        <h3 className="text-xl font-bold tracking-tight text-[var(--org-ink)] m-0">{title}</h3>
      </div>
      {action ?? (
        <span className="w-[34px] h-[34px] rounded-full grid place-items-center bg-white/76 text-[#666] text-sm font-bold shrink-0">
          +
        </span>
      )}
    </div>
  );
}
