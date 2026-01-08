import type { DomainResult, SearchConstraints, WhoisData } from '@/types'
import { calculateBrandability } from './brandability'
import { assessRisk } from './risk'
import { generateId } from './utils'
import { checkDomainAvailability, batchCheckDomains } from './whois'

// API Configuration
const DOMAINR_API_KEY = import.meta.env.VITE_DOMAINR_API_KEY
const WHOISXML_API_KEY = import.meta.env.VITE_WHOISXML_API_KEY

/**
 * Check domain availability using Domainr API
 * Docs: https://domainr.build/docs/api
 */
async function checkDomainrAvailability(domain: string): Promise<{
  available: boolean
  status: string
}> {
  if (!DOMAINR_API_KEY) {
    console.warn('Domainr API key not configured')
    return { available: false, status: 'unknown' }
  }

  try {
    const response = await fetch(
      `https://domainr.p.rapidapi.com/v2/status?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          'X-RapidAPI-Key': DOMAINR_API_KEY,
          'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) throw new Error('Domainr API error')

    const data = await response.json()
    const status = data.status?.[0]?.status || 'unknown'

    return {
      available: status === 'undelegated' || status === 'inactive',
      status
    }
  } catch (error) {
    console.error('Domainr API error:', error)
    return { available: false, status: 'error' }
  }
}

/**
 * Get WHOIS data using WhoisXML API
 * Docs: https://whois.whoisxmlapi.com/documentation/making-requests
 */
async function getWhoisData(domain: string): Promise<WhoisData | null> {
  if (!WHOISXML_API_KEY) {
    console.warn('WhoisXML API key not configured')
    return null
  }

  try {
    const response = await fetch(
      `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOISXML_API_KEY}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`
    )

    if (!response.ok) throw new Error('WhoisXML API error')

    const data = await response.json()
    const record = data.WhoisRecord

    if (!record) return null

    return {
      registrar: record.registrarName || 'Unknown',
      createdDate: record.createdDate,
      expiryDate: record.expiresDate,
      updatedDate: record.updatedDate,
      status: record.status || [],
      nameservers: record.nameServers?.hostNames || []
    }
  } catch (error) {
    console.error('WhoisXML API error:', error)
    return null
  }
}

/**
 * Check domain availability using multi-layer approach
 * Uses RDAP + DNS checking (no API keys needed)
 * This is similar to how Domainr works internally
 */
async function checkDNSAvailability(domain: string): Promise<boolean> {
  try {
    // Use the new RDAP/DNS multi-layer checker
    const result = await checkDomainAvailability(domain)
    
    // Log the check method and confidence for debugging
    console.log(`${domain}: ${result.available ? 'Available' : 'Taken'} (${result.confidence} confidence via ${result.method}) - ${result.details}`)
    
    return result.available
  } catch (error) {
    console.error('Domain availability check error:', error)
    return false // Assume taken on error to be safe
  }
}

/**
 * Get registrar pricing (you'll need to implement API calls to each registrar)
 */
async function getRegistrarPricing(domain: string, tld: string) {
  // This would require integrating with each registrar's API
  // For now, return estimated pricing
  const prices: Record<string, number> = {
    com: 12.99,
    io: 39.99,
    ai: 79.99,
    dev: 12.99,
    app: 14.99,
    co: 24.99,
  }

  return {
    price: prices[tld] || 15.99,
    renewalPrice: (prices[tld] || 15.99) * 1.2,
    registrar: 'Multiple'
  }
}

/**
 * Real domain search with actual API calls
 */
export async function searchDomainsReal(
  query: string,
  constraints: SearchConstraints
): Promise<DomainResult[]> {
  const results: DomainResult[] = []
  const baseDomains = generateDomainVariations(query, constraints)

  // Limit concurrent requests to avoid rate limiting
  const batchSize = 5
  
  for (let i = 0; i < baseDomains.length; i += batchSize) {
    const batch = baseDomains.slice(i, i + batchSize)
    
    const batchPromises = batch.flatMap(domainName => 
      constraints.selectedTLDs.slice(0, 10).map(async (tld) => {
        const fullDomain = `${domainName}.${tld}`

        try {
          // Check availability using available method
          let isAvailable = false
          let whoisData: WhoisData | null = null
          let availabilityStatus: 'available' | 'taken' | 'premium' | 'on-hold' = 'taken'
          let confidence: 'high' | 'medium' | 'low' = 'low'
          let checkMethod = 'DNS'

          if (DOMAINR_API_KEY) {
            // Use Domainr API (most accurate)
            const domainrResult = await checkDomainrAvailability(fullDomain)
            isAvailable = domainrResult.available
            availabilityStatus = isAvailable ? 'available' : 'taken'
            confidence = 'high'
            checkMethod = 'Domainr API'
          } else {
            // Use multi-layer RDAP + DNS check
            const checkResult = await checkDomainAvailability(fullDomain)
            isAvailable = checkResult.available
            availabilityStatus = isAvailable ? 'available' : 'taken'
            confidence = checkResult.confidence
            checkMethod = checkResult.method
          }

          // Get WHOIS data if domain is taken
          if (!isAvailable && WHOISXML_API_KEY) {
            whoisData = await getWhoisData(fullDomain)
          }

          const pricing = await getRegistrarPricing(fullDomain, tld)
          const brandability = calculateBrandability(fullDomain)
          const risk = assessRisk(fullDomain)

          return {
            id: generateId(),
            domain: fullDomain,
            tld,
            availability: isAvailable ? 'available' : 'taken',
            price: isAvailable ? pricing.price : undefined,
            renewalPrice: isAvailable ? pricing.renewalPrice : undefined,
            registrar: isAvailable ? pricing.registrar : whoisData?.registrar,
            brandabilityScore: brandability.overall,
            riskScore: risk,
            whoisData,
            confidence,
            checkMethod,
          } as DomainResult
        } catch (error) {
          console.error(`Error checking ${fullDomain}:`, error)
          return null
        }
      })
    )

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults.filter((r): r is DomainResult => r !== null))

    // Add delay between batches to respect rate limits
    if (i + batchSize < baseDomains.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return results
}

function generateDomainVariations(query: string, constraints: SearchConstraints): string[] {
  const variations = new Set<string>()
  const clean = query.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  variations.add(clean)
  
  for (const prefix of constraints.prefixes) {
    variations.add(prefix + clean)
  }
  
  for (const suffix of constraints.suffixes) {
    variations.add(clean + suffix)
  }
  
  for (const prefix of constraints.prefixes) {
    for (const suffix of constraints.suffixes) {
      variations.add(prefix + clean + suffix)
    }
  }

  return Array.from(variations)
    .filter(d => 
      d.length >= constraints.minLength && 
      d.length <= constraints.maxLength &&
      (!constraints.allowNumerics ? !/\d/.test(d) : true) &&
      (!constraints.allowHyphens ? !d.includes('-') : true)
    )
    .slice(0, 20) // Limit to prevent excessive API calls
}
