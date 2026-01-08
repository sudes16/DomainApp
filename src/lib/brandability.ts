import type { BrandabilityScore } from '@/types'

const vowels = new Set(['a', 'e', 'i', 'o', 'u'])
const difficultClusters = ['scht', 'pfr', 'tsch', 'xtr', 'chtl', 'pft', 'str', 'spr', 'scr']

export function calculateBrandability(domain: string): BrandabilityScore {
  // Remove TLD for analysis
  const name = domain.split('.')[0].toLowerCase()
  
  // Count syllables (approximate)
  const syllableCount = countSyllables(name)
  
  // Pronounceability score
  const pronounceability = calculatePronounceability(name)
  
  // Memorability (shorter = better, but not too short)
  const memorability = calculateMemorability(name, syllableCount)
  
  // Detect consonant clusters
  const consonantClusters = findConsonantClusters(name)
  
  // Stress pattern (simple heuristic)
  const stressPattern = getStressPattern(syllableCount)
  
  // Spelling ambiguity
  const spellingAmbiguity = assessSpellingAmbiguity(name)
  
  // Overall score (weighted average)
  const overall = Math.round(
    pronounceability * 0.4 +
    memorability * 0.3 +
    (consonantClusters.length === 0 ? 100 : Math.max(0, 100 - consonantClusters.length * 15)) * 0.3
  )
  
  // Generate explanation
  const explanation = generateExplanation(
    overall,
    syllableCount,
    consonantClusters,
    spellingAmbiguity
  )
  
  return {
    overall,
    pronounceability,
    memorability,
    syllableCount,
    stressPattern,
    consonantClusters,
    spellingAmbiguity,
    explanation,
  }
}

function countSyllables(word: string): number {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  
  // Simple syllable counting
  let count = 0
  let previousWasVowel = false
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.has(word[i])
    if (isVowel && !previousWasVowel) {
      count++
    }
    previousWasVowel = isVowel
  }
  
  // Adjust for silent 'e'
  if (word.endsWith('e')) {
    count--
  }
  
  return Math.max(1, count)
}

function calculatePronounceability(word: string): number {
  let score = 100
  
  // Penalize for difficult consonant clusters
  for (const cluster of difficultClusters) {
    if (word.includes(cluster)) {
      score -= 20
    }
  }
  
  // Penalize for too many consecutive consonants
  const maxConsonants = findMaxConsecutiveConsonants(word)
  if (maxConsonants > 3) {
    score -= (maxConsonants - 3) * 15
  }
  
  // Reward for alternating vowel-consonant pattern
  const alternationScore = assessAlternation(word)
  score += alternationScore * 10
  
  return Math.max(0, Math.min(100, score))
}

function calculateMemorability(word: string, syllableCount: number): number {
  let score = 100
  
  // Optimal length is 6-10 characters
  if (word.length < 4) {
    score -= (4 - word.length) * 10
  } else if (word.length > 12) {
    score -= (word.length - 12) * 5
  }
  
  // Optimal syllables is 2-3
  if (syllableCount < 2) {
    score -= 15
  } else if (syllableCount > 4) {
    score -= (syllableCount - 4) * 10
  }
  
  // Check for repeated patterns (good for memory)
  if (hasRepeatingPattern(word)) {
    score += 10
  }
  
  return Math.max(0, Math.min(100, score))
}

function findConsonantClusters(word: string): string[] {
  const clusters: string[] = []
  let currentCluster = ''
  
  for (let i = 0; i < word.length; i++) {
    if (!vowels.has(word[i])) {
      currentCluster += word[i]
    } else {
      if (currentCluster.length >= 3) {
        clusters.push(currentCluster)
      }
      currentCluster = ''
    }
  }
  
  if (currentCluster.length >= 3) {
    clusters.push(currentCluster)
  }
  
  return clusters
}

function findMaxConsecutiveConsonants(word: string): number {
  let max = 0
  let current = 0
  
  for (let i = 0; i < word.length; i++) {
    if (!vowels.has(word[i])) {
      current++
      max = Math.max(max, current)
    } else {
      current = 0
    }
  }
  
  return max
}

function assessAlternation(word: string): number {
  let alternations = 0
  let previousWasVowel = vowels.has(word[0])
  
  for (let i = 1; i < word.length; i++) {
    const isVowel = vowels.has(word[i])
    if (isVowel !== previousWasVowel) {
      alternations++
    }
    previousWasVowel = isVowel
  }
  
  return Math.min(10, alternations / word.length * 10)
}

function hasRepeatingPattern(word: string): boolean {
  // Check for doubled letters or simple patterns
  for (let i = 0; i < word.length - 1; i++) {
    if (word[i] === word[i + 1]) return true
  }
  return false
}

function getStressPattern(syllableCount: number): string {
  // Simple stress patterns
  if (syllableCount === 1) return 'Mono'
  if (syllableCount === 2) return 'Trochaic (1st)'
  if (syllableCount === 3) return 'Dactylic (1st)'
  return `${syllableCount}-syllable`
}

function assessSpellingAmbiguity(word: string): 'low' | 'medium' | 'high' {
  // Check for ambiguous letter combinations
  const ambiguousPatterns = ['ph', 'gh', 'ough', 'ei', 'ie', 'c', 'k', 'qu']
  let ambiguityCount = 0
  
  for (const pattern of ambiguousPatterns) {
    if (word.includes(pattern)) {
      ambiguityCount++
    }
  }
  
  if (ambiguityCount === 0) return 'low'
  if (ambiguityCount <= 2) return 'medium'
  return 'high'
}

function generateExplanation(
  overall: number,
  syllableCount: number,
  consonantClusters: string[],
  spellingAmbiguity: 'low' | 'medium' | 'high'
): string {
  const parts: string[] = []
  
  if (syllableCount <= 3) {
    parts.push(`${syllableCount} syllable${syllableCount > 1 ? 's' : ''}`)
  } else {
    parts.push(`${syllableCount} syllables (may be challenging)`)
  }
  
  if (consonantClusters.length === 0) {
    parts.push('smooth consonant flow')
  } else {
    parts.push(`${consonantClusters.length} difficult cluster${consonantClusters.length > 1 ? 's' : ''}`)
  }
  
  if (spellingAmbiguity === 'low') {
    parts.push('unambiguous spelling')
  }
  
  if (overall >= 80) {
    return `Excellent brandability: ${parts.join(', ')}.`
  } else if (overall >= 60) {
    return `Good brandability: ${parts.join(', ')}.`
  } else if (overall >= 40) {
    return `Moderate brandability: ${parts.join(', ')}.`
  } else {
    return `Challenging brandability: ${parts.join(', ')}.`
  }
}
