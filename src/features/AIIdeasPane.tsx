import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { generateAISuggestions } from '@/lib/api'

interface AIIdeasPaneProps {
  onSelectSuggestion?: (domain: string) => void
}

export default function AIIdeasPane({ onSelectSuggestion }: AIIdeasPaneProps) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<'professional' | 'playful' | 'modern' | 'classic'>('modern')
  const [industry, setIndustry] = useState('tech')
  const [suggestions, setSuggestions] = useState<Array<{ domain: string; explanation: string }>>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setLoading(true)
    try {
      const results = await generateAISuggestions(topic, tone, industry)
      setSuggestions(results)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            AI-Powered Suggestions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Get brandable name ideas tailored to your industry and tone
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Topic/Keyword
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., analytics, fitness, chat"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="professional">Professional</option>
            <option value="playful">Playful</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry
          </label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g., tech, healthcare"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Ideas
          </>
        )}
      </button>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Suggestions</h4>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {suggestion.domain}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.explanation}</p>
                </div>
                <button
                  onClick={() => onSelectSuggestion?.(suggestion.domain)}
                  className="ml-4 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                >
                  Try It
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
