export default function StatusBadge({ status }) {
  const isGreen = status === 'green'

  return (
    <div
      className={`card p-5 border-l-4 ${
        isGreen ? 'border-l-green-500' : 'border-l-red-500'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            isGreen ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isGreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isGreen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isGreen ? 'bg-green-500' : 'bg-red-500'}`} />
            {isGreen ? 'GREEN' : 'RED'}
          </div>
          <h2 className={`text-base font-bold mt-1.5 ${isGreen ? 'text-green-800' : 'text-red-800'}`}>
            {isGreen
              ? 'NO ACTION REQUIRED — ROUTINE ACTIVITY'
              : 'ATTENTION REQUIRED — ANOMALIES DETECTED'}
          </h2>
        </div>
      </div>
    </div>
  )
}
