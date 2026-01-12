# Contributing to POSEIDON

Thank you for your interest in contributing to POSEIDON! This guide will help you understand our development workflow, coding standards, and testing requirements.

## Table of Contents

- [Agent-Based Development](#agent-based-development)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Agent-Based Development

POSEIDON is developed using specialized agent roles, each with specific responsibilities:

| Agent | Role | Responsibilities |
|-------|------|------------------|
| **Navigator** | Scope Definition | Defines MVP scope, user stories, acceptance criteria |
| **Cartographer** | Architecture | Designs system architecture, API contracts, data flow |
| **Dockmaster** | Backend Implementation | Implements backend endpoints, providers, caching |
| **Shipwright** | Frontend Implementation | Builds UI components, pages, state management |
| **Harbor Pilot** | QA & Testing | Validates correctness, writes tests, verifies flows |
| **Logkeeper** | Documentation | Maintains docs, release notes, setup guides |

### Contract-First Approach

POSEIDON follows a **contract-first** development model:

1. **Cartographer** defines API contracts (request/response schemas)
2. **Dockmaster** implements backend to contract
3. **Shipwright** implements frontend to contract
4. **Harbor Pilot** verifies both sides honor the contract

This enables **independent parallel development** without blocking dependencies.

### Key Principles

- ✅ **Mock-first**: Mock providers MUST be implemented before production providers
- ✅ **Deterministic**: Mock data must return consistent results for testing
- ✅ **No contract changes without approval**: API changes require Cartographer review
- ✅ **Separation of concerns**: Frontend and backend communicate ONLY via API

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Code editor (VS Code recommended)

### First-Time Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/poseidon.git
cd poseidon

# Add upstream remote
git remote add upstream https://github.com/taehyeonglim/poseidon.git

# Install dependencies
npm install
cd client && npm install && cd ..

# Set up environment
cp .env.example .env

# Run tests to verify setup
npm test
cd client && npm test
```

---

## Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:

```
<type>/<short-description>

Examples:
feature/add-daily-recommendations
fix/rate-limit-bug
docs/api-reference-update
test/integration-tests
refactor/provider-interface
```

Types: `feature`, `fix`, `docs`, `test`, `refactor`, `chore`

### Development Cycle

1. **Pull latest changes**

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Write code following [Code Standards](#code-standards)
   - Write/update tests
   - Update documentation if needed

4. **Test locally**

   ```bash
   # Backend tests
   npm test
   
   # Frontend tests
   cd client && npm test
   
   # Manual testing in mock mode
   npm run dev  # backend
   cd client && npm run dev  # frontend
   ```

5. **Commit changes** (see [Commit Guidelines](#commit-guidelines))

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open Pull Request** (see [Pull Request Process](#pull-request-process))

---

## Code Standards

### TypeScript

- **Use TypeScript** for all new backend code
- **Define interfaces** for all data structures
- **Avoid `any` type** - use proper types or `unknown`
- **Export types** that are used across files

```typescript
// Good ✅
interface Paper {
  id: string;
  title: string;
  authors: string[];
  published: string;
}

function getPaper(id: string): Promise<Paper> {
  // ...
}

// Bad ❌
function getPaper(id: any): any {
  // ...
}
```

### JavaScript/React

- **Use functional components** with hooks
- **Avoid class components**
- **Use descriptive variable names**
- **Extract reusable logic** into custom hooks

```javascript
// Good ✅
function PaperCard({ paper }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      <h3>{paper.title}</h3>
      {isExpanded && <p>{paper.abstract}</p>}
    </div>
  );
}

// Bad ❌
class PaperCard extends Component { /* ... */ }
```

### File Organization

```
Backend:
src/
├── routes/          # API route handlers
├── providers/       # Provider implementations
├── services/        # Business logic
├── middleware/      # Express middleware
├── types/           # TypeScript type definitions
└── utils/           # Helper functions

