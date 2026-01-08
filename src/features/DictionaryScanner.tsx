import { useState, useEffect } from 'react'
import { BookOpen, Search, Filter, Sparkles, Download, TrendingUp } from 'lucide-react'
import { getWordsByLength, getWordLengthStats } from '@/lib/dictionary'
import { searchDomainsReal } from '@/lib/realApi'
import { useAppStore } from '@/store/appStore'
import type { DomainResult } from '@/types'

export default function DictionaryScanner() {
  const { constraints, setSearchResults } = useAppStore()
  const [characterLength, setCharacterLength] = useState(4)
  const [searching, setSearching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<DomainResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [lengthStats, setLengthStats] = useState<Record<number, number>>({})

  useEffect(() => {
    setLengthStats(getWordLengthStats())
  }, [])

  const handleScan = async () => {
    setSearching(true)
    setProgress(0)
    setShowResults(false)

    try {
      // Get words by length
      const words = getWordsByLength(characterLength)

      if (words.length === 0) {
        alert(`No dictionary words found with ${characterLength} characters`)
        setSearching(false)
        return
      }

      const allResults: DomainResult[] = []
      const totalWords = words.length // Check all words of this length

      // Check each word with selected TLDs
      for (let i = 0; i < totalWords; i++) {
        const word = words[i]
        
        // Search this word
        const domainResults = await searchDomainsReal(word, {
          ...constraints,
          selectedTLDs: constraints.selectedTLDs.slice(0, 3), // Limit TLDs to save API calls
        })

        allResults.push(...domainResults)
        setProgress(Math.round(((i + 1) / totalWords) * 100))

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setResults(allResults)
      setShowResults(true)
    } catch (error) {
      console.error('Dictionary scan error:', error)
      alert('Scan failed. Please try again.')
    } finally {
      setSearching(false)
      setProgress(0)
    }
  }

  const handleLoadToWorkspace = () => {
    setSearchResults(results)
    setShowResults(false)
  }

  const handleExportCSV = () => {
    const csv = [
      'Word,Domain,TLD,Availability,Brand Score',
      ...results.map(r => {
        const word = r.domain.split('.')[0]
        return `${word},${r.domain},${r.tld},${r.availability},${r.brandabilityScore || 'N/A'}`
      })
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dictionary-scan-${characterLength}-chars.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const availableCount = results.filter(r => r.availability === 'available').length
  const filteredWords = getWordsByLength(characterLength)
  const minLength = Math.min(...Object.keys(lengthStats).map(Number))
  const maxLength = Math.max(...Object.keys(lengthStats).map(Number))

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dictionary Word Scanner</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scan all dictionary words by character length
          </p>
        </div>
      </div>

      {/* Character Length Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Number of Characters ({filteredWords.length} words found)
        </label>
        
        {/* Slider */}
        <div className="mb-4">
          <input
            type="range"
            min={minLength}
            max={maxLength}
            value={characterLength}
            onChange={(e) => setCharacterLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{minLength} chars</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {characterLength}
            </span>
            <span>{maxLength} chars</span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: maxLength - minLength + 1 }, (_, i) => i + minLength).map((len) => {
            const count = lengthStats[len] || 0
            return (
              <button
                key={len}
                onClick={() => setCharacterLength(len)}
                disabled={count === 0}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  characterLength === len
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : count > 0
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                }`}
                title={`${count} words with ${len} characters`}
              >
                <div className="font-bold">{len}</div>
                <div className="text-xs opacity-75">{count}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Length</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {characterLength}
          </div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Words</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {filteredWords.length}
          </div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">TLDs</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {constraints.selectedTLDs.slice(0, 3).length}
          </div>
        </div>
      </div>

      {/* Preview Words */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preview ({filteredWords.length} words):
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {filteredWords.slice(0, 50).map((word) => (
            <span
              key={word}
              className="px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
            >
              {word}
            </span>
          ))}
          {filteredWords.length > 50 && (
            <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
              +{filteredWords.length - 50} more...
            </span>
          )}
        </div>
      </div>

      {/* TLD Selection Note */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Will scan all {filteredWords.length} words with {characterLength} characters across top 3 TLDs: {constraints.selectedTLDs.slice(0, 3).map(t => `.${t}`).join(', ')}
        </p>
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={searching || filteredWords.length === 0}
        className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
      >
        {searching ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Scanning... {progress}%
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Scan All {filteredWords.length} Words
          </>
        )}
      </button>

      {/* Progress Bar */}
      {searching && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Scan Results
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {availableCount} available out of {results.length} checked
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleLoadToWorkspace}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Load to Workspace
              </button>
            </div>
          </div>

          {/* Available Domains */}
          {availableCount > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                ✓ Available Domains ({availableCount})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {results
                  .filter(r => r.availability === 'available')
                  .map(result => (
                    <div
                      key={result.id}
                      className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {result.domain}
                      </div>
                      {result.brandabilityScore && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Brand: {result.brandabilityScore}/100
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="font-bold text-green-700 dark:text-green-300">
                {results.filter(r => r.availability === 'available').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="font-bold text-gray-700 dark:text-gray-300">
                {results.filter(r => r.availability === 'taken').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Taken</div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="font-bold text-yellow-700 dark:text-yellow-300">
                {results.filter(r => r.availability === 'premium').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Premium</div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="font-bold text-orange-700 dark:text-orange-300">
                {results.filter(r => r.availability === 'on-hold').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">On-Hold</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
