export default function Loading() {
  return (
    <div className="min-h-screen bg-[#eef2f9] relative flex flex-col safe-area-pb">
      {/* Google-style: subtle line grid only */}
      <div className="absolute inset-0 opacity-[0.25]" style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left: line-based skeleton */}
        <div className="hidden lg:flex lg:w-1/2 p-10 flex-col gap-8 max-w-md mx-auto w-full">
          <div className="h-4 w-24 rounded-sm bg-gray-200/50 animate-pulse" />
          <div className="space-y-4">
            <div className="h-5 w-full max-w-[280px] rounded-sm bg-gray-200/40 animate-pulse" />
            <div className="h-5 w-full max-w-[240px] rounded-sm bg-gray-200/40 animate-pulse" />
            <div className="h-5 w-full max-w-[200px] rounded-sm bg-gray-200/40 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-3.5 w-full rounded-sm bg-gray-200/35 animate-pulse" />
            <div className="h-3.5 w-[95%] rounded-sm bg-gray-200/35 animate-pulse" />
            <div className="h-3.5 w-[90%] rounded-sm bg-gray-200/35 animate-pulse" />
          </div>
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="h-3 w-3 rounded-full bg-gray-200/50 shrink-0" />
                <div className="h-3.5 flex-1 max-w-[200px] rounded-sm bg-gray-200/35 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        {/* Right: line-based skeleton - centered on mobile */}
        <div className="flex-1 lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 py-10 sm:py-12 lg:px-16">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded-sm bg-gray-200/50 animate-pulse" />
              <div className="h-6 w-40 rounded-sm bg-gray-200/50 animate-pulse" />
              <div className="h-3.5 w-52 rounded-sm bg-gray-200/40 animate-pulse" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center py-2">
                  <div className="h-4 w-4 rounded-sm bg-gray-200/50 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded-sm bg-gray-200/45 animate-pulse" />
                    <div className="h-3 w-48 rounded-sm bg-gray-200/35 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-10 w-full rounded-sm bg-gray-200/40 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-9 flex-1 rounded-sm bg-gray-200/40 animate-pulse" />
                <div className="h-9 flex-1 rounded-sm bg-gray-200/40 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
