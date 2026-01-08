import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { Check } from 'lucide-react'
import type { TLD } from '@/types'

const popularTLDs: TLD[] = [
  { name: '.com', extension: 'com', category: 'popular', description: 'Commercial', avgPrice: 12 },
  { name: '.io', extension: 'io', category: 'tech', description: 'Tech startups', avgPrice: 39 },
  { name: '.ai', extension: 'ai', category: 'tech', description: 'AI/ML companies', avgPrice: 79 },
  { name: '.dev', extension: 'dev', category: 'tech', description: 'Developers', avgPrice: 12 },
  { name: '.app', extension: 'app', category: 'tech', description: 'Applications', avgPrice: 14 },
  { name: '.co', extension: 'co', category: 'popular', description: 'Company', avgPrice: 25 },
]

const techTLDs: TLD[] = [
  { name: '.tech', extension: 'tech', category: 'tech', description: 'Technology', avgPrice: 15 },
  { name: '.digital', extension: 'digital', category: 'tech', description: 'Digital business', avgPrice: 18 },
  { name: '.cloud', extension: 'cloud', category: 'tech', description: 'Cloud services', avgPrice: 20 },
  { name: '.online', extension: 'online', category: 'tech', description: 'Online presence', avgPrice: 12 },
]

const businessTLDs: TLD[] = [
  { name: '.biz', extension: 'biz', category: 'business', description: 'Business', avgPrice: 11 },
  { name: '.inc', extension: 'inc', category: 'business', description: 'Incorporated', avgPrice: 2500 },
  { name: '.llc', extension: 'llc', category: 'business', description: 'Limited Liability', avgPrice: 35 },
  { name: '.company', extension: 'company', category: 'business', description: 'Company', avgPrice: 18 },
]

const creativeTLDs: TLD[] = [
  { name: '.studio', extension: 'studio', category: 'creative', description: 'Studios', avgPrice: 20 },
  { name: '.design', extension: 'design', category: 'creative', description: 'Design', avgPrice: 39 },
  { name: '.art', extension: 'art', category: 'creative', description: 'Art', avgPrice: 12 },
  { name: '.media', extension: 'media', category: 'creative', description: 'Media', avgPrice: 25 },
]

const nicheTLDs: TLD[] = [
  { name: '.xyz', extension: 'xyz', category: 'niche', description: 'Universal', avgPrice: 2 },
  { name: '.site', extension: 'site', category: 'niche', description: 'Website', avgPrice: 8 },
  { name: '.space', extension: 'space', category: 'niche', description: 'Space', avgPrice: 6 },
  { name: '.fun', extension: 'fun', category: 'niche', description: 'Fun', avgPrice: 12 },
]

export default function TLDMultiSelect() {
  const { constraints, updateConstraints } = useAppStore()
  const [expandedCategory, setExpandedCategory] = useState<string | null>('popular')
  const [showAll, setShowAll] = useState(false)

  const toggleTLD = (extension: string) => {
    const selected = constraints.selectedTLDs
    if (selected.includes(extension)) {
      updateConstraints({ selectedTLDs: selected.filter((t) => t !== extension) })
    } else {
      updateConstraints({ selectedTLDs: [...selected, extension] })
    }
  }

  const selectAll = (tlds: TLD[]) => {
    const extensions = tlds.map((t) => t.extension)
    const newSelected = [...new Set([...constraints.selectedTLDs, ...extensions])]
    updateConstraints({ selectedTLDs: newSelected })
  }

  const deselectAll = (tlds: TLD[]) => {
    const extensions = tlds.map((t) => t.extension)
    updateConstraints({
      selectedTLDs: constraints.selectedTLDs.filter((t) => !extensions.includes(t))
    })
  }

  const categories = [
    { id: 'popular', label: 'Popular', tlds: popularTLDs },
    { id: 'tech', label: 'Tech', tlds: techTLDs },
    { id: 'business', label: 'Business', tlds: businessTLDs },
    { id: 'creative', label: 'Creative', tlds: creativeTLDs },
    { id: 'niche', label: 'Niche', tlds: nicheTLDs },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          TLD Selection ({constraints.selectedTLDs.length} selected)
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          {showAll ? 'Show Less' : 'Show All 60+'}
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          if (!showAll && category.id !== 'popular' && expandedCategory !== category.id) {
            return null
          }

          const allSelected = category.tlds.every((t) => constraints.selectedTLDs.includes(t.extension))

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {category.label} ({category.tlds.length})
                </button>
                <button
                  onClick={() => allSelected ? deselectAll(category.tlds) : selectAll(category.tlds)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {category.tlds.map((tld) => {
                  const isSelected = constraints.selectedTLDs.includes(tld.extension)
                  return (
                    <button
                      key={tld.extension}
                      onClick={() => toggleTLD(tld.extension)}
                      className={`relative px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                      title={`${tld.description} - ~$${tld.avgPrice}/yr`}
                    >
                      {tld.name}
                      {isSelected && (
                        <Check className="absolute top-1 right-1 w-3 h-3 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {showAll && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> More TLDs available upon expansion. Select strategically based on your brand and target audience.
          </p>
        </div>
      )}
    </div>
  )
}
