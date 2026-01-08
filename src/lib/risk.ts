import type { RiskScore } from '@/types'

// Common homoglyphs (visually similar characters)
const homoglyphs: Record<string, string[]> = {
  'o': ['0', 'ο', 'о'],
  '0': ['o', 'O'],
  'l': ['1', 'I', '|'],
  '1': ['l', 'I'],
  'a': ['а'],
  'e': ['е'],
  'i': ['і'],
  'c': ['с'],
}

// Known trademark terms (simplified list for demo)
const trademarkTerms = [
  'google', 'facebook', 'amazon', 'apple', 'microsoft',
  'twitter', 'netflix', 'tesla', 'nike', 'adidas',
  'mcdonalds', 'starbucks', 'coca-cola', 'pepsi', 'visa',
]

export function assessRisk(domain: string): RiskScore {
  const name = domain.split('.')[0].toLowerCase()
  
  // Calculate entropy
  const entropy = calculateEntropy(name)
  
  // Check for DGA patterns
  const isDGA = detectDGA(name, entropy)
  
  // Check for homoglyphs
  const hasHomoglyphs = detectHomoglyphs(name)
  
  // Check trademark similarity
  const trademarkSimilarity = checkTrademarkSimilarity(name)
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high'
  if (isDGA || hasHomoglyphs || trademarkSimilarity > 0.8) {
    level = 'high'
  } else if (entropy > 4.5 || trademarkSimilarity > 0.6) {
    level = 'medium'
  } else {
    level = 'low'
  }
  
  // Generate rationale
  const rationale = generateRationale(level, isDGA, hasHomoglyphs, entropy, trademarkSimilarity)
  
  return {
    level,
    entropy,
    isDGA,
    hasHomoglyphs,
    trademarkSimilarity,
    rationale,
  }
}

function calculateEntropy(str: string): number {
  const len = str.length
  const frequencies: Record<string, number> = {}
  
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1
  }
  
  let entropy = 0
  for (const char in frequencies) {
    const p = frequencies[char] / len
    entropy -= p * Math.log2(p)
  }
  
  return entropy
}

function detectDGA(name: string, entropy: number): boolean {
  // DGA (Domain Generation Algorithm) patterns:
  // 1. Very high entropy (random-looking)
  // 2. Unusual character distribution
  // 3. Long strings with low vowel count
  
  if (entropy > 4.8) return true
  
  const vowelCount = (name.match(/[aeiou]/g) || []).length
  const vowelRatio = vowelCount / name.length
  
  // Too few vowels in a long domain
  if (name.length > 10 && vowelRatio < 0.2) return true
  
  // Check for repeating n-grams (common in DGAs)
  if (hasHighNgramRepetition(name)) return true
  
  return false
}

function hasHighNgramRepetition(str: string): boolean {
  const ngrams = new Set<string>()
  let repetitions = 0
  
  for (let i = 0; i < str.length - 2; i++) {
    const ngram = str.substring(i, i + 3)
    if (ngrams.has(ngram)) {
      repetitions++
    }
    ngrams.add(ngram)
  }
  
  return repetitions > str.length * 0.3
}

function detectHomoglyphs(name: string): boolean {
  for (const char of name) {
    // Check if character has homoglyphs and might be suspicious
    if (homoglyphs[char]) {
      // This is a simplified check - in production, you'd check against
      // actual registered domains
      return true
    }
  }
  return false
}

function checkTrademarkSimilarity(name: string): number {
  let maxSimilarity = 0
  
  for (const trademark of trademarkTerms) {
    const similarity = calculateSimilarity(name, trademark)
    maxSimilarity = Math.max(maxSimilarity, similarity)
  }
  
  return maxSimilarity
}

function calculateSimilarity(str1: string, str2: string): number {
  // Levenshtein distance normalized to 0-1
  const distance = levenshteinDistance(str1, str2)
  const maxLen = Math.max(str1.length, str2.length)
  return 1 - distance / maxLen
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

function generateRationale(
  _level: 'low' | 'medium' | 'high',
  isDGA: boolean,
  hasHomoglyphs: boolean,
  entropy: number,
  trademarkSimilarity: number
): string {
  const issues: string[] = []
  
  if (isDGA) {
    issues.push('suspicious pattern suggests DGA')
  }
  
  if (hasHomoglyphs) {
    issues.push('contains characters with visual lookalikes')
  }
  
  if (trademarkSimilarity > 0.8) {
    issues.push('very similar to known trademark')
  } else if (trademarkSimilarity > 0.6) {
    issues.push('moderately similar to known trademark')
  }
  
  if (entropy > 4.8) {
    issues.push('unusually high randomness')
  }
  
  if (issues.length === 0) {
    return 'Typical domain string with no obvious risk indicators; normal entropy profile.'
  }
  
  return `Caution: ${issues.join('; ')}.`
}
