# Environment Setup Guide

Complete guide for setting up POSEIDON development and production environments.

## Prerequisites

Before getting started, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18.x or higher | JavaScript runtime |
| **npm** | 9.x or higher | Package manager |
| **Git** | Any recent version | Version control |

### Verify Prerequisites

```bash
# Check Node.js version
node --version
# Should output v18.x.x or higher

# Check npm version
npm --version
# Should output 9.x.x or higher

# Check Git
git --version
```

---

## Fresh Installation (5-Minute Setup)

### Step 1: Clone Repository (30 seconds)

```bash
git clone https://github.com/taehyeonglim/poseidon.git
cd poseidon
```

### Step 2: Install Backend Dependencies (1.5 minutes)

```bash
npm install
```

This installs all backend dependencies including:

- Express.js (web framework)
- TypeScript (type safety)
- Jest (testing framework)
- And other utilities

### Step 3: Install Frontend Dependencies (1.5 minutes)

```bash
cd client
npm install
cd ..
```

This installs frontend dependencies:

- React (UI framework)
- Vite (build tool)
- React Router (navigation)
- And other UI libraries

### Step 4: Configure Environment (30 seconds)

```bash
# Copy environment template
cp .env.example .env

# The default values are already configured for mock mode
# No edits needed for local development!
```

### Step 5: Start Services (1 minute)

**Terminal 1 - Backend:**

```bash
npm run dev
```

You should see:

```
Server running on http://localhost:3000
Provider mode: mock
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

You should see:

```
VITE ready in XXX ms
Local: http://localhost:5173
```

### Step 6: Verify Installation (30 seconds)

1. Open browser to [http://localhost:5173](http://localhost:5173)
2. You should see the POSEIDON Harbor dashboard
3. Click "Journal Finder" to search papers
4. Verify you see mock data

✅ **Setup complete!** Total time: < 5 minutes

---

## Mock Mode Configuration

Mock mode allows you to run POSEIDON without any external API dependencies. Perfect for development and testing.

### Default .env for Mock Mode

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Provider Mode - MUST BE 'mock' for local dev
PROVIDER_MODE=mock

# Cache Configuration
CACHE_TTL=300

# No API keys needed in mock mode!
```

### What Mock Mode Provides

- ✅ **Deterministic data**: Same results every time
- ✅ **Fast responses**: No network calls
- ✅ **No rate limits**: Unlimited requests
- ✅ **Offline development**: Works without internet
- ✅ **Testing friendly**: Predictable outputs for tests

### Mock Data Location

Mock data is defined in:

- Backend: `src/providers/mock.provider.ts`
- Frontend: `client/src/data/`

You can modify these files to customize mock responses.

---

## Production Mode Configuration

Production mode connects to real external services. Use this for actual research work.

### Prerequisites for Production Mode

1. **OpenAI API Key** (for paper summaries and analysis)
   - Sign up at [https://platform.openai.com](https://platform.openai.com)
   - Create API key in Dashboard → API Keys
   - Cost: ~$0.01 per paper summary

2. **ArXiv Access** (free, no key needed)
   - ArXiv provides open access to papers
   - No authentication required
   - Rate limits: 1 request per 3 seconds

### Production .env Configuration

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Provider Mode - Set to 'production'
PROVIDER_MODE=production

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500

# ArXiv Configuration
ARXIV_API_BASE=http://export.arxiv.org/api/query
ARXIV_RATE_LIMIT_MS=3000

# Cache Configuration
CACHE_TTL=3600

# Optional: Database (for persistent storage)
DATABASE_URL=postgresql://user:password@localhost:5432/poseidon

# Optional: Redis (for distributed caching)
REDIS_URL=redis://localhost:6379
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Backend server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `PROVIDER_MODE` | **Yes** | N/A | `mock` or `production` |
| `CACHE_TTL` | No | `300` | Cache time-to-live (seconds) |
| `OPENAI_API_KEY` | Production only | N/A | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4` | OpenAI model to use |
| `OPENAI_MAX_TOKENS` | No | `500` | Max tokens per request |
| `ARXIV_API_BASE` | No | ArXiv URL | ArXiv API base URL |
| `ARXIV_RATE_LIMIT_MS` | No | `3000` | Min ms between requests |
| `DATABASE_URL` | No | N/A | PostgreSQL connection string |
| `REDIS_URL` | No | N/A | Redis connection string |

### Switching Between Modes

To switch from mock to production:

1. Update `.env`:

   ```bash
   PROVIDER_MODE=production
   ```

2. Add required API keys:

   ```bash
   OPENAI_API_KEY=your_actual_key_here
   ```

3. Restart backend:

   ```bash
   # Stop the dev server (Ctrl+C)
   npm run dev
   ```

---

## Troubleshooting

### Backend won't start

**Error**: `Port 3000 is already in use`

**Solution**: Another process is using port 3000

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

**Error**: `Cannot find module 'xyz'`

**Solution**: Dependencies not installed

```bash
rm -rf node_modules
npm install
```

### Frontend won't start

**Error**: `Cannot connect to http://localhost:3000`

**Solution**: Backend is not running. Start backend first.

**Error**: `EADDRINUSE: address already in use`

**Solution**: Port 5173 is in use. Kill the process or change Vite port in `client/vite.config.js`

### Mock Mode Issues

**Problem**: Getting real API errors in mock mode

**Solution**: Verify `.env` has `PROVIDER_MODE=mock` and restart backend

### Production Mode Issues

**Error**: `Invalid OpenAI API key`

**Solution**:

1. Check key format: Should start with `sk-`
2. Verify key is active in OpenAI dashboard
3. Check for extra spaces in `.env`

**Error**: `Rate limit exceeded from ArXiv`

**Solution**: ArXiv has strict rate limits. Wait 3+ seconds between requests.

---

## Development Workflow

### Typical Development Cycle

1. **Start in mock mode** - Fast iteration
2. **Write code** - Make changes
3. **Test locally** - Run tests with `npm test`
4. **Switch to production** - Test with real APIs (optional)
5. **Commit changes** - Git workflow

### Hot Reload

Both backend and frontend support hot reload:

- **Backend**: TypeScript files auto-recompile on save
- **Frontend**: React components refresh on save

No need to restart servers during development!

### Running Tests

```bash
# Backend tests (uses mock mode automatically)
npm test

# Frontend tests
cd client
npm test

# Both with coverage
npm run test:coverage
```

---

## Production Deployment

### Build for Production

```bash
# Build backend
npm run build

# Build frontend
cd client
npm run build
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Set `PROVIDER_MODE=production`
- [ ] Configure all required API keys
- [ ] Set appropriate `CACHE_TTL` (e.g., 3600)
- [ ] Configure database (optional)
- [ ] Configure Redis (optional)
- [ ] Test API endpoints
- [ ] Monitor logs for errors

### Recommended Hosting

- **Backend**: Heroku, Railway, Render, AWS EC2
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Supabase, Railway, PlanetScale
- **Redis**: Upstash, Redis Cloud

---

## Security Best Practices

1. **Never commit `.env` file** - It's gitignored by default
2. **Rotate API keys** regularly
3. **Use environment-specific keys** (dev vs. prod)
4. **Limit API key permissions** where possible
5. **Monitor API usage** to detect anomalies

---

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review [README.md](README.md) for general info
3. Check [API.md](API.md) for API details
4. Review [CONTRIBUTING.md](CONTRIBUTING.md) for dev guidelines
5. Open an issue on GitHub

---

**Quick Links**: [README](README.md) | [API Reference](API.md) | [Contributing](CONTRIBUTING.md)
