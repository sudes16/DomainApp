import { Link, useLocation } from 'react-router-dom'
import { Search, Star, Settings, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useAppStore } from '@/store/appStore'

export default function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const { watchlist, comparisonList } = useAppStore()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Search', icon: Search },
    { path: '/watchlist', label: 'Watchlist', icon: Star, badge: watchlist.length },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
              Domain Hunter
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  ) : null}
                </Link>
              )
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </nav>
        </div>

        {/* Comparison Bar */}
        {comparisonList.length > 0 && (
          <div className="py-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Comparing {comparisonList.length} domain{comparisonList.length !== 1 ? 's' : ''}
              </span>
              <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                View Comparison
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
