/**
 * Fetch comprehensive English dictionary from MIT repository
 * Downloads 370,000+ words and filters to domain-friendly subset
 */

async function fetchDictionary() {
  console.log('Fetching comprehensive English dictionary...')
  
  try {
    const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const text = await response.text()
    const allWords = text.split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length >= 3 && w.length <= 15 && /^[a-z]+$/.test(w))
    
    console.log(`✅ Fetched ${allWords.length.toLocaleString()} domain-friendly words`)
    
    // Organize by length
    const wordsByLength = {}
    allWords.forEach(word => {
      const len = word.length
      if (!wordsByLength[len]) wordsByLength[len] = []
      wordsByLength[len].push(word)
    })
    
    // Sort each length group
    Object.keys(wordsByLength).forEach(len => {
      wordsByLength[len].sort()
    })
    
    // Generate stats
    const stats = {}
    Object.entries(wordsByLength).forEach(([len, words]) => {
      stats[len] = words.length
    })
    
    // Generate TypeScript file
    const tsContent = `/**
 * Comprehensive English Dictionary for Domain Searches
 * 
 * Source: MIT English Words (dwyl/english-words)
 * Total: ${allWords.length.toLocaleString()} domain-friendly words
 * Range: 3-15 characters, letters only
 * Generated: ${new Date().toISOString()}
 */

// All words organized by character length
export const wordsByLength: Record<number, string[]> = ${JSON.stringify(wordsByLength, null, 2)}

// Word count by length
export const wordStats = ${JSON.stringify(stats, null, 2)}

/**
 * Get words by exact character length
 */
export function getWordsByLength(length: number): string[] {
  return wordsByLength[length] || []
}

/**
 * Get all dictionary words
 */
export function getAllWords(): string[] {
  return Object.values(wordsByLength).flat()
}

/**
 * Get words within a length range
 */
export function getWordsByLengthRange(minLength: number, maxLength: number): string[] {
  const words: string[] = []
  for (let len = minLength; len <= maxLength; len++) {
    words.push(...(wordsByLength[len] || []))
  }
  return words
}

/**
 * Get random words
 */
export function getRandomWords(count: number = 10): string[] {
  const allWords = getAllWords()
  const shuffled = [...allWords].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Get word count statistics by length
 */
export function getWordLengthStats(): Record<number, number> {
  return { ...wordStats }
}

/**
 * Get total word count
 */
export function getTotalWordCount(): number {
  return ${allWords.length}
}

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
`
    
    // Write to file
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const outputPath = path.join(__dirname, '..', 'src', 'lib', 'dictionary.ts')
    
    fs.writeFileSync(outputPath, tsContent, 'utf8')
    
    console.log(`\n📊 Word Distribution:`)
    Object.entries(stats)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .forEach(([len, count]) => {
        console.log(`   ${len} chars: ${count.toLocaleString()} words`)
      })
    
    console.log(`\n✅ Dictionary saved to: ${outputPath}`)
    console.log(`📝 Total: ${allWords.length.toLocaleString()} words`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

fetchDictionary()
