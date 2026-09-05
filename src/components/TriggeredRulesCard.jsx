const severityConfig = {
  high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'High' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Medium' },
  low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', label: 'Low' },
}

export default function TriggeredRulesCard({ rules }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-800">Triggered Risk Rules</h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-auto">
          {rules.length} rule{rules.length !== 1 ? 's' : ''} triggered
        </span>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => {
          const cfg = severityConfig[rule.severity] || severityConfig.medium
          return (
            <div
              key={rule.ruleId}
              className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className="text-sm font-semibold text-slate-800">{rule.ruleName}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {rule.count} finding{rule.count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <ul className="space-y-1.5 ml-4">
                {rule.descriptions.map((desc, i) => (
                  <li key={i} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
