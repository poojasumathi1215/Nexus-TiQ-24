import { formatCurrency } from '../utils/riskAnalysis'

export default function ConnectionCard({ connections, baseline }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-800">Connection & Baseline Comparison</h3>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{connections}</p>

      {baseline && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Customer Baseline Profile
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-slate-400">Avg Transaction</p>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(baseline.mean)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Median Transaction</p>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(baseline.median)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Max Recorded</p>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(baseline.max)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Variability (Std Dev)</p>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(baseline.stdDev)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Flagged transactions are evaluated against this baseline. Significant deviations
            from the mean and median indicate potential anomalous behavior warranting
            investigator attention — not a determination of fraud.
          </p>
        </div>
      )}
    </div>
  )
}
