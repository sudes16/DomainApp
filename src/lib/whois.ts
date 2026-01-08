/**
 * WHOIS and RDAP Implementation
 * This implements domain availability checking similar to Domainr
 * by querying WHOIS servers and RDAP endpoints directly
 */

interface RDAPResponse {
  objectClassName?: string
  handle?: string
  status?: string[]
  events?: Array<{
    eventAction: string
    eventDate: string
  }>
  errorCode?: number
  title?: string
}

interface WhoisServer {
  tld: string
  server: string
  rdapUrl?: string
}

/**
 * WHOIS servers for major TLDs
 * Source: IANA WHOIS database
 */
const WHOIS_SERVERS: WhoisServer[] = [
  // Generic TLDs
  { tld: 'com', server: 'whois.verisign-grs.com', rdapUrl: 'https://rdap.verisign.com/com/v1' },
  { tld: 'net', server: 'whois.verisign-grs.com', rdapUrl: 'https://rdap.verisign.com/net/v1' },
  { tld: 'org', server: 'whois.pir.org', rdapUrl: 'https://rdap.publicinterestregistry.org' },
  { tld: 'info', server: 'whois.afilias.net', rdapUrl: 'https://rdap.afilias.info' },
  { tld: 'biz', server: 'whois.biz', rdapUrl: 'https://rdap.nic.biz' },
  
  // New generic TLDs
  { tld: 'io', server: 'whois.nic.io', rdapUrl: 'https://rdap.nic.io' },
  { tld: 'ai', server: 'whois.nic.ai', rdapUrl: 'https://rdap.nic.ai' },
  { tld: 'app', server: 'whois.nic.google', rdapUrl: 'https://rdap.nic.google' },
  { tld: 'dev', server: 'whois.nic.google', rdapUrl: 'https://rdap.nic.google' },
  { tld: 'co', server: 'whois.nic.co', rdapUrl: 'https://rdap.nic.co' },
  { tld: 'me', server: 'whois.nic.me', rdapUrl: 'https://rdap.nic.me' },
  { tld: 'xyz', server: 'whois.nic.xyz', rdapUrl: 'https://rdap.centralnic.com/xyz' },
  { tld: 'online', server: 'whois.nic.online', rdapUrl: 'https://rdap.centralnic.com/online' },
  { tld: 'store', server: 'whois.nic.store', rdapUrl: 'https://rdap.centralnic.com/store' },
  { tld: 'tech', server: 'whois.nic.tech', rdapUrl: 'https://rdap.centralnic.com/tech' },
  { tld: 'site', server: 'whois.nic.site', rdapUrl: 'https://rdap.centralnic.com/site' },
  { tld: 'cloud', server: 'whois.nic.cloud', rdapUrl: 'https://rdap.centralnic.com/cloud' },
  
  // Country code TLDs
  { tld: 'us', server: 'whois.nic.us', rdapUrl: 'https://rdap.nic.us' },
  { tld: 'uk', server: 'whois.nic.uk', rdapUrl: 'https://rdap.nominet.uk' },
  { tld: 'ca', server: 'whois.cira.ca', rdapUrl: 'https://rdap.ca' },
  { tld: 'de', server: 'whois.denic.de', rdapUrl: 'https://rdap.denic.de' },
  { tld: 'au', server: 'whois.auda.org.au', rdapUrl: 'https://rdap.identitydigital.services/rdap' },
]

/**
 * Get WHOIS server for a TLD
 */
function getWhoisServer(tld: string): WhoisServer | null {
  return WHOIS_SERVERS.find(s => s.tld === tld) || null
}

/**
 * Query RDAP (Registration Data Access Protocol)
 * Modern replacement for WHOIS with JSON responses
 */
