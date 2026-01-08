import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/appStore'

export default function ConstraintAccordion() {
  const [isOpen, setIsOpen] = useState(false)
  const { constraints, updateConstraints } = useAppStore()

  const patterns = [
    { value: null, label: 'Any' },
    { value: 'CVC', label: 'CVC (Consonant-Vowel-Consonant)' },
    { value: 'CV', label: 'CV (Consonant-Vowel)' },
    { value: 'VCV', label: 'VCV (Vowel-Consonant-Vowel)' },
  ] as const

  const addChip = (type: 'prefixes' | 'suffixes', value: string) => {
    if (!value.trim()) return
    const current = constraints[type]
    if (!current.includes(value)) {
      updateConstraints({ [type]: [...current, value] })
    }
  }

  const removeChip = (type: 'prefixes' | 'suffixes', value: string) => {
    const current = constraints[type]
    updateConstraints({ [type]: current.filter((v) => v !== value) })
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-gray-100">Search Constraints</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
          {/* Length */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Character Length: {constraints.minLength} - {constraints.maxLength}
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Min</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={constraints.minLength}
                  onChange={(e) => updateConstraints({ minLength: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Max</label>
                <input
                  type="range"
                  min="1"
                  max="63"
                  value={constraints.maxLength}
                  onChange={(e) => updateConstraints({ maxLength: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Vowel/Consonant Ratio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vowel/Consonant Balance: {Math.round(constraints.vowelConsonantRatio * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={constraints.vowelConsonantRatio}
              onChange={(e) => updateConstraints({ vowelConsonantRatio: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>More Consonants</span>
              <span>Balanced</span>
              <span>More Vowels</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={constraints.allowNumerics}
                onChange={(e) => updateConstraints({ allowNumerics: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Allow Numerics</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={constraints.allowHyphens}
                onChange={(e) => updateConstraints({ allowHyphens: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Allow Hyphens</span>
            </label>
          </div>

          {/* Pattern Enforcement */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pronounceability Pattern
            </label>
            <select
              value={constraints.enforcePattern || ''}
              onChange={(e) => updateConstraints({ enforcePattern: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {patterns.map((p) => (
                <option key={p.label} value={p.value || ''}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prefixes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prefixes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {constraints.prefixes.map((prefix) => (
                <span
                  key={prefix}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
                >
                  {prefix}
                  <button
                    onClick={() => removeChip('prefixes', prefix)}
                    className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add prefix (e.g., 'get', 'my', 'go')"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addChip('prefixes', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Suffixes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Suffixes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {constraints.suffixes.map((suffix) => (
                <span
                  key={suffix}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
                >
                  {suffix}
                  <button
                    onClick={() => removeChip('suffixes', suffix)}
                    className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add suffix (e.g., 'app', 'hub', 'ly')"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addChip('suffixes', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
