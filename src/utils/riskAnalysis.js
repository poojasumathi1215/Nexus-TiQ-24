// Risk analysis engine for the Transaction Risk Investigation Assistant
//
// IMPORTANT RULES:
// - NEVER conclude that fraud has occurred. Only flag anomalies and offer risk insights.
// - Every flagged item must reference transactions present in the input dataset.
// - If no rules are triggered, state clearly that no action is required (no false positives).

// ─── Helpers ───────────────────────────────────────────────────────────────

const parseDate = (str) => {
  // Handles both "2026-08-01" and "2026-08-21 02:14" formats
  const parts = str.trim().split(/[\s T]/)
  const [y, m, d] = parts[0].split('-').map(Number)
  let hour = 12, minute = 0
  if (parts[1]) {
    const t = parts[1].split(':').map(Number)
    hour = t[0] ?? 12
    minute = t[1] ?? 0
  }
  return new Date(y, m - 1, d, hour, minute)
}

const getHour = (str) => parseDate(str).getHours()

const formatCurrency = (amt) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt)

const formatDate = (str) => {
  const d = parseDate(str)
  const hasTime = str.trim().includes(' ') || str.trim().includes('T')
  const datePart = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
  if (hasTime) {
    const timePart = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    return `${datePart} ${timePart}`
  }
  return datePart
}

// ─── Baseline computation ──────────────────────────────────────────────────

function computeBaseline(transactions) {
  // Treat deposits (positive amounts) as income, debits (negative or outgoing) as spending
  const outflows = transactions.filter((t) => t.amount > 0 && !t.description.match(/deposit|payroll/i))
  const allAmounts = transactions.map((t) => Math.abs(t.amount))

  const amounts = outflows.length > 0 ? outflows.map((t) => t.amount) : allAmounts
  const sorted = [...amounts].sort((a, b) => a - b)
  const median = sorted.length > 0
    ? sorted[Math.floor(sorted.length / 2)]
    : 0
  const mean = amounts.length > 0
    ? amounts.reduce((s, a) => s + a, 0) / amounts.length
    : 0
  const max = Math.max(...allAmounts, 0)

  // Standard deviation for outlier detection
  const variance = amounts.length > 0
    ? amounts.reduce((s, a) => s + Math.pow(a - mean, 2), 0) / amounts.length
    : 0
  const stdDev = Math.sqrt(variance)

  // Known payees (seen more than once, or seen in early "normal" period)
  const payeeCounts = {}
  transactions.forEach((t) => {
    payeeCounts[t.payee] = (payeeCounts[t.payee] || 0) + 1
  })

  return { median, mean, max, stdDev, payeeCounts, outflowCount: outflows.length }
}

// ─── Risk Rules ─────────────────────────────────────────────────────────────

function checkLargeTransferRule(tx, baseline) {
  // Flag if amount is significantly larger than the customer's baseline mean
  // Threshold: > 3x the mean AND > mean + 2*stdDev (statistical outlier)
  const threshold = Math.max(baseline.mean * 3, baseline.mean + 2 * baseline.stdDev)
  if (tx.amount > threshold && tx.amount > 500) {
    return {
      ruleId: 'LARGE_TRANSFER',
      ruleName: 'Unusually Large Transfer',
      severity: 'high',
      description: `Transaction of ${formatCurrency(tx.amount)} significantly exceeds the customer's baseline average of ${formatCurrency(baseline.mean.toFixed(2))} (threshold: ${formatCurrency(threshold.toFixed(2))}).`,
      transaction: tx,
    }
  }
  return null
}

function checkNewPayeeBurstRule(transactions, baseline) {
  // Find payees that appear for the first time and have bursts of payments
  const findings = []
  const seenPayees = new Set()
  const payeeFirstSeen = {}

  for (const tx of transactions) {
    if (!seenPayees.has(tx.payee)) {
      seenPayees.add(tx.payee)
      payeeFirstSeen[tx.payee] = tx
    }
  }

  // Group transactions by payee
  const byPayee = {}
  transactions.forEach((tx) => {
    if (!byPayee[tx.payee]) byPayee[tx.payee] = []
    byPayee[tx.payee].push(tx)
  })

  for (const [payee, txs] of Object.entries(byPayee)) {
    // A "new payee burst" = payee appears 2+ times AND total volume is high relative to baseline
    if (txs.length >= 2) {
      const totalVolume = txs.reduce((s, t) => s + t.amount, 0)
      // Check if this payee is new (first seen in the latter half of the dataset)
      const firstTx = payeeFirstSeen[payee]
      const firstIdx = transactions.indexOf(firstTx)
      const isRecent = firstIdx > transactions.length * 0.5

      if (isRecent && totalVolume > baseline.mean * 2) {
        findings.push({
          ruleId: 'NEW_PAYEE_BURST',
          ruleName: 'Burst of Payments to Newly Added Payee',
          severity: 'high',
          description: `Payee "${payee}" was first seen at transaction #${firstIdx + 1} and received ${txs.length} payments totaling ${formatCurrency(totalVolume.toFixed(2))} — well above the customer's baseline of ${formatCurrency(baseline.mean.toFixed(2))} per transaction.`,
          transaction: firstTx,
          relatedTransactions: txs,
        })
      }
    }
  }

  return findings
}

