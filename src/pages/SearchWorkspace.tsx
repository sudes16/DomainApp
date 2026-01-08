import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import SearchBar from '@/components/SearchBar'
import ConstraintAccordion from '@/components/ConstraintAccordion'
import TLDMultiSelect from '@/components/TLDMultiSelect'
import ResultTile from '@/components/ResultTile'
import DNSAccuracyWarning from '@/components/DNSAccuracyWarning'
import BulkSearchModal from '@/features/BulkSearchModal'
import AIIdeasPane from '@/features/AIIdeasPane'
import DomainDetailDrawer from '@/features/DomainDetailDrawer'
import DictionaryScanner from '@/features/DictionaryScanner'
import { Sparkles, Upload, BookOpen } from 'lucide-react'

export default function SearchWorkspace() {
  const { searchResults, selectedDomain, setSelectedDomain, bulkSearchActive, setBulkSearchActive } = useAppStore()
  const [showAIIdeas, setShowAIIdeas] = useState(false)
  const [showDictionary, setShowDictionary] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Find Your Perfect Domain
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover available domains with smart constraints, brandability scoring, and risk detection
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* DNS Accuracy Warning */}
      <DNSAccuracyWarning />

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setBulkSearchActive(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Bulk Search
        </button>
        <button
          onClick={() => {
            setShowAIIdeas(!showAIIdeas)
            if (!showAIIdeas) setShowDictionary(false)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showAIIdeas
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Suggestions
        </button>
        <button
          onClick={() => {
            setShowDictionary(!showDictionary)
            if (!showDictionary) setShowAIIdeas(false)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showDictionary
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Dictionary Scanner
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Constraints */}
        <div className="lg:col-span-1 space-y-4">
          <ConstraintAccordion />
          <TLDMultiSelect />
        </div>

        {/* Main Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI Ideas Pane */}
          {showAIIdeas && <AIIdeasPane />}

          {/* Dictionary Scanner */}
          {showDictionary && <DictionaryScanner />}

          {/* Results */}
          {searchResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {searchResults.length} Results
                </h2>
                <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <button className="hover:text-gray-900 dark:hover:text-gray-100">
                    Sort by: Relevance
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <ResultTile key={result.id} domain={result} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Enter keywords or exact domains above to discover available names. Use constraints to refine your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {bulkSearchActive && <BulkSearchModal onClose={() => setBulkSearchActive(false)} />}
      {selectedDomain && (
        <DomainDetailDrawer domain={selectedDomain} onClose={() => setSelectedDomain(null)} />
      )}
    </div>
  )
}
