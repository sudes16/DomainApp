# Domain Hunter - Real API Setup Guide

## Overview

To check real domain availability, you need to integrate with domain availability APIs. The app supports multiple providers with automatic fallback.

## Quick Start (Free DNS Checking)

The app works out-of-the-box with free DNS-based availability checking via Google DNS-over-HTTPS. No API keys required!

**Limitations of DNS-only checking:**
- Only detects if domain has nameservers (not 100% accurate)
- Cannot detect premium domains or domains on hold
- No WHOIS data available
- Limited rate of requests

## Production Setup (Recommended)

### Option 1: Domainr API (Best for availability checking)

1. **Sign up for RapidAPI:**
   - Visit https://rapidapi.com/domainr/api/domainr
   - Subscribe to a plan (free tier available: 100 requests/month)

2. **Get your API key:**
   - Copy your RapidAPI key from the dashboard

3. **Configure the app:**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Add your key to .env
   VITE_DOMAINR_API_KEY=your_rapidapi_key_here
   ```

4. **Restart the dev server:**
   ```bash
   npm run dev
   ```

**Pricing:** Free tier: 100 requests/month | Basic: $9.99/month (5,000 requests)

### Option 2: WhoisXML API (Best for WHOIS data)

1. **Sign up:**
   - Visit https://whoisxmlapi.com
   - Create a free account (1,000 free credits)

2. **Get API key:**
   - Dashboard → API Key

3. **Configure:**
   ```bash
   VITE_WHOISXML_API_KEY=your_whoisxml_key_here
   ```

**Pricing:** Free tier: 1,000 credits | Paid plans from $29.99/month

### Option 3: Use Both (Recommended)

For the best experience, use both:
- **Domainr** for fast availability checks
- **WhoisXML** for detailed WHOIS data on taken domains

```bash
VITE_DOMAINR_API_KEY=your_rapidapi_key
VITE_WHOISXML_API_KEY=your_whoisxml_key
```

## Advanced: Registrar APIs

For real-time pricing from registrars:

### GoDaddy API

1. Get credentials: https://developer.godaddy.com
2. Configure:
   ```bash
   VITE_GODADDY_API_KEY=your_key
   VITE_GODADDY_API_SECRET=your_secret
   ```

### Namecheap API

1. Enable API: https://www.namecheap.com/support/api/intro/
2. Configure:
   ```bash
   VITE_NAMECHEAP_API_KEY=your_key
   ```

## Environment Variables

Create a `.env` file in the project root:

```env
# Availability APIs
VITE_DOMAINR_API_KEY=your_domainr_key
VITE_WHOISXML_API_KEY=your_whoisxml_key

# Optional: Registrar APIs  
VITE_GODADDY_API_KEY=your_godaddy_key
VITE_GODADDY_API_SECRET=your_godaddy_secret
VITE_NAMECHEAP_API_KEY=your_namecheap_key
```

## API Fallback Logic

The app uses this priority:

1. **Domainr API** (if key configured) - Fast, accurate availability
2. **DNS Lookup** (free fallback) - Basic availability check
3. **WhoisXML API** (for taken domains) - Detailed registration info

## Rate Limiting

To avoid hitting API limits:

- Searches are limited to 20 domain variations
- Bulk searches process in batches of 5
- 1-second delay between batches
- Results are cached in browser

## Testing

Test with known domains:

- **Available:** `youruniquename123456.com`
- **Taken:** `google.com`
- **Premium:** `business.com`

## Cost Optimization Tips

1. **Start with free DNS checking** - Works for most use cases
2. **Add Domainr** when you need accuracy (free tier: 100/month)
3. **Add WhoisXML** for WHOIS data (free tier: 1,000 credits)
4. **Use registrar APIs** only if you need real-time pricing

## Troubleshooting

### "API key not configured" warning
- Check `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server after adding keys

### Rate limit errors
- Reduce concurrent requests in `realApi.ts`
- Increase delay between batches
- Upgrade API plan

### CORS errors
- API calls are made from browser
- Some APIs may require server-side proxy
- Consider adding a backend API layer

## Alternative: Self-Hosted

For full control, you can:

1. Run your own WHOIS server
2. Use RDAP protocol (free, rate-limited)
3. Build a backend API that aggregates multiple sources

Example RDAP query:
```
https://rdap.org/domain/example.com
```

## Support

- Domainr: https://domainr.build/docs
- WhoisXML: https://whoisxmlapi.com/documentation
- RDAP: https://about.rdap.org/

---

**Note:** Without API keys, the app uses free DNS checking which provides basic functionality but may not be 100% accurate for availability status.
