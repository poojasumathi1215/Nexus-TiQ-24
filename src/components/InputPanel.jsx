import { useRef, useState } from 'react'
import { sampleDatasets } from '../data/sampleDatasets'
import { transactionsToCSV } from '../utils/csvParser'
import { formatCurrency, formatDate } from '../utils/riskAnalysis'

export default function InputPanel({
  transactions,
  onLoadSample,
  onUploadCSV,
  onAnalyze,
  isAnalyzing,
  error,
}) {
  const fileInputRef = useRef(null)
  const [selectedSample, setSelectedSample] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onUploadCSV(file)
    e.target.value = ''
  }

  const handleSampleChange = (e) => {
    const key = e.target.value
    setSelectedSample(key)
    if (key) onLoadSample(key)
  }

  return (
    <div className="card p-5 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Investigator Input Panel</h2>
        <p className="text-sm text-slate-500">
          Load a sample dataset or upload a customer transaction history CSV to begin analysis.
        </p>
      </div>

      {/* Sample Dataset Dropdown */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Pre-loaded Sample Datasets
        </label>
        <select
          value={selectedSample}
          onChange={handleSampleChange}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                     transition-colors cursor-pointer"
        >
          <option value="">— Select a dataset —</option>
          {Object.entries(sampleDatasets).map(([key, ds]) => (
            <option key={key} value={key}>
              {ds.label}
            </option>
          ))}
        </select>
        {selectedSample && (
          <p className="mt-1.5 text-xs text-slate-500 animate-fade-in">
            {sampleDatasets[selectedSample]?.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* CSV Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Upload Transaction CSV
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer
                     hover:border-brand-400 hover:bg-brand-50/30 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-slate-400 group-hover:text-brand-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm text-slate-600 font-medium">Click to upload CSV file</p>
          <p className="text-xs text-slate-400 mt-1">Columns: Date, Description, Payee, Amount, Channel</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-slide-down">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loaded Transactions Preview */}
      {transactions.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700">
              Loaded Transactions
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {transactions.length} records
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0">
                <tr className="text-left text-slate-600">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Payee</th>
                  <th className="px-3 py-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-1.5 text-slate-600 whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="px-3 py-1.5 text-slate-700 truncate max-w-[120px]">{tx.payee}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-slate-700">{formatCurrency(tx.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={() => onAnalyze(transactions)}
        disabled={isAnalyzing || transactions.length === 0}
        className="btn-primary w-full"
      >
        {isAnalyzing ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Analyze History
          </>
        )}
      </button>
    </div>
  )
}
