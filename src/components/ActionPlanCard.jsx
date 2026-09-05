export default function ActionPlanCard({ actionPlan, status }) {
  const isGreen = status === 'green'

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-800">Investigator Action Plan</h3>
      </div>

      <div className={`rounded-lg border p-4 ${isGreen ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <ol className="space-y-3">
          {actionPlan.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isGreen
                    ? 'bg-green-200 text-green-800'
                    : 'bg-amber-200 text-amber-800'
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-xs text-slate-500 leading-relaxed">
          This report flags anomalies and provides risk insights only. It does not state or
          conclude that fraud has occurred. Every flagged item references a transaction
          present in the input dataset. Final disposition is at the investigator's discretion.
        </p>
      </div>
    </div>
  )
}
