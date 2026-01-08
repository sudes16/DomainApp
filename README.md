# Domain Hunter 🎯

**Smart Domain Availability & Brandability App**

Domain Hunter helps you discover and validate available domain names with advanced constraints, real-time availability checks, brandability scoring, risk detection, and price comparison.

## Features

### 🔍 Smart Search
- **Real-time availability** across 60+ TLDs
- **Advanced constraints**: character length, vowel/consonant ratio, numerics, hyphens, patterns
- **Instant suggestions** with availability badges
- **Bulk search** (up to 5,000 domains via CSV)

### 🎨 Brandability Analysis
- **Pronounceability scoring** with syllable analysis
- **Memorability metrics** and linguistic flow
- **TTS preview** with "say-spell" test
- **Social handle availability** across major platforms

### 🛡️ Risk Guard™
- **DGA pattern detection** and entropy analysis
- **Homoglyph/typosquatting** detection
- **Trademark similarity** warnings
- **RDAP/WHOIS** lookup

### 💰 Smart Pricing
- **Multi-registrar comparison** (GoDaddy, Namecheap, Google Domains, etc.)
- **Total cost of ownership** (first year + renewal)
- **Premium domain** detection
- **Price drop alerts**

### 📊 Portfolio Management
- **Watchlist** with favorites
- **Expiry alerts** and auto-renew health checks
- **Price monitoring** and ownership change detection

### 🤖 AI-Powered
- **AI name generation** by topic, tone, industry
- **Explainable suggestions** with brandability rationale
- **Pattern-based discovery** (prefixes, suffixes, domain hacks)

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# (Optional) Configure API keys for real availability checking
cp .env.example .env
# Edit .env and add your API keys

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Real Domain Checking

The app works out-of-the-box with free DNS-based checking, but for production use:

1. **Get API keys** (optional but recommended):
   - Domainr API: https://rapidapi.com/domainr/api/domainr (100 free requests/month)
   - WhoisXML API: https://whoisxmlapi.com (1,000 free credits)

2. **Add to `.env` file:**
   ```env
   VITE_DOMAINR_API_KEY=your_key_here
   VITE_WHOISXML_API_KEY=your_key_here
   ```

3. **Restart the server**

See [SETUP.md](SETUP.md) for detailed API setup instructions.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for responsive, theme-aware styling
- **Zustand** for state management
- **React Virtual** for virtualized lists
- **Lucide React** for icons

## Architecture

```
src/
├── components/       # Reusable UI components
├── features/         # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── pages/           # Page components
├── store/           # State management
└── types/           # TypeScript type definitions
```

## Accessibility

- WCAG AA compliant
- Full keyboard navigation
- ARIA labels and live regions
- Adjustable contrast themes

## API Integration

The app supports pluggable providers for:
- Domain availability (Domainr, registrar APIs)
- RDAP/WHOIS lookups
- Price comparison
- AI name generation
- Social handle checks

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for domain hunters worldwide