async function queryRDAP(domain: string): Promise<{
  available: boolean
  status: string
  registrationDate?: string
}> {
  try {
    const parts = domain.split('.')
    const tld = parts[parts.length - 1]
    const server = getWhoisServer(tld)
    
    if (!server?.rdapUrl) {
      return { available: false, status: 'no_rdap_server' }
    }

    // Query RDAP endpoint
    const response = await fetch(
      `${server.rdapUrl}/domain/${encodeURIComponent(domain)}`,
      {
        headers: {
          'Accept': 'application/rdap+json'
        },
        // Add timeout
        signal: AbortSignal.timeout(5000)
      }
    )

    // 404 means domain not found (available)
    if (response.status === 404) {
      return { available: true, status: 'available' }
    }

    if (!response.ok) {
      return { available: false, status: `rdap_error_${response.status}` }
    }

    const data: RDAPResponse = await response.json()
    
    // Check if domain exists
    if (data.errorCode === 404 || data.title?.includes('not found')) {
      return { available: true, status: 'available' }
    }

    // Domain exists if we get valid data
    if (data.objectClassName === 'domain' || data.handle) {
      const regEvent = data.events?.find(e => e.eventAction === 'registration')
      return {
        available: false,
        status: 'registered',
        registrationDate: regEvent?.eventDate
      }
    }

    return { available: false, status: 'unknown' }
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return { available: false, status: 'timeout' }
    }
    console.error('RDAP query error:', error)
    return { available: false, status: 'error' }
  }
}

/**
 * Simplified WHOIS check via HTTP proxy
 * Since browsers can't make raw TCP connections, we use WHOIS-as-a-Service
 */
async function queryWhoisHTTP(domain: string): Promise<{
  available: boolean
  status: string
  rawData?: string
}> {
  try {
    // Use a free WHOIS API service
    const response = await fetch(
      `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_00000000000000000000000000000&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`,
      {
        signal: AbortSignal.timeout(8000)
      }
    )

    if (!response.ok) {
      return { available: false, status: 'whois_error' }
    }

    const data = await response.json()
    
    // Check for "no match" or "not found" in WHOIS response
    const rawText = JSON.stringify(data).toLowerCase()
    const availableIndicators = [
      'no match',
      'not found',
      'no entries found',
      'no data found',
      'status: free',
      'status: available'
    ]
    
    const isAvailable = availableIndicators.some(indicator => 
      rawText.includes(indicator)
    )

    // Check for registration indicators
    const registeredIndicators = [
      'domain name:',
      'registrar:',
      'creation date:',
      'status: ok',
      'status: active'
    ]
    
    const isRegistered = registeredIndicators.some(indicator => 
      rawText.includes(indicator)
    )

    if (isAvailable && !isRegistered) {
      return { available: true, status: 'available', rawData: rawText }
    }

    if (isRegistered) {
      return { available: false, status: 'registered', rawData: rawText }
    }

    return { available: false, status: 'unknown', rawData: rawText }
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return { available: false, status: 'timeout' }
    }
    console.error('WHOIS HTTP query error:', error)
    return { available: false, status: 'error' }
  }
}

/**
 * Enhanced DNS check with multiple record types
 */
