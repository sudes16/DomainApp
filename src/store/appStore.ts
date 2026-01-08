import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DomainResult, SearchConstraints, WatchlistItem } from '@/types'

interface AppStore {
  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  searchResults: DomainResult[]
  setSearchResults: (results: DomainResult[]) => void
  
  constraints: SearchConstraints
  updateConstraints: (constraints: Partial<SearchConstraints>) => void
  
  // Watchlist
  watchlist: WatchlistItem[]
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (id: string) => void
  updateWatchlistItem: (id: string, updates: Partial<WatchlistItem>) => void
  
  // Selected domain for detail view
  selectedDomain: DomainResult | null
  setSelectedDomain: (domain: DomainResult | null) => void
  
  // Comparison
  comparisonList: DomainResult[]
  addToComparison: (domain: DomainResult) => void
  removeFromComparison: (id: string) => void
  clearComparison: () => void
  
  // Bulk search
  bulkSearchActive: boolean
  setBulkSearchActive: (active: boolean) => void
}

const defaultConstraints: SearchConstraints = {
  minLength: 3,
  maxLength: 15,
  vowelConsonantRatio: 0.5,
  allowNumerics: false,
  allowHyphens: false,
  prefixes: [],
  suffixes: [],
  enforcePattern: null,
  selectedTLDs: ['com', 'io', 'ai', 'dev', 'app', 'co'],
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),
      
      constraints: defaultConstraints,
      updateConstraints: (updates) => set((state) => ({
        constraints: { ...state.constraints, ...updates }
      })),
      
      watchlist: [],
      addToWatchlist: (item) => set((state) => ({
        watchlist: [...state.watchlist, item]
      })),
      removeFromWatchlist: (id) => set((state) => ({
        watchlist: state.watchlist.filter((item) => item.id !== id)
      })),
      updateWatchlistItem: (id, updates) => set((state) => ({
        watchlist: state.watchlist.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      selectedDomain: null,
      setSelectedDomain: (domain) => set({ selectedDomain: domain }),
      
      comparisonList: [],
      addToComparison: (domain) => set((state) => ({
        comparisonList: [...state.comparisonList, domain]
      })),
      removeFromComparison: (id) => set((state) => ({
        comparisonList: state.comparisonList.filter((d) => d.id !== id)
      })),
      clearComparison: () => set({ comparisonList: [] }),
      
      bulkSearchActive: false,
      setBulkSearchActive: (active) => set({ bulkSearchActive: active }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        constraints: state.constraints,
      }),
    }
  )
)
