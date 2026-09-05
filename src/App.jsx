import { useState, useRef, useCallback } from 'react'
import { sampleDatasets } from './data/sampleDatasets'
import { analyzeTransactions, formatCurrency, formatDate } from './utils/riskAnalysis'
import { parseCSV, transactionsToCSV } from './utils/csvParser'
import InputPanel from './components/InputPanel'
import ReportDashboard from './components/ReportDashboard'

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = useCallback((txs) => {
    if (!txs || txs.length === 0) {
      setError('Please load a dataset or upload a CSV before analyzing.')
      return
    }
    setError('')
    setIsAnalyzing(true)
    // Simulate brief processing delay for UX feedback
    setTimeout(() => {
      const result = analyzeTransactions(txs)
      setAnalysisResult(result)
      setIsAnalyzing(false)
    }, 600)
  }, [])

  const handleLoadSample = useCallback((key) => {
    setError('')
    const dataset = sampleDatasets[key]
    if (dataset) {
      setTransactions(dataset.transactions)
      setAnalysisResult(null)
    }
  }, [])

  const handleUploadCSV = useCallback((file) => {
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const txs = parseCSV(e.target.result)
        setTransactions(txs)
        setAnalysisResult(null)
      } catch (err) {
        setError(err.message)
      }
    }
    reader.onerror = () => setError('Failed to read file.')
    reader.readAsText(file)
  }, [])

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Transaction Risk Investigation Assistant</h1>
                <p className="text-xs text-slate-400">Fraud Desk — Anomaly Detection & Risk Analysis</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse-soft" />
              <span>System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Panel — 2/5 width on desktop */}
          <div className="lg:col-span-2">
            <InputPanel
              transactions={transactions}
              onLoadSample={handleLoadSample}
              onUploadCSV={handleUploadCSV}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              error={error}
            />
          </div>

          {/* Report Dashboard — 3/5 width on desktop */}
          <div className="lg:col-span-3">
            <ReportDashboard
              result={analysisResult}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-slate-500 text-center">
            This tool flags anomalies and provides risk insights only. It does not determine or conclude that fraud has occurred.
            All flagged items reference transactions present in the input dataset.
          </p>
        </div>
      </footer>
    </div>
  )
}
