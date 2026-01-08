// Domain availability status
export type AvailabilityStatus = 'available' | 'taken' | 'premium' | 'on-hold' | 'checking'

// Domain result from search
export interface DomainResult {
  id: string
  domain: string
  tld: string
  availability: AvailabilityStatus
  price?: number
  renewalPrice?: number
  registrar?: string
  brandabilityScore?: number
  riskScore?: RiskScore
  whoisData?: WhoisData
  socialHandles?: SocialHandleStatus
  confidence?: 'high' | 'medium' | 'low'
  checkMethod?: string
}

// Brandability scoring details
export interface BrandabilityScore {
  overall: number // 0-100
  pronounceability: number
  memorability: number
  syllableCount: number
  stressPattern: string
  consonantClusters: string[]
  spellingAmbiguity: 'low' | 'medium' | 'high'
  explanation: string
}

// Risk assessment
export interface RiskScore {
  level: 'low' | 'medium' | 'high'
  entropy: number
  isDGA: boolean
  hasHomoglyphs: boolean
  trademarkSimilarity: number
  rationale: string
}

// WHOIS/RDAP data
export interface WhoisData {
  registrar: string
  createdDate?: string
  expiryDate?: string
  updatedDate?: string
  status: string[]
  nameservers?: string[]
}

// Social handle availability
export interface SocialHandleStatus {
  twitter: boolean
  github: boolean
  linkedin: boolean
  youtube: boolean
}

// TLD configuration
export interface TLD {
  name: string
  extension: string
  category: 'popular' | 'tech' | 'business' | 'creative' | 'niche'
  description: string
  avgPrice: number
}

// Search constraints
export interface SearchConstraints {
  minLength: number
  maxLength: number
  vowelConsonantRatio: number
  allowNumerics: boolean
  allowHyphens: boolean
  prefixes: string[]
  suffixes: string[]
  enforcePattern?: 'CVC' | 'CV' | 'VCV' | null
  selectedTLDs: string[]
}

// Price comparison across registrars
export interface PriceComparison {
  registrar: string
  firstYearPrice: number
  renewalPrice: number
  totalCostTwoYears: number
  features: string[]
}

// AI suggestion
export interface AISuggestion {
  domain: string
  tld: string
  explanation: string
  topic: string
  tone: string
  industry: string
}

// Watchlist item
export interface WatchlistItem extends DomainResult {
  addedAt: Date
  alerts: {
    priceDrops: boolean
    expiry: boolean
    ownershipChange: boolean
  }
  notes?: string
}

// User preferences
export interface UserPreferences {
  defaultTLDs: string[]
  preferredRegistrars: string[]
  currency: string
  locale: string
  notifications: {
    email: boolean
    push: boolean
    cadence: 'immediate' | 'daily' | 'weekly'
  }
  privacy: {
    trackingOptOut: boolean
    clearCache: boolean
  }
}
