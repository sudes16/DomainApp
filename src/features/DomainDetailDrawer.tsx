import { X, ExternalLink, DollarSign, Shield, BarChart3, Twitter, Github, Linkedin, Youtube, Volume2, Copy, Star } from 'lucide-react'
import type { DomainResult } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { calculateBrandability } from '@/lib/brandability'
import { useAppStore } from '@/store/appStore'

interface DomainDetailDrawerProps {
  domain: DomainResult
  onClose: () => void
}

export default function DomainDetailDrawer({ domain, onClose }: DomainDetailDrawerProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAppStore()
  const isInWatchlist = watchlist.some((item) => item.id === domain.id)
  
  const brandability = calculateBrandability(domain.domain)

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

  // Mock price comparison data
  const priceComparisons = [
    { registrar: 'GoDaddy', firstYear: 12.99, renewal: 17.99, features: ['Privacy', 'DNSSEC'] },
    { registrar: 'Namecheap', firstYear: 10.98, renewal: 12.98, features: ['Free Privacy', 'DNS'] },
    { registrar: 'Cloudflare', firstYear: 9.77, renewal: 9.77, features: ['Privacy', 'CDN'] },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 h-full w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 truncate">
              {domain.domain}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  domain.availability === 'available'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {domain.availability}
              </span>
              {domain.price && (
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(domain.price)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isInWatchlist
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Star className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
              {isInWatchlist ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            {domain.availability === 'available' && (
              <button className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Register
              </button>
            )}
          </div>

          {/* Brandability Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Brandability Analysis
              </h3>
            </div>

            <div className="space-y-4">
              {/* Overall Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Overall Score
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {brandability.overall}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      brandability.overall >= 70
                        ? 'bg-green-500'
                        : brandability.overall >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${brandability.overall}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pronounceability</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {brandability.pronounceability}/100
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Memorability</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {brandability.memorability}/100
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Syllables</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {brandability.syllableCount}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Stress Pattern</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {brandability.stressPattern}
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">{brandability.explanation}</p>
              </div>

              {/* TTS Preview */}
              <button className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4" />
                Listen to Pronunciation
              </button>
            </div>
          </div>

          {/* Risk Guard */}
          {domain.riskScore && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Risk Guard™</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Risk Level</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      domain.riskScore.level === 'low'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : domain.riskScore.level === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {domain.riskScore.level.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">DGA Pattern:</span>{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {domain.riskScore.isDGA ? 'Detected' : 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Homoglyphs:</span>{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {domain.riskScore.hasHomoglyphs ? 'Found' : 'None'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Trademark Similarity:</span>{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {Math.round(domain.riskScore.trademarkSimilarity * 100)}%
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {domain.riskScore.rationale}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price Comparison */}
          {domain.availability === 'available' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Price Comparison
              </h3>
              <div className="space-y-3">
                {priceComparisons.map((comp) => (
                  <div
                    key={comp.registrar}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {comp.registrar}
                      </span>
                      <button className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                        Visit →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">First Year</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(comp.firstYear)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Renewal</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(comp.renewal)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {comp.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Handles */}
          {domain.socialHandles && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Social Handle Availability
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Twitter/X', icon: Twitter, available: domain.socialHandles.twitter },
                  { name: 'GitHub', icon: Github, available: domain.socialHandles.github },
                  { name: 'LinkedIn', icon: Linkedin, available: domain.socialHandles.linkedin },
                  { name: 'YouTube', icon: Youtube, available: domain.socialHandles.youtube },
                ].map((social) => {
                  const Icon = social.icon
                  return (
                    <div
                      key={social.name}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        social.available
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {social.name}
                        </div>
                        <div
                          className={`text-xs ${
                            social.available
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {social.available ? 'Available' : 'Taken'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* WHOIS Data */}
          {domain.whoisData && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                RDAP/WHOIS Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Registrar:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {domain.whoisData.registrar}
                  </span>
                </div>
                {domain.whoisData.createdDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(domain.whoisData.createdDate)}
                    </span>
                  </div>
                )}
                {domain.whoisData.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(domain.whoisData.expiryDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
