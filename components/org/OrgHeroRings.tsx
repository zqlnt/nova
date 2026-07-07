interface RingItem {
  label: string;
  value: number;
  color: string;
}

interface OrgHeroRingsProps {
  rings: RingItem[];
  centerLabel?: string;
  centerSub?: string;
}

export default function OrgHeroRings({
  rings,
  centerLabel = 'Live',
  centerSub = 'pulse',
}: OrgHeroRingsProps) {
  const ringClass = ['r1', 'r2', 'r3'] as const;

  return (
    <div className="flex gap-4 items-center flex-wrap mt-2">
      <div className="relative w-[118px] h-[118px] shrink-0">
        {rings.slice(0, 3).map((ring, i) => (
          <div
            key={ring.label}
            className={`org-ring ${ringClass[i]}`}
            style={
              {
                '--value': Math.min(100, Math.max(0, ring.value)),
                '--ring-color': ring.color,
              } as React.CSSProperties
            }
          />
        ))}
        <div className="absolute inset-[38px] rounded-full bg-white/[0.97] grid place-items-center text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
          <strong className="text-lg tracking-tight">{centerLabel}</strong>
          <span className="text-[10px] text-[var(--org-muted)] font-extrabold uppercase tracking-wider">
            {centerSub}
          </span>
        </div>
      </div>
      <div className="grid gap-2 min-w-[158px] flex-1">
        {rings.slice(0, 3).map((ring) => (
          <div key={ring.label} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 font-bold">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: ring.color, boxShadow: '0 0 10px rgba(97,211,126,0.18)' }}
              />
              {ring.label}
            </div>
            <strong>{ring.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
