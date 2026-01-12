# POSEIDON

> **Personal Oceanographic System for Exploration, Insights, and Discovery Of New research**

POSEIDON is your personal AI research assistant for ArXiv papers. It filters papers by your domain expertise and research interests, providing daily summaries and semantic search to help you stay current with relevant ML research.

## 🎯 What is POSEIDON?

POSEIDON helps ML researchers and engineers:

- **Discover** relevant papers from ArXiv tailored to your interests
- **Filter** the daily flood of papers to what matters for your research
- **Summarize** key findings in digestible daily briefings
- **Search** semantically across papers to find similar work

Built with a contract-first architecture, POSEIDON separates concerns cleanly between frontend UI, backend API, and external provider integrations.

## ✨ MVP Features

- **Journal Finder**: Search and browse ArXiv papers with filters
- **Latest Topics**: Get daily paper recommendations based on your interests
- **Captain's Brief**: Receive a daily digest of research highlights
- **Mock Mode**: Run locally without external dependencies for development and testing

## 🚀 Quickstart (Mock Mode)

Get POSEIDON running in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/taehyeonglim/poseidon.git
cd poseidon

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..

# 4. Configure environment (mock mode - no API keys needed)
cp .env.example .env
# The default .env is already configured for mock mode

# 5. Start the backend (in terminal 1)
npm run dev
# Backend runs on http://localhost:3000

# 6. Start the frontend (in terminal 2)
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser and explore the interface!

## ⚙️ Configuration

POSEIDON uses environment variables for configuration. See [ENV_SETUP.md](ENV_SETUP.md) for detailed setup instructions.

### Key Environment Variables

```bash
# Provider mode: 'mock' or 'production'
PROVIDER_MODE=mock

# Backend server
PORT=3000
NODE_ENV=development
CACHE_TTL=300

# Mock mode requires no API keys
# Production mode requires:
OPENAI_API_KEY=your_key_here
ARXIV_API_BASE=http://export.arxiv.org/api/query
```

### Mock vs Production Mode

| Feature | Mock Mode | Production Mode |
|---------|-----------|-----------------|
| API Keys | None required | OpenAI, ArXiv |
| Data | Deterministic test data | Live ArXiv papers |
| Setup Time | < 1 minute | 5-10 minutes |
| Use Case | Development, testing | Real research use |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                     │
│  Harbor │ Journal Finder │ Latest Topics │ Captain's Brief │
└────────────────────┬────────────────────────────────────┘
                     │
              REST API Calls
                     │
┌────────────────────▼────────────────────────────────────┐
│            Backend (Node.js + Express API)               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  API Routes │  │ Cache Layer  │  │ Rate Limiting  │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────────┘ │
│         │                │                               │
│  ┌──────▼────────────────▼───────────────────────────┐  │
│  │         Provider Abstraction (Mock/Production)    │  │
│  │    Data Provider Interface                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Components

- **Frontend**: React + Vite application with responsive UI
- **Backend**: Express.js REST API with TypeScript
- **Providers**: Swappable implementations for data sources (mock or production)
- **Cache Layer**: In-memory caching for API responses
- **Rate Limiting**: Middleware for API protection

See [API.md](API.md) for complete API documentation.

## 🧪 Testing

### Run Backend Tests

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### Run Frontend Tests

```bash
cd client
npm test
```

All tests use mock providers for deterministic, reproducible results.

## 📚 Documentation

- [API Reference](API.md) - Complete API endpoint documentation
- [Environment Setup](ENV_SETUP.md) - Detailed installation and configuration
- [Contributing](CONTRIBUTING.md) - Development guidelines and workflow
- [Changelog](CHANGELOG.md) - Version history and release notes

## 🤝 Contributing

POSEIDON is developed using specialized agent roles following a contract-first approach:

- **Navigator**: Defines MVP scope and user stories  
- **Cartographer**: Architects the system and API contracts
- **Dockmaster**: Implements backend endpoints and providers
- **Shipwright**: Builds frontend UI flows
- **Harbor Pilot**: Validates correctness through testing
- **Logkeeper**: Maintains documentation and releases

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📦 Project Structure

```
poseidon/
├── src/                  # Backend source
│   ├── index.ts          # Entry point
│   ├── app.ts            # Express app
│   ├── routes/           # API routes
│   ├── providers/        # Provider abstraction
│   ├── services/         # Business logic & cache
│   └── middleware/       # Rate limiting, etc.
├── client/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api/          # API client
│   │   ├── context/      # React context
│   │   └── data/         # Mock data
│   └── public/
├── tests/                # Backend tests
├── .env.example          # Environment template
└── README.md
```

## 📄 License

[License TBD]

---

**Quick Links**: [API Docs](API.md) | [Setup Guide](ENV_SETUP.md) | [Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md)