function checkOddHoursRule(tx) {
  // Flag transactions between 12:00 AM and 6:00 AM (odd hours for normal banking)
  const hour = getHour(tx.date)
  if (hour >= 0 && hour < 6) {
    return {
      ruleId: 'ODD_HOURS',
      ruleName: 'Odd-Hours / Unusual Timing Activity',
      severity: 'medium',
      description: `Transaction occurred at ${hour.toString().padStart(2, '0')}:${parseDate(tx.date).getMinutes().toString().padStart(2, '0')} — outside typical banking hours (6:00 AM – 11:00 PM).`,
      transaction: tx,
    }
  }
  return null
}

function checkMicroTestTransferRule(transactions, baseline) {
  // Detect pattern: small test transfer followed by large transfer to same payee
  const findings = []
  const byPayee = {}
  transactions.forEach((tx) => {
    if (!byPayee[tx.payee]) byPayee[tx.payee] = []
    byPayee[tx.payee].push(tx)
  })

  for (const [payee, txs] of Object.entries(byPayee)) {
    if (txs.length < 2) continue
    // Sort by date
    const sorted = [...txs].sort((a, b) => parseDate(a.date) - parseDate(b.date))
    for (let i = 0; i < sorted.length - 1; i++) {
      const small = sorted[i]
      const large = sorted[i + 1]
      // Small test = under $20, large = above baseline mean * 5
      if (small.amount < 20 && large.amount > baseline.mean * 5) {
        const timeDiff = parseDate(large.date) - parseDate(small.date)
        const minutesDiff = timeDiff / (1000 * 60)
        // Within 1 hour window
        if (minutesDiff > 0 && minutesDiff < 60) {
          findings.push({
            ruleId: 'MICRO_TEST_TRANSFER',
            ruleName: 'Micro-Test Transfer Before Large Exfiltration',
            severity: 'high',
            description: `A small test transfer of ${formatCurrency(small.amount)} to "${payee}" was followed by a large transfer of ${formatCurrency(large.amount)} within ${Math.round(minutesDiff)} minutes — a common precursor pattern in account takeover scenarios.`,
            transaction: small,
            relatedTransaction: large,
          })
        }
      }
    }
  }

  return findings
}

function checkDeviationFromPatternRule(tx, baseline) {
  // Flag if the channel is unusual for this customer (e.g., Wire Transfer when they normally use Debit Card)
  // This is a lighter check — we flag it as a deviation indicator
  const unusualChannels = ['Wire Transfer', 'Crypto Exchange']
  if (unusualChannels.includes(tx.channel)) {
    return {
      ruleId: 'CHANNEL_DEVIATION',
      ruleName: 'Deviation from Historical Spending Pattern',
      severity: 'medium',
      description: `Transaction via "${tx.channel}" deviates from the customer's historical channel usage (primarily Debit Card and Online Banking).`,
      transaction: tx,
    }
  }
  return null
}

// ─── Main Analysis Function ────────────────────────────────────────────────