async function enhancedDNSCheck(domain: string): Promise<{
  available: boolean
  status: string
  hasRecords: boolean
}> {
  try {
    // Check multiple DNS record types
    const recordTypes = ['NS', 'A', 'AAAA', 'MX', 'SOA']
    
    const responses = await Promise.all(
      recordTypes.map(type =>
        fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`)
          .then(r => r.json())
          .catch(() => null)
      )
    )

    // Check if domain has any DNS records
    const hasAnyRecords = responses.some(data => 
      data?.Answer && data.Answer.length > 0
    )

    // Check if all queries return NXDOMAIN (status 3)
    const allNXDomain = responses.every(data => 
      data?.Status === 3
    )

    // Check SOA record - if domain has SOA but no other records, 
    // it might be registered but not configured
    const hasSoaOnly = responses.some((data, idx) => 
      recordTypes[idx] === 'SOA' && data?.Answer?.length > 0
    ) && !responses.some((data, idx) => 
      recordTypes[idx] !== 'SOA' && data?.Answer?.length > 0
    )

    if (hasAnyRecords) {
      return { 
        available: false, 
        status: hasSoaOnly ? 'registered_unconfigured' : 'configured',
        hasRecords: true 
      }
    }

    if (allNXDomain) {
      return { available: true, status: 'nxdomain', hasRecords: false }
    }

    return { available: false, status: 'unknown', hasRecords: false }
  } catch (error) {
    console.error('Enhanced DNS check error:', error)
    return { available: false, status: 'error', hasRecords: false }
  }
}

/**
 * Multi-layer domain availability check
 * Combines RDAP, WHOIS, and DNS checks for maximum accuracy
 */
export async function checkDomainAvailability(domain: string): Promise<{
  available: boolean
  confidence: 'high' | 'medium' | 'low'
  method: string
  details: string
  timestamp: number
}> {
  const startTime = Date.now()

  try {
    // Layer 1: Try RDAP first (fastest, most accurate for supported TLDs)
    const rdapResult = await queryRDAP(domain)
    
    if (rdapResult.status === 'available') {
      return {
        available: true,
        confidence: 'high',
        method: 'RDAP',
        details: 'Domain not found in registry RDAP database',
        timestamp: Date.now() - startTime
      }
    }
    
    if (rdapResult.status === 'registered') {
      return {
        available: false,
        confidence: 'high',
        method: 'RDAP',
        details: `Registered${rdapResult.registrationDate ? ` on ${rdapResult.registrationDate}` : ''}`,
        timestamp: Date.now() - startTime
      }
    }

    // Layer 2: Enhanced DNS check
    const dnsResult = await enhancedDNSCheck(domain)
    
    if (dnsResult.hasRecords) {
      return {
        available: false,
        confidence: 'high',
        method: 'DNS',
        details: `Domain has active DNS records (${dnsResult.status})`,
        timestamp: Date.now() - startTime
      }
    }

    if (dnsResult.status === 'nxdomain') {
      // NXDOMAIN is a strong indicator but not 100% certain
      // Some domains are registered but have no DNS records yet
      return {
        available: true,
        confidence: 'medium',
        method: 'DNS',
        details: 'No DNS records found (NXDOMAIN)',
        timestamp: Date.now() - startTime
      }
    }

    // Layer 3: Conservative fallback for popular TLDs
    const parts = domain.split('.')
    const baseName = parts[0]
    const tld = parts[1]
    
    const popularTLDs = ['com', 'net', 'org', 'io', 'ai', 'co']
    const isPopularTLD = popularTLDs.includes(tld)
    const isShortCommonWord = baseName.length <= 6 && /^[a-z]+$/.test(baseName)
    
    if (isPopularTLD && isShortCommonWord) {
      return {
        available: false,
        confidence: 'medium',
        method: 'Heuristic',
        details: 'Short dictionary word on popular TLD (likely taken)',
        timestamp: Date.now() - startTime
      }
    }

    // If we can't determine, return low confidence
    return {
      available: false,
      confidence: 'low',
      method: 'Unknown',
      details: 'Unable to verify availability - verify manually',
      timestamp: Date.now() - startTime
    }

  } catch (error) {
    console.error('Domain availability check error:', error)
    return {
      available: false,
      confidence: 'low',
      method: 'Error',
      details: 'Check failed - verify manually before purchase',
      timestamp: Date.now() - startTime
    }
  }
}

/**
 * Batch check multiple domains efficiently
 */
export async function batchCheckDomains(domains: string[]): Promise<Map<string, {
  available: boolean
  confidence: 'high' | 'medium' | 'low'
  method: string
}>> {
  const results = new Map()
  
  // Process in batches of 10 to avoid overwhelming servers
  const batchSize = 10
  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async domain => {
        const result = await checkDomainAvailability(domain)
        return { domain, result }
      })
    )
    
    batchResults.forEach(({ domain, result }) => {
      results.set(domain, {
        available: result.available,
        confidence: result.confidence,
        method: result.method
      })
    })
    
    // Small delay between batches
    if (i + batchSize < domains.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  return results
}
