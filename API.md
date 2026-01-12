# POSEIDON API Reference

Complete API documentation for POSEIDON backend endpoints.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: TBD

## Authentication

Currently, no authentication is required. Future versions may implement API key authentication.

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Error Response Format

All errors follow this consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

---

## Endpoints

### Health Check

Check API health and availability.

**Endpoint**: `GET /api/health`

**Parameters**: None

**Response**: `200 OK`

```json
{
  "status": "ok",
  "mode": "mock",
  "timestamp": "2026-01-12T11:32:00Z",
  "uptime": 12345
}
```

---

### List All Journals

Retrieve all available journal entries.

**Endpoint**: `GET /api/journals`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Max items to return (default: 50, max: 100) |
| `offset` | integer | No | Pagination offset (default: 0) |

**Response**: `200 OK`

```json
{
  "data": [
    {
      "id": "ijcscl",
      "name": "International Journal of Computer-Supported Collaborative Learning",
      "nameKo": "국제 컴퓨터 지원 협력 학습 저널",
      "discipline": "Learning Sciences",
      "impactFactor": 4.2,
      "description": "Leading journal in CSCL research...",
      "scopeTags": ["collaborative learning", "CSCL", "educational technology"]
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

**Example Request**:

```bash
curl "http://localhost:3000/api/journals?limit=10&offset=0"
```

---

### Get Journal by ID

Retrieve a specific journal with trend data.

**Endpoint**: `GET /api/journals/:id`

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Journal ID |

**Response**: `200 OK`

```json
{
  "id": "ijcscl",
  "name": "International Journal of Computer-Supported Collaborative Learning",
  "nameKo": "국제 컴퓨터 지원 협력 학습 저널",
  "discipline": "Learning Sciences",
  "impactFactor": 4.2,
  "description": "Leading journal in CSCL research...",
  "scopeTags": ["collaborative learning", "CSCL", "educational technology"],
  "trends": [
    {
      "name": "협력 학습",
      "nameEn": "Collaborative Learning",
      "frequency": 45,
      "growth": 12
    }
  ]
}
```

**Error Response**: `404 Not Found`

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Journal with id 'unknown' not found"
  }
}
```

**Example Request**:

```bash
curl "http://localhost:3000/api/journals/ijcscl"
```

---

### Search Journals

Search journals with query and filters.

**Endpoint**: `POST /api/journals/search`

**Request Body**:

```json
{
  "query": "collaborative learning",
  "filters": {
    "discipline": ["Learning Sciences", "Educational Technology"],
    "minImpactFactor": 3.0
  },
  "limit": 20,
  "offset": 0
}
```

**Body Parameters**:

| Parameter                 | Type     | Required | Description                          |
| ------------------------- | -------- | -------- | ------------------------------------ |
| `query`                   | string   | No       | Search query string                  |
| `filters`                 | object   | No       | Filter criteria                      |
| `filters.discipline`      | string[] | No       | Filter by disciplines                |
| `filters.minImpactFactor` | number   | No       | Minimum impact factor                |
| `filters.maxImpactFactor` | number   | No       | Maximum impact factor                |
| `limit`                   | integer  | No       | Max results (default: 20, max: 100)  |
| `offset`                  | integer  | No       | Pagination offset                    |

**Response**: `200 OK`

```json
{
  "results": [
    {
      "id": "ijcscl",
      "name": "International Journal of Computer-Supported Collaborative Learning",
      "nameKo": "국제 컴퓨터 지원 협력 학습 저널",
      "discipline": "Learning Sciences",
      "impactFactor": 4.2,
      "description": "Leading journal in CSCL research...",
      "scopeTags": ["collaborative learning", "CSCL"],
      "fitScore": 85,
      "matchedTags": ["collaborative learning"],
      "matchReason": "collaborative learning 관련 연구에 적합"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  },
  "cached": false
}
```

**Example Request**:

```bash
curl -X POST "http://localhost:3000/api/journals/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI education",
    "filters": {
      "minImpactFactor": 4.0
    },
    "limit": 10
  }'
```

