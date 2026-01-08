import { X, Upload, FileText, Loader2, Download } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { bulkSearch } from '@/lib/api'
import type { DomainResult } from '@/types'

interface BulkSearchModalProps {
  onClose: () => void
}

export default function BulkSearchModal({ onClose }: BulkSearchModalProps) {
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<DomainResult[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { setSearchResults } = useAppStore()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setInput(text)
      }
      reader.readAsText(uploadedFile)
    }
  }

  const handleBulkSearch = async () => {
    const domains = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (domains.length === 0) return

    setLoading(true)
    setProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const searchResults = await bulkSearch(domains)
      setResults(searchResults)
      clearInterval(interval)
      setProgress(100)
    } catch (error) {
      console.error('Bulk search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadToWorkspace = () => {
    setSearchResults(results)
    onClose()
  }

  const handleExportCSV = () => {
    const csv = [
      'Domain,Availability,Price,Brandability Score,Risk Level',
      ...results.map(
        (r) =>
          `${r.domain},${r.availability},${r.price || 'N/A'},${r.brandabilityScore || 'N/A'},${r.riskScore?.level || 'N/A'}`
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'domain-search-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bulk Domain Search</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Search up to 5,000 domains at once
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {results.length === 0 ? (
            <>
              {/* Input Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter domains (one per line) or upload CSV
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="example.com&#10;mysite.io&#10;brandname.ai"
                  className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {file ? file.name : 'Click to upload CSV file'}
                    </span>
                  </div>
                  <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Progress */}
              {loading && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Processing...</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Results Summary */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.filter((r) => r.availability === 'available').length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Available</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {results.filter((r) => r.availability === 'taken').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Taken</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {results.filter((r) => r.availability === 'premium').length}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Premium</div>
                </div>
              </div>

              {/* Results Table */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Domain
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Brand Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {results.map((result) => (
                        <tr key={result.id}>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {result.domain}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                result.availability === 'available'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {result.availability}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {result.price ? `$${result.price}` : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {result.brandabilityScore ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {results.length > 0
              ? `${results.length} domains processed`
              : `${input.split('\n').filter((l) => l.trim()).length} domains ready`}
          </div>
          <div className="flex gap-3">
            {results.length > 0 ? (
              <>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={handleLoadToWorkspace}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Load to Workspace
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkSearch}
                  disabled={loading || input.trim().length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Search Domains
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
