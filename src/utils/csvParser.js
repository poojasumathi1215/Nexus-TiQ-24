// CSV parser for transaction history upload
// Expected columns: Date, Description, Payee, Amount, Channel

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.')
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
  const dateIdx = headers.indexOf('date')
  const descIdx = headers.indexOf('description')
  const payeeIdx = headers.indexOf('payee')
  const amountIdx = headers.indexOf('amount')
  const channelIdx = headers.indexOf('channel')

  if (dateIdx === -1 || payeeIdx === -1 || amountIdx === -1) {
    throw new Error('CSV must contain at least: Date, Payee, Amount columns.')
  }

  const transactions = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim())
    if (cols.length < Math.max(dateIdx, payeeIdx, amountIdx) + 1) continue
    const amount = parseFloat(cols[amountIdx].replace(/[$,]/g, ''))
    if (isNaN(amount)) continue
    transactions.push({
      date: cols[dateIdx],
      description: descIdx !== -1 ? cols[descIdx] : '',
      payee: cols[payeeIdx],
      amount: amount,
      channel: channelIdx !== -1 ? cols[channelIdx] : 'Unknown',
    })
  }

  if (transactions.length === 0) {
    throw new Error('No valid transaction rows found in CSV.')
  }

  return transactions
}

export function transactionsToCSV(transactions) {
  const header = 'Date,Description,Payee,Amount,Channel'
  const rows = transactions.map((t) =>
    [t.date, `"${t.description}"`, `"${t.payee}"`, t.amount, t.channel].join(',')
  )
  return [header, ...rows].join('\n')
}