---

### Generate Captain's Brief

Generate a detailed briefing for a journal.

**Endpoint**: `POST /api/journals/:id/brief`

**Path Parameters**:

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | Yes      | Journal ID  |

**Request Body**:

```json
{
  "query": "collaborative learning AI"
}
```

**Body Parameters**:

| Parameter | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| `query`   | string | No       | User's research query for context |

**Response**: `200 OK`

```json
{
  "journalId": "ijcscl",
  "journalName": "International Journal of Computer-Supported Collaborative Learning",
  "journalNameKo": "국제 컴퓨터 지원 협력 학습 저널",
  "brief": "## 국제 컴퓨터 지원 협력 학습 저널 임무 브리핑\n\n### 저널 개요\n...",
  "generatedAt": "2026-01-12T11:32:00Z"
}
```

**Error Response**: `404 Not Found`

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Journal with id 'unknown' not found"
  }
}
```

**Example Request**:

```bash
curl -X POST "http://localhost:3000/api/journals/ijcscl/brief" \
  -H "Content-Type: application/json" \
  -d '{"query": "AI in education"}'
```

---

## Rate Limiting

Rate limits are applied per IP address:

- **Mock Mode**: 100 requests per minute
- **Production Mode**: 60 requests per minute

When rate limit is exceeded, the API returns `429 Too Many Requests`:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 45
    }
  }
}
```

Response headers include rate limit information:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705075200
```

---

## Caching

Responses are cached to improve performance:

- **Cache TTL**: Configurable via `CACHE_TTL` environment variable (default: 300 seconds)
- **Cache Indicator**: Responses include `"cached": true` when served from cache

Cache headers:

```
Cache-Control: public, max-age=300
ETag: "abc123def456"
```

---

## Provider Modes

### Mock Mode (`PROVIDER_MODE=mock`)

- Returns deterministic test data
- No external API calls
- Fast response times
- Ideal for development and testing

### Production Mode (`PROVIDER_MODE=production`)

- Connects to real ArXiv API (planned)
- Requires API credentials
- Rate limits apply from external services
- Live, up-to-date data

---

## Examples

### Complete Workflow

```bash
# 1. Check API health
curl http://localhost:3000/api/health

# 2. Get all journals
curl "http://localhost:3000/api/journals?limit=5"

# 3. Search journals
curl -X POST http://localhost:3000/api/journals/search \
  -H "Content-Type: application/json" \
  -d '{"query": "AI education", "limit": 5}'

# 4. Get specific journal with trends
curl http://localhost:3000/api/journals/aied

# 5. Generate Captain's Brief
curl -X POST http://localhost:3000/api/journals/aied/brief \
  -H "Content-Type: application/json" \
  -d '{"query": "AI tutoring systems"}'
```

### Using with JavaScript

```javascript
// Fetch all journals
const response = await fetch('http://localhost:3000/api/journals?limit=10');
const data = await response.json();
console.log(data);

// Search journals
const searchResponse = await fetch('http://localhost:3000/api/journals/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'collaborative learning',
    filters: {
      minImpactFactor: 4.0
    },
    limit: 10
  })
});
const results = await searchResponse.json();
console.log(results);

// Generate brief
const briefResponse = await fetch('http://localhost:3000/api/journals/ijcscl/brief', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'my research topic'
  })
});
const brief = await briefResponse.json();
console.log(brief.brief);
```

---

## Deprecated Endpoints

The following endpoints are deprecated and will be removed in v0.2:

| Deprecated             | Replacement                 |
| ---------------------- | --------------------------- |
| `GET /api/data`        | `GET /api/journals`         |
| `GET /api/data/:id`    | `GET /api/journals/:id`     |
| `POST /api/data/query` | `POST /api/journals/search` |

---

## Support

For issues or questions about the API, please refer to:

- [README.md](README.md) for general setup
- [ENV_SETUP.md](ENV_SETUP.md) for configuration
- [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
