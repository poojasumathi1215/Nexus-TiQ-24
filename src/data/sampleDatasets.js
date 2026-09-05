// Sample transaction datasets for the investigation assistant

// Routine Activity — normal salary deposits, bill payments, grocery spending
export const routineDataset = [
  { date: '2026-08-01', description: 'Payroll Deposit - ACME Corp', payee: 'ACME Corp Payroll', amount: 4200.0, channel: 'ACH Deposit' },
  { date: '2026-08-02', description: 'Grocery Shopping', payee: 'Whole Foods Market', amount: 87.34, channel: 'Debit Card' },
  { date: '2026-08-03', description: 'Electric Bill Payment', payee: 'CityPower Utilities', amount: 142.50, channel: 'Online Banking' },
  { date: '2026-08-05', description: 'Grocery Shopping', payee: 'Whole Foods Market', amount: 76.19, channel: 'Debit Card' },
  { date: '2026-08-07', description: 'Streaming Subscription', payee: 'Netflix', amount: 15.99, channel: 'Online Banking' },
  { date: '2026-08-10', description: 'Gas Station', payee: 'Shell Gas', amount: 52.40, channel: 'Debit Card' },
  { date: '2026-08-12', description: 'Restaurant Dinner', payee: 'Olive Garden', amount: 68.75, channel: 'Debit Card' },
  { date: '2026-08-15', description: 'Payroll Deposit - ACME Corp', payee: 'ACME Corp Payroll', amount: 4200.0, channel: 'ACH Deposit' },
  { date: '2026-08-16', description: 'Grocery Shopping', payee: 'Whole Foods Market', amount: 91.22, channel: 'Debit Card' },
  { date: '2026-08-18', description: 'Internet Bill Payment', payee: 'Comcast Xfinity', amount: 89.99, channel: 'Online Banking' },
  { date: '2026-08-20', description: 'Pharmacy', payee: 'CVS Pharmacy', amount: 34.10, channel: 'Debit Card' },
  { date: '2026-08-22', description: 'Gas Station', payee: 'Shell Gas', amount: 48.75, channel: 'Debit Card' },
  { date: '2026-08-25', description: 'Grocery Shopping', payee: 'Whole Foods Market', amount: 82.44, channel: 'Debit Card' },
  { date: '2026-08-28', description: 'Phone Bill Payment', payee: 'Verizon Wireless', amount: 75.00, channel: 'Online Banking' },
  { date: '2026-08-30', description: 'Restaurant Lunch', payee: 'Chipotle', amount: 24.30, channel: 'Debit Card' },
]

// Suspicious Pattern — late-night new payee, micro-test, then large exfiltration
export const suspiciousDataset = [
  { date: '2026-08-01', description: 'Payroll Deposit - ACME Corp', payee: 'ACME Corp Payroll', amount: 4200.0, channel: 'ACH Deposit' },
  { date: '2026-08-02', description: 'Grocery Shopping', payee: 'Whole Foods Market', amount: 87.34, channel: 'Debit Card' },
  { date: '2026-08-03', description: 'Electric Bill Payment', payee: 'CityPower Utilities', amount: 142.50, channel: 'Online Banking' },
  { date: '2026-08-05', description: 'Grocery Shopping', payee: 'Whole Foods Market', amount: 76.19, channel: 'Debit Card' },
  { date: '2026-08-07', description: 'Streaming Subscription', payee: 'Netflix', amount: 15.99, channel: 'Online Banking' },
  { date: '2026-08-10', description: 'Gas Station', payee: 'Shell Gas', amount: 52.40, channel: 'Debit Card' },
  { date: '2026-08-12', description: 'Restaurant Dinner', payee: 'Olive Garden', amount: 68.75, channel: 'Debit Card' },
  { date: '2026-08-15', description: 'Payroll Deposit - ACME Corp', payee: 'ACME Corp Payroll', amount: 4200.0, channel: 'ACH Deposit' },
  { date: '2026-08-16', description: 'Grocery Shopping', payee: 'Whole Foods Market', amount: 91.22, channel: 'Debit Card' },
  { date: '2026-08-18', description: 'Internet Bill Payment', payee: 'Comcast Xfinity', amount: 89.99, channel: 'Online Banking' },
  // --- Suspicious activity begins ---
  { date: '2026-08-21 02:14', description: 'New Payee Added - Wire Transfer', payee: 'Global Ventures Holdings', amount: 5.00, channel: 'Wire Transfer' },
  { date: '2026-08-21 02:18', description: 'Test Transfer', payee: 'Global Ventures Holdings', amount: 12.00, channel: 'Wire Transfer' },
  { date: '2026-08-21 02:42', description: 'International Wire Transfer', payee: 'Global Ventures Holdings', amount: 3850.00, channel: 'Wire Transfer' },
  { date: '2026-08-22 03:05', description: 'New Payee Added - Crypto Exchange', payee: 'CoinBase Pro', amount: 3.00, channel: 'Online Banking' },
  { date: '2026-08-22 03:09', description: 'Test Transfer', payee: 'CoinBase Pro', amount: 7.50, channel: 'Online Banking' },
  { date: '2026-08-22 03:31', description: 'Crypto Purchase', payee: 'CoinBase Pro', amount: 2900.00, channel: 'Online Banking' },
]

export const sampleDatasets = {
  routine: {
    label: 'Routine Activity',
    description: 'Normal salary deposits, bill payments, grocery spending — no flags expected.',
    transactions: routineDataset,
  },
  suspicious: {
    label: 'Suspicious Pattern',
    description: 'Late-night new payee addition, micro-test transfers, followed by large exfiltration.',
    transactions: suspiciousDataset,
  },
}
