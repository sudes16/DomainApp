# Domain Hunter 🎯

**Smart Domain Availability & Brandability App**

A comprehensive domain search tool that helps you discover available domains with real-time availability checking, brandability scoring, and intelligent suggestions.

![Domain Hunter](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🔍 Smart Domain Search
- **Real-time Availability Checking**: Multi-layer RDAP + DNS checking (~90% accuracy)
- **Brandability Scoring**: AI-powered analysis of domain memorability, pronounceability, and marketability
- **Risk Guard™**: Identify potential trademark conflicts and risky domains
- **Multiple TLD Support**: Search across 30+ popular TLDs (.com, .io, .dev, .ai, etc.)

### 🤖 AI-Powered Tools
- **AI Suggestions**: Get creative domain ideas based on your topic and industry
- **Tone & Industry Filtering**: Professional, playful, modern, or classic suggestions
- **Smart Constraints**: Filter by length, pattern (CVC, CV, VCV), hyphens, and numbers

### 📚 Dictionary Scanner
- **358,612 English Words**: Comprehensive dictionary database
- **Length-Based Filtering**: Find available domains by character count (3-15 letters)
- **Real-time Progress**: Live scanning with availability checking
- **Export Results**: Download available domains as JSON

### 🔧 Advanced Features
- **Bulk Search**: Check multiple domains simultaneously
- **Watchlist**: Track and monitor favorite domains
- **Historical Tracking**: View when domains were last checked
- **Dark Mode**: Beautiful dark theme support
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# (Optional) Configure API keys for real availability checking

### Installation

```bash
# Clone the repository
git clone https://github.com/sudes16/DomainApp.git
cd DomainApp

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 + TypeScript 5.3.3
- **Build Tool**: Vite 5.0.12
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Zustand 4.5.0
- **Routing**: React Router 6.22.0
- **Icons**: Lucide React
- **Domain Checking**: RDAP + DNS (no API keys required)

## 📖 How It Works

### Multi-Layer Domain Availability Checking

Domain Hunter uses a sophisticated multi-layer approach similar to Domainr:

1. **RDAP Query** (Primary)
   - Queries official domain registries
   - Most accurate method (~95% accuracy)
   - Supports major TLDs (.com, .net, .org, etc.)

2. **Enhanced DNS Check** (Fallback)
   - Multiple DNS record checks (A, AAAA, MX, NS, TXT, SOA)
   - Parking page detection
   - NXDOMAIN analysis

3. **Heuristic Analysis** (Confidence Scoring)
   - Combines multiple signals
   - Returns confidence level (high/medium/low)
   - Details about check method and timestamp

### Brandability Scoring

Each domain is scored across multiple dimensions:

- **Length Score**: Shorter is better (4-12 chars ideal)
- **Pronounceability**: Vowel-consonant balance, phonetic flow
- **Memorability**: Repetition, common patterns, uniqueness
- **Professional Score**: Dictionary words, clarity, market fit

## 🔐 Privacy & Security

- **No External APIs Required**: Works without API keys or third-party services
- **Client-Side Processing**: All checks run in your browser
- **No Data Collection**: Your searches stay private

## 📊 Dictionary Database

The app includes a comprehensive English dictionary with 358,612 words:

```bash
# Fetch the latest dictionary (already included)
node scripts/fetch-dictionary.js
```

**Word Distribution:**
- 3-6 chars: 55,111 words
- 7-9 chars: 147,027 words  
- 10-12 chars: 112,535 words
- 13-15 chars: 43,939 words

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Domain availability checking inspired by [Domainr](https://domainr.com/)
- Dictionary data from MIT Word List
- Built with ❤️ using React + TypeScript + Vite

## 📧 Contact

Created by [@sudes16](https://github.com/sudes16)

---

**Happy Domain Hunting! 🎯**