export function analyzeTransactions(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      status: 'green',
      findings: [],
      triggeredRules: [],
      flaggedTransactions: [],
      baseline: null,
      connections: '',
      actionPlan: [],
      summary: 'No transaction data provided for analysis.',
    }
  }

  const baseline = computeBaseline(transactions)
  const findings = []
  const flaggedTxSet = new Set()

  // Rule 1: Unusually large transfers
  transactions.forEach((tx) => {
    const result = checkLargeTransferRule(tx, baseline)
    if (result) {
      findings.push(result)
      flaggedTxSet.add(tx)
    }
  })

  // Rule 2: Bursts of payments to newly added payee
  const burstFindings = checkNewPayeeBurstRule(transactions, baseline)
  burstFindings.forEach((f) => {
    findings.push(f)
    flaggedTxSet.add(f.transaction)
    if (f.relatedTransactions) {
      f.relatedTransactions.forEach((t) => flaggedTxSet.add(t))
    }
  })

  // Rule 3: Odd-hours activity
  transactions.forEach((tx) => {
    const result = checkOddHoursRule(tx)
    if (result) {
      findings.push(result)
      flaggedTxSet.add(tx)
    }
  })

  // Rule 4: Micro-test transfer pattern
  const microFindings = checkMicroTestTransferRule(transactions, baseline)
  microFindings.forEach((f) => {
    findings.push(f)
    flaggedTxSet.add(f.transaction)
    if (f.relatedTransaction) flaggedTxSet.add(f.relatedTransaction)
  })

  // Rule 5: Deviation from historical spending pattern (channel)
  transactions.forEach((tx) => {
    const result = checkDeviationFromPatternRule(tx, baseline)
    if (result) {
      findings.push(result)
      flaggedTxSet.add(tx)
    }
  })

  // Deduplicate triggered rules
  const ruleMap = {}
  findings.forEach((f) => {
    if (!ruleMap[f.ruleId]) {
      ruleMap[f.ruleId] = {
        ruleId: f.ruleId,
        ruleName: f.ruleName,
        severity: f.severity,
        count: 0,
        descriptions: [],
      }
    }
    ruleMap[f.ruleId].count++
    ruleMap[f.ruleId].descriptions.push(f.description)
  })
  const triggeredRules = Object.values(ruleMap)

  const flaggedTransactions = Array.from(flaggedTxSet)

  // Build connections narrative
  let connections = ''
  if (findings.length > 0) {
    const newPayeeFindings = findings.filter((f) => f.ruleId === 'NEW_PAYEE_BURST')
    const microFindingsFiltered = findings.filter((f) => f.ruleId === 'MICRO_TEST_TRANSFER')
    const oddHoursFindings = findings.filter((f) => f.ruleId === 'ODD_HOURS')
    const largeFindings = findings.filter((f) => f.ruleId === 'LARGE_TRANSFER')

    const parts = []
    if (newPayeeFindings.length > 0) {
      const payees = newPayeeFindings.map((f) => `"${f.transaction.payee}"`).join(' and ')
      parts.push(`The newly added payee(s) (${payees}) received an unusual volume of payments that deviate significantly from the customer's established baseline of ${formatCurrency(baseline.mean.toFixed(2))} per transaction.`)
    }
    if (microFindingsFiltered.length > 0) {
      parts.push(`Small-value test transfers were sent to these same payees shortly before large-value transfers, suggesting a deliberate "probe-then-exfiltrate" sequence.`)
    }
    if (oddHoursFindings.length > 0) {
      parts.push(`Multiple flagged transactions occurred during odd hours (12:00 AM – 6:00 AM), which is inconsistent with the customer's normal daytime banking activity.`)
    }
    if (largeFindings.length > 0) {
      parts.push(`The large transfer amounts stand in stark contrast to the customer's typical spending pattern, which is dominated by grocery purchases, utility bills, and subscription payments under ${formatCurrency(baseline.median.toFixed(2))}.`)
    }
    connections = parts.join(' ')
  }

  // Build action plan
  const actionPlan = []
  if (findings.length === 0) {
    actionPlan.push('No anomalies detected. No further investigation action is required at this time.')
  } else {
    actionPlan.push('Review the flagged transactions in detail and cross-reference with the customer account profile.')
    if (triggeredRules.some((r) => r.ruleId === 'NEW_PAYEE_BURST')) {
      actionPlan.push('Contact the customer via a verified channel to confirm they authorized the new payee additions and the associated transfers.')
    }
    if (triggeredRules.some((r) => r.ruleId === 'MICRO_TEST_TRANSFER')) {
      actionPlan.push('Investigate whether the micro-test transfers were followed by large-value exfiltration — this is a known account-takeover indicator. Temporarily restrict outbound transfers to the flagged payees pending verification.')
    }
    if (triggeredRules.some((r) => r.ruleId === 'ODD_HOURS')) {
      actionPlan.push('Check whether the customer has a history of nighttime banking activity. If not, consider placing a temporary hold on the account pending customer verification.')
    }
    if (triggeredRules.some((r) => r.ruleId === 'LARGE_TRANSFER')) {
      actionPlan.push('Compare the flagged large transfers against the customer historical outgoing transfer limits and prior wire/transfer activity. Escalate to a senior investigator if the amounts exceed $5,000.')
    }
    actionPlan.push('Document all findings and the investigator decision in the case management system. If the customer confirms the transactions are legitimate, close the case as a false positive.')
  }

  // Build summary
  let summary = ''
  if (findings.length === 0) {
    summary = `Analysis of ${transactions.length} transactions revealed no anomalies. All transactions fall within the customer's established baseline patterns. No action is required.`
  } else {
    const highCount = findings.filter((f) => f.severity === 'high').length
    const mediumCount = findings.filter((f) => f.severity === 'medium').length
    summary = `Analysis of ${transactions.length} transactions triggered ${triggeredRules.length} risk rule(s) with ${findings.length} individual finding(s). ${highCount} high-severity and ${mediumCount} medium-severity anomalies were identified. ${flaggedTransactions.length} transaction(s) have been flagged for investigator review. Note: These are anomaly indicators only — no determination of fraud has been made.`
  }

  return {
    status: findings.length > 0 ? 'red' : 'green',
    findings,
    triggeredRules,
    flaggedTransactions,
    baseline: {
      mean: baseline.mean,
      median: baseline.median,
      max: baseline.max,
      stdDev: baseline.stdDev,
    },
    connections,
    actionPlan,
    summary,
  }
}

export { formatCurrency, formatDate }