Frontend:
client/src/
├── components/      # Reusable React components
├── pages/           # Page-level components
├── api/             # API client functions
├── context/         # React context providers
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `data-provider.ts`)
- **Components**: `PascalCase.jsx` (e.g., `PaperCard.jsx`)
- **Functions**: `camelCase` (e.g., `fetchPapers`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Interfaces/Types**: `PascalCase` (e.g., `ApiResponse`)

### Code Style

- **Use ESLint** - Run `npm run lint` before committing
- **2 spaces** for indentation
- **Single quotes** for strings (except in JSX)
- **Semicolons** required
- **No unused variables**
- **Maximum line length**: 100 characters

---

## Testing Requirements

### Test Coverage

All new code MUST include tests:

- **Minimum coverage**: 80% for new files
- **Backend**: Unit tests for all services, providers, routes
- **Frontend**: Component tests for all UI components
- **Integration tests**: For critical user flows

### Backend Testing

Use **Jest** for all backend tests:

```typescript
// Example: services/data.service.test.ts
import { DataService } from './data.service';
import { MockProvider } from '../providers/mock.provider';

describe('DataService', () => {
  let service: DataService;
  
  beforeEach(() => {
    const provider = new MockProvider();
    service = new DataService(provider);
  });
  
  it('should fetch data by id', async () => {
    const result = await service.getById('1');
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });
});
```

### Frontend Testing

Use **React Testing Library**:

```javascript
// Example: components/PaperCard.test.jsx
import { render, screen } from '@testing-library/react';
import PaperCard from './PaperCard';

test('renders paper title', () => {
  const paper = { id: '1', title: 'Test Paper', authors: ['Author'] };
  render(<PaperCard paper={paper} />);
  expect(screen.getByText('Test Paper')).toBeInTheDocument();
});
```

### Mock Providers

**CRITICAL**: Mock providers must maintain deterministic outputs:

```typescript
// ✅ Good - deterministic
getMockData(id: string): Paper {
  return MOCK_PAPERS.find(p => p.id === id);
}

// ❌ Bad - non-deterministic
getMockData(id: string): Paper {
  return MOCK_PAPERS[Math.floor(Math.random() * MOCK_PAPERS.length)];
}
```

### Running Tests

```bash
# Run all backend tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# With coverage report
npm run test:coverage

# Run specific test file
npm test -- data.service.test.ts

# Frontend tests
cd client
npm test
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `chore`: Build/tooling changes

### Examples

```bash
feat(api): add daily recommendations endpoint

Implement GET /api/papers/daily endpoint that returns
personalized paper recommendations based on user interests.

Closes #42

---

fix(cache): prevent cache key collision

Fixed issue where different queries could share the same
cache key, causing incorrect results.

Fixes #128

---

docs(readme): update quickstart guide

Added clarification about port conflicts and how to resolve them.
```

### Best Practices

- ✅ **Write in imperative mood**: "Add feature" not "Added feature"
- ✅ **Keep subject under 50 characters**
- ✅ **Explain why** in the body, not just what
- ✅ **Reference issues** in footer
- ❌ **Don't commit broken code**
- ❌ **Don't mix unrelated changes**

---

## Pull Request Process

### Before Opening PR

- [ ] All tests pass (`npm test` and `cd client && npm test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed
- [ ] Commit messages follow guidelines

### PR Title Format

```
<type>: <description>

Examples:
feat: Add daily recommendations endpoint
fix: Resolve rate limit bypass bug
docs: Update API reference for query endpoint
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (specify)

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented if necessary)
```

### Review Process

1. **Automated checks** must pass (tests, linting, type checking)
2. **Agent role review** by appropriate specialist:
   - Backend changes → Dockmaster review
   - Frontend changes → Shipwright review
   - API contracts → Cartographer review
   - Documentation → Logkeeper review
3. **At least one approval** required
4. **Address feedback** and push updates
5. **Squash and merge** when approved

### After Merge

- Delete your feature branch
- Update your local main:

  ```bash
  git checkout main
  git pull upstream main
  ```

---

## Additional Guidelines

### API Contract Changes

**NEVER modify API contracts without approval:**

1. Propose change in GitHub issue
2. Tag Cartographer for review
3. Wait for approval before implementing
4. Update API.md documentation
5. Update mock providers to match new contract
6. Ensure backward compatibility or document breaking changes

### Adding New Dependencies

Before adding a new npm package:

1. Check if existing dependency can solve the problem
2. Verify package is actively maintained
3. Check package size (avoid bloat)
4. Document why it's needed in PR description

### Documentation Updates

Documentation is code. Updates required for:

- ✅ New features → Update README, API.md
- ✅ New API endpoints → Update API.md
- ✅ Config changes → Update ENV_SETUP.md
- ✅ Breaking changes → Update CHANGELOG.md
- ✅ Bug fixes → Update CHANGELOG.md

---

## Questions?

- **Setup issues**: See [ENV_SETUP.md](ENV_SETUP.md)
- **API questions**: See [API.md](API.md)
- **General info**: See [README.md](README.md)
- **Still stuck**: Open a GitHub issue

---

**Thank you for contributing to POSEIDON!** 🌊

**Quick Links**: [README](README.md) | [API Reference](API.md) | [Setup Guide](ENV_SETUP.md) | [Changelog](CHANGELOG.md)
