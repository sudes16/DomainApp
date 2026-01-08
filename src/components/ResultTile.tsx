import { Star, Copy, ArrowUpRight, BarChart3, AlertTriangle, CheckCircle2, Clock, DollarSign } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import type { DomainResult } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ResultTileProps {
  domain: DomainResult
}

export default function ResultTile({ domain }: ResultTileProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist, setSelectedDomain, addToComparison, comparisonList } = useAppStore()
  
  const isInWatchlist = watchlist.some((item) => item.id === domain.id)
  const isInComparison = comparisonList.some((item) => item.id === domain.id)

  const handleSave = () => {
    if (isInWatchlist) {
      removeFromWatchlist(domain.id)
    } else {
      addToWatchlist({
        ...domain,
        addedAt: new Date(),
        alerts: {
          priceDrops: true,
          expiry: false,
          ownershipChange: false,
        },
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(domain.domain)
  }

  const handleCompare = () => {
    if (!isInComparison) {
      addToComparison(domain)
    }
  }

  const getAvailabilityBadge = () => {
    const badges = {
      available: { label: 'Available', icon: CheckCircle2, className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
      taken: { label: 'Taken', icon: AlertTriangle, className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700' },
      premium: { label: 'Premium', icon: DollarSign, className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
      'on-hold': { label: 'On Hold', icon: Clock, className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700' },
      checking: { label: 'Checking...', icon: Clock, className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
    }

    const badge = badges[domain.availability]
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badge.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    )
  }

  const getRiskBadge = () => {
    if (!domain.riskScore) return null

    const colors = {
      low: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      high: 'text-red-600 dark:text-red-400',
    }

    return (
      <span className={`text-xs font-medium ${colors[domain.riskScore.level]}`}>
        Risk: {domain.riskScore.level}
      </span>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setSelectedDomain(domain)}
            className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate block w-full text-left"
          >
            {domain.domain}
          </button>
          <div className="flex items-center gap-2 mt-1">
            {getAvailabilityBadge()}
            {getRiskBadge()}
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`p-2 rounded-lg transition-colors ${
            isInWatchlist
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
          }`}
          title={isInWatchlist ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          <Star className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Pricing */}
      {domain.price && (
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {formatPrice(domain.price)}
            {domain.renewalPrice && (
              <span className="text-xs ml-1">
                (renew: {formatPrice(domain.renewalPrice)})
              </span>
            )}
          </span>
          {domain.registrar && (
            <span className="text-xs text-gray-500 dark:text-gray-500">via {domain.registrar}</span>
          )}
        </div>
      )}

      {/* Brandability Score */}
      {domain.brandabilityScore !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Brandability</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {domain.brandabilityScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                domain.brandabilityScore >= 70
                  ? 'bg-green-500'
                  : domain.brandabilityScore >= 40
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${domain.brandabilityScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleCopy}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1"
          title="Copy domain"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
        <button
          onClick={handleCompare}
          disabled={isInComparison}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
            isInComparison
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title={isInComparison ? 'Already in comparison' : 'Add to comparison'}
        >
          <BarChart3 className="w-4 h-4" />
          {isInComparison ? 'Added' : 'Compare'}
        </button>
        {domain.availability === 'available' && (
          <button
            className="px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center justify-center gap-1"
            title="Open registrar"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
