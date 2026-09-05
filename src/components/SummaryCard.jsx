export default function SummaryCard({ summary, result }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-800">Summary of Findings</h3>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>

      {result.baseline && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Mean Amount</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              ${result.baseline.mean.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Median</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              ${result.baseline.median.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Max Amount</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              ${result.baseline.max.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Std Dev</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              ${result.baseline.stdDev.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
