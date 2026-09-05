import { formatCurrency, formatDate } from '../utils/riskAnalysis'

export default function FlaggedTransactionsTable({ transactions, findings }) {
  // Map each flagged transaction to its triggered rule names
  const txRuleMap = {}
  findings.forEach((f) => {
    const tx = f.transaction
    const key = `${tx.date}|${tx.payee}|${tx.amount}`
    if (!txRuleMap[key]) txRuleMap[key] = new Set()
    txRuleMap[key].add(f.ruleName)
    if (f.relatedTransaction) {
      const rt = f.relatedTransaction
      const rkey = `${rt.date}|${rt.payee}|${rt.amount}`
      if (!txRuleMap[rkey]) txRuleMap[rkey] = new Set()
      txRuleMap[rkey].add(f.ruleName)
    }
    if (f.relatedTransactions) {
      f.relatedTransactions.forEach((rt) => {
        const rkey = `${rt.date}|${rt.payee}|${rt.amount}`
        if (!txRuleMap[rkey]) txRuleMap[rkey] = new Set()
        txRuleMap[rkey].add(f.ruleName)
      })
    }
  })

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18v18H3z" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-800">Flagged Transactions</h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-auto">
          {transactions.length} flagged
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Payee</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Triggered Rules</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx, i) => {
              const key = `${tx.date}|${tx.payee}|${tx.amount}`
              const rules = txRuleMap[key]
              return (
                <tr key={i} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{tx.payee}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800 font-semibold">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{tx.channel}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[200px]">{tx.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {rules && Array.from(rules).map((ruleName, j) => (
                        <span
                          key={j}
                          className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200"
                        >
                          {ruleName}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
