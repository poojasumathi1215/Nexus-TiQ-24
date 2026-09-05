import StatusBadge from './StatusBadge'
import SummaryCard from './SummaryCard'
import TriggeredRulesCard from './TriggeredRulesCard'
import FlaggedTransactionsTable from './FlaggedTransactionsTable'
import ConnectionCard from './ConnectionCard'
import ActionPlanCard from './ActionPlanCard'

export default function ReportDashboard({ result, isAnalyzing }) {
  // Initial empty state
  if (!result && !isAnalyzing) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-600 mb-1">No Analysis Yet</h3>
        <p className="text-sm text-slate-400 max-w-xs">
          Load a sample dataset or upload a CSV from the input panel, then click "Analyze History" to generate an investigation report.
        </p>
      </div>
    )
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
        <svg className="w-10 h-10 text-brand-500 animate-spin mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <h3 className="text-base font-semibold text-slate-600 mb-1">Analyzing Transactions</h3>
        <p className="text-sm text-slate-400">Evaluating risk rules and detecting anomalies...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Status Header */}
      <StatusBadge status={result.status} />

      {/* Summary of Findings */}
      <SummaryCard summary={result.summary} result={result} />

      {/* Triggered Risk Rules */}
      {result.triggeredRules.length > 0 && (
        <TriggeredRulesCard rules={result.triggeredRules} />
      )}

      {/* Flagged Transactions Table */}
      {result.flaggedTransactions.length > 0 && (
        <FlaggedTransactionsTable transactions={result.flaggedTransactions} findings={result.findings} />
      )}

      {/* Connection & Baseline Comparison */}
      {result.connections && (
        <ConnectionCard connections={result.connections} baseline={result.baseline} />
      )}

      {/* Investigator Action Plan */}
      <ActionPlanCard actionPlan={result.actionPlan} status={result.status} />
    </div>
  )
}
