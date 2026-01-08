import { Save } from 'lucide-react'

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your preferences and defaults</p>
      </div>

      <div className="space-y-6">
        {/* Default TLDs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Default TLDs</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select which TLDs to search by default
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['.com', '.io', '.ai', '.dev', '.app', '.co'].map((tld) => (
              <label key={tld} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{tld}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Registrar Preferences */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Preferred Registrars
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose registrars for price comparison
          </p>
          <div className="space-y-2">
            {['GoDaddy', 'Namecheap', 'Google Domains', 'Cloudflare', 'Porkbun'].map((registrar) => (
              <label key={registrar} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{registrar}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Currency & Locale */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Currency & Locale
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Locale
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Notifications
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive alerts via email
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Push Notifications
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Browser notifications for alerts
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alert Frequency
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <option>Immediate</option>
                <option>Daily Digest</option>
                <option>Weekly Summary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Privacy</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Opt out of tracking
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Disable analytics and usage tracking
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
              Clear cached lookups
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
