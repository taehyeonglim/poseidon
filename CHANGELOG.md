# Changelog

All notable changes to POSEIDON will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Daily paper recommendations endpoint (`GET /api/papers/daily`)
- Captain's Brief digest endpoint (`GET /api/brief`)
- User preferences management
- Real ArXiv provider integration
- OpenAI integration for paper summaries
- Persistent storage (PostgreSQL)
- Distributed caching (Redis)

---

## [0.1.0] - 2026-01-12

### Added

**Backend**

- RESTful API with Express.js and TypeScript
- Provider abstraction pattern with mock and production modes
- Mock provider with deterministic test data
- In-memory caching layer with configurable TTL
- Rate limiting middleware (100 req/min in mock, 60 req/min in production)
- Health check endpoint (`GET /api/health`)
- Data listing endpoint (`GET /api/data`)
- Data retrieval endpoint (`GET /api/data/:id`)
- Query endpoint with filters (`POST /api/data/query`)
- Comprehensive error handling with consistent response format
- Unit tests with Jest (85%+ coverage)
- TypeScript types and interfaces

**Frontend**

- React application with Vite build tool
- Responsive UI design
- API client with error handling
- React Context for state management
- Mock data for development

**Documentation**

- README with quickstart guide
- API reference documentation
- Environment setup guide
- Contribution guidelines
- Changelog
- Code comments and TypeScript types

**Developer Experience**

- 5-minute setup with mock mode
- Hot reload for both backend and frontend
- No API keys required in mock mode
- Deterministic test data for reproducible results
- Clear separation of concerns (contract-first architecture)

### Technical Details

**Tech Stack**

- **Backend**: Node.js 18+, Express 4.x, TypeScript 5.x
- **Frontend**: React 18+, Vite 5+
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript

**Architecture**

- Provider abstraction pattern for swappable data sources
- Service layer for business logic and caching
- Middleware for cross-cutting concerns (rate limiting, error handling)
- RESTful API design
- Stateless backend (except cache)

### Known Limitations

- Mock mode only (production providers not yet implemented)
- In-memory cache (not distributed)
- No persistent storage
- No user authentication
- No real ArXiv integration
- No OpenAI integration for summaries
- Limited to basic CRUD operations

### Developer Notes

This is an MVP release focused on:

1. Establishing clean architecture
2. Providing excellent developer experience
3. Enabling rapid local development
4. Demonstrating UI flows and API contracts

Production features (real ArXiv, OpenAI, database) will be added in v0.2.0.

---

## Release Notes Template

For future releases, use this template:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated  
- Features to be removed in future versions

### Removed
- Features removed in this version

### Fixed
- Bug fixes

### Security
- Security vulnerability fixes
```

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| [0.1.0] | 2026-01-12 | Initial MVP release with mock mode |

---

**Quick Links**: [README](README.md) | [API Reference](API.md) | [Setup Guide](ENV_SETUP.md) | [Contributing](CONTRIBUTING.md)
