import type { DomainResult, SearchConstraints, SocialHandleStatus, WhoisData } from '@/types'
import { calculateBrandability } from './brandability'
import { assessRisk } from './risk'
import { generateId } from './utils'

// Mock API - In production, these would be real API calls
export async function searchDomains(
  query: string,
  constraints: SearchConstraints
): Promise<DomainResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  const results: DomainResult[] = []
  const baseDomains = generateDomainVariations(query, constraints)
  
  for (const domain of baseDomains) {
    for (const tld of constraints.selectedTLDs.slice(0, 10)) { // Limit for demo
      const fullDomain = `${domain}.${tld}`
      
      // Mock availability (random for demo)
      const availability = getRandomAvailability()
      
      // Skip if constraints don't match
      if (!meetsConstraints(domain, constraints)) continue
      
      const brandability = calculateBrandability(fullDomain)
      const risk = assessRisk(fullDomain)
      
      results.push({
        id: generateId(),
        domain: fullDomain,
        tld,
        availability,
        price: availability === 'available' ? getPrice(tld) : undefined,
        renewalPrice: availability === 'available' ? getRenewalPrice(tld) : undefined,
        registrar: availability === 'available' ? getRandomRegistrar() : undefined,
        brandabilityScore: brandability.overall,
        riskScore: risk,
        whoisData: availability === 'taken' ? getMockWhoisData() : undefined,
        socialHandles: getMockSocialHandles(domain),
      })
    }
  }
  
  return results.slice(0, 50) // Limit results
}

function generateDomainVariations(query: string, constraints: SearchConstraints): string[] {
  const variations = new Set<string>()
  const clean = query.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  // Original
  variations.add(clean)
  
  // With prefixes
  for (const prefix of constraints.prefixes) {
    variations.add(prefix + clean)
  }
  
  // With suffixes
  for (const suffix of constraints.suffixes) {
    variations.add(clean + suffix)
  }
  
  // With both
  for (const prefix of constraints.prefixes) {
    for (const suffix of constraints.suffixes) {
      variations.add(prefix + clean + suffix)
    }
  }
  
  // Similar variations
  if (clean.length > 3) {
    variations.add(clean + 'app')
    variations.add(clean + 'hub')
    variations.add(clean + 'ly')
    variations.add('get' + clean)
    variations.add('my' + clean)
  }
  
  return Array.from(variations).filter(d => 
    d.length >= constraints.minLength && 
    d.length <= constraints.maxLength
  )
}

function meetsConstraints(domain: string, constraints: SearchConstraints): boolean {
  if (domain.length < constraints.minLength || domain.length > constraints.maxLength) {
    return false
  }
  
  if (!constraints.allowNumerics && /\d/.test(domain)) {
    return false
  }
  
  if (!constraints.allowHyphens && domain.includes('-')) {
    return false
  }
  
  return true
}

function getRandomAvailability(): DomainResult['availability'] {
  const rand = Math.random()
  if (rand < 0.15) return 'available'  // Only 15% available
  if (rand < 0.85) return 'taken'      // 70% taken
  if (rand < 0.95) return 'premium'    // 10% premium
  return 'on-hold'                      // 5% on-hold
}

function getPrice(tld: string): number {
  const prices: Record<string, number> = {
    com: 12,
    io: 39,
    ai: 79,
    dev: 12,
    app: 14,
    co: 25,
    tech: 15,
    xyz: 2,
    online: 12,
  }
  return prices[tld] || 15
}

function getRenewalPrice(tld: string): number {
  return getPrice(tld) * 1.2
}

function getRandomRegistrar(): string {
  const registrars = ['GoDaddy', 'Namecheap', 'Google Domains', 'Cloudflare', 'Porkbun']
  return registrars[Math.floor(Math.random() * registrars.length)]
}

function getMockWhoisData(): WhoisData {
  return {
    registrar: 'Example Registrar Inc.',
    createdDate: '2020-05-15',
    expiryDate: '2026-05-15',
    updatedDate: '2025-01-01',
    status: ['clientTransferProhibited'],
    nameservers: ['ns1.example.com', 'ns2.example.com'],
  }
}

function getMockSocialHandles(domain: string): SocialHandleStatus {
  return {
    twitter: Math.random() > 0.5,
    github: Math.random() > 0.5,
    linkedin: Math.random() > 0.5,
    youtube: Math.random() > 0.5,
  }
}

// AI Suggestions
export async function generateAISuggestions(
  topic: string,
  tone: 'professional' | 'playful' | 'modern' | 'classic',
  industry: string
): Promise<Array<{ domain: string; explanation: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const suggestions = [
    {
      domain: `${topic}hub.io`,
      explanation: `"Hub" suffix conveys centralization and community; .io extension is tech-forward and popular with startups.`,
    },
    {
      domain: `get${topic}.app`,
      explanation: `"Get" prefix is action-oriented and clear; .app extension signals it's an application platform.`,
    },
    {
      domain: `${topic}pro.dev`,
      explanation: `"Pro" suffix indicates professional-grade quality; .dev extension targets developer audience.`,
    },
    {
      domain: `my${topic}.ai`,
      explanation: `Personal "my" prefix creates ownership feeling; .ai extension perfect for AI/ML ${industry} tools.`,
    },
  ]
  
  return suggestions
}

// Bulk search
export async function bulkSearch(domains: string[]): Promise<DomainResult[]> {
  // Process in chunks to avoid overwhelming the API
  const results: DomainResult[] = []
  
  for (const domain of domains) {
    const tld = domain.split('.').pop() || 'com'
    const name = domain.split('.')[0]
    
    const availability = getRandomAvailability()
    const brandability = calculateBrandability(domain)
    const risk = assessRisk(domain)
    
    results.push({
      id: generateId(),
      domain,
      tld,
      availability,
      price: availability === 'available' ? getPrice(tld) : undefined,
      renewalPrice: availability === 'available' ? getRenewalPrice(tld) : undefined,
      registrar: availability === 'available' ? getRandomRegistrar() : undefined,
      brandabilityScore: brandability.overall,
      riskScore: risk,
    })
    
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  
  return results
}
