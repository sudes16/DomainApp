import { Search, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/appStore'
import { searchDomainsReal } from '@/lib/realApi'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = 'Search for your perfect domain...' }: SearchBarProps) {
  const { searchQuery, setSearchQuery, constraints, setSearchResults } = useAppStore()
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (searchQuery.length > 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      
      debounceRef.current = setTimeout(async () => {
        setIsSearching(true)
        try {
          const results = await searchDomainsReal(searchQuery, constraints)
          setSearchResults(results)
          // Generate suggestions
          const suggs = results.slice(0, 5).map(r => r.domain)
          setSuggestions(suggs)
          setShowSuggestions(suggs.length > 0)
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsSearching(false)
        }
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, constraints, setSearchResults])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
    onSearch?.(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
          placeholder={placeholder}
          aria-label="Domain search"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
            >
              <span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Press Enter
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Enter to search • Shift+Enter for bulk search • S to save • C to compare</span>
      </div>
    </div>
  )
}
