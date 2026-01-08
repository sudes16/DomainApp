import { AlertTriangle } from 'lucide-react'

export default function DNSAccuracyWarning() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
            Multi-Layer Availability Checking
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
            Using <strong>RDAP + Enhanced DNS</strong> for domain verification (similar to Domainr's approach). 
            Results show confidence level: <span className="font-semibold">High</span> = registry confirmed, <span className="font-semibold">Medium</span> = DNS indicators, <span className="font-semibold">Low</span> = verify manually.
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Always verify on registrar sites before purchasing.</strong> For 100% accuracy, add a Domainr API key to <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded">.env</code> file.
          </p>
        </div>
      </div>
    </div>
  )
}
