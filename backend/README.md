# Chat with PDF AI - Backend API

NestJS backend for secure document upload to OpenAI and chat completions with file context.

## Features

- **Document Management**: Upload, list, retrieve, download, and delete documents via OpenAI Files API
- **Chat Completions**: Create chat completions with optional file context
- **File Validation**: Automatic validation of file size, MIME type, and extension
- **Security**: API keys stored in environment variables, input validation, proper error handling
- **API Documentation**: Swagger UI at `/docs`

## Quick Start

### Prerequisites

- Node.js 20+
- Bun (recommended) or npm
- OpenAI API key

### Installation

```bash
# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | **Required** Your OpenAI API key | - |
| `OPENAI_ORGANIZATION` | OpenAI organization ID | - |
| `OPENAI_PROJECT` | OpenAI project ID | - |
| `OPENAI_API_BASE_URL` | Custom OpenAI base URL | `https://api.openai.com/v1` |
| `OPENAI_CHAT_MODEL` | Default chat model | `gpt-4o` |
| `MAX_TOKENS` | Max completion tokens | `4096` |
| `TEMPERATURE` | Sampling temperature | `0.7` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` (10MB) |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | `http://localhost:3000,http://localhost:5173` |

### Running the Server

```bash
# Development (with hot reload)
bun run start:dev

# Production
bun run build
bun run start:prod
```

Server runs at `http://localhost:3000`  
API Documentation at `http://localhost:3000/docs`

---

## API Endpoints

All endpoints are prefixed with `/api/v1` (versioned via URI).

### Document Upload

#### Upload Single Document

```bash
curl -X POST http://localhost:3000/api/v1/documents/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/document.pdf" \
  -F "purpose=assistants"
```

**Response (201 Created):**
```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 102400,
  "createdAt": 1700000000,
  "filename": "document.pdf",
  "purpose": "assistants",
  "status": "processed",
  "statusDetails": null
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Document file (max 10MB) |
| `purpose` | string | No | `assistants`, `batch`, `vision`, or `fine-tune` (default: `assistants`) |
| `name` | string | No | Custom name (max 255 chars) |

**Allowed File Types:** PDF, TXT, CSV, MD, JSON, DOC, DOCX

---

#### Upload Multiple Documents

```bash
curl -X POST http://localhost:3000/api/v1/documents/upload/multiple \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/path/to/doc1.pdf" \
  -F "files=@/path/to/doc2.txt" \
  -F "purpose=assistants"
```

**Response (201 Created):**
```json
[
  {
    "id": "file-abc123",
    "object": "file",
    "bytes": 102400,
    "createdAt": 1700000000,
    "filename": "doc1.pdf",
    "purpose": "assistants",
    "status": "processed",
    "statusDetails": null
  },
  {
    "id": "file-def456",
    "object": "file",
    "bytes": 51200,
    "createdAt": 1700000001,
    "filename": "doc2.txt",
    "purpose": "assistants",
    "status": "processed",
    "statusDetails": null
  }
]
```

---

### Document Management

#### List Documents

```bash
# List all
curl http://localhost:3000/api/v1/documents

# With filters
curl "http://localhost:3000/api/v1/documents?purpose=assistants&limit=10&after=file-abc123"
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `purpose` | string | - | Filter by purpose |
| `limit` | number | 20 | Max results (1-100) |
| `after` | string | - | Pagination cursor |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "file-abc123",
      "object": "file",
      "bytes": 102400,
      "createdAt": 1700000000,
      "filename": "document.pdf",
      "purpose": "assistants",
      "status": "processed",
      "statusDetails": null
    }
  ],
  "object": "list"
}
```

---

#### Get Document Details

```bash
curl http://localhost:3000/api/v1/documents/file-abc123
```

**Response (200 OK):**
```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 102400,
  "createdAt": 1700000000,
  "filename": "document.pdf",
  "purpose": "assistants",
  "status": "processed",
  "statusDetails": null
}
```

---

#### Download Document Content

```bash
curl http://localhost:3000/api/v1/documents/file-abc123/content \
  --output document.pdf
```

Returns the raw file content as binary stream.

---

#### Delete Document

```bash
curl -X DELETE http://localhost:3000/api/v1/documents/file-abc123
```

**Response (200 OK):**
```json
{
  "id": "file-abc123",
  "deleted": true
}
```

---

### Chat Completions

#### Basic Chat Completion

```bash
curl -X POST http://localhost:3000/api/v1/documents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    "model": "gpt-4o",
    "temperature": 0.7,
    "maxTokens": 2000
  }'
```

**Response (200 OK):**
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "gpt-4o-2024-05-13",
  "content": "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously...",
  "role": "assistant",
  "finishReason": "stop",
  "usage": {
    "promptTokens": 25,
    "completionTokens": 150,
    "totalTokens": 175
  }
}
```

**Request Body:**
```typescript
{
  messages: Array<{
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    name?: string;
  }>;
  fileIds?: string[];           // OpenAI file IDs for context
  model?: string;               // Default: gpt-4o
  maxTokens?: number;           // 1-128000, default: 4096
  temperature?: number;         // 0-2, default: 0.7
  topP?: number;                // 0-1, nucleus sampling
  stream?: boolean;             // Default: false
}
```

---

#### Chat with File Context

Upload documents first, then reference them in chat:

```bash
# 1. Upload a document
FILE_ID=$(curl -s -X POST http://localhost:3000/api/v1/documents/upload \
  -F "file=@research.pdf" \
  -F "purpose=assistants" | jq -r '.id')

# 2. Chat with the document
curl -X POST http://localhost:3000/api/v1/documents/chat/with-files \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {\"role\": \"system\", \"content\": \"Answer questions based on the uploaded documents.\"},
      {\"role\": \"user\", \"content\": \"What are the key findings in this research?\"}
    ],
    \"fileIds\": [\"$FILE_ID\"],
    \"model\": \"gpt-4o\"
  }"
```

**Note:** The `/chat/with-files` endpoint is designed for future integration with OpenAI's Assistants API (file_search tool). Currently delegates to standard chat completion.

---

## Error Responses

All errors follow a consistent format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400,
  "details": {}
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid input, file validation failed |
| 401 | `UNAUTHORIZED` | Invalid or missing OpenAI API key |
| 404 | `NOT_FOUND` | Document not found |
| 413 | `PAYLOAD_TOO_LARGE` | File exceeds size limit |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | File type not allowed |
| 429 | `RATE_LIMIT` | OpenAI rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Server or OpenAI service error |
| 503 | `SERVICE_UNAVAILABLE` | OpenAI temporarily unavailable |

---

## File Validation Rules

| Rule | Default | Configurable Via |
|------|---------|------------------|
| Max file size | 10 MB | `MAX_FILE_SIZE` |
| Allowed MIME types | PDF, TXT, CSV, MD, JSON, DOC, DOCX | `app.upload.allowedMimeTypes` |
| Allowed extensions | .pdf, .txt, .csv, .md, .json, .doc, .docx | `app.upload.allowedExtensions` |

---

## Development

### Project Structure

```
src/
├── config/
│   └── configuration.ts       # Centralized config
├── documents/
│   ├── dto/                   # Data Transfer Objects
│   │   ├── upload-document.dto.ts
│   │   ├── chat-completion.dto.ts
│   │   ├── response.dto.ts
│   │   └── index.ts
│   ├── guards/
│   │   └── file-validation.pipe.ts  # File validation
│   ├── documents.controller.ts      # REST endpoints
│   ├── documents.service.ts         # OpenAI integration
│   └── documents.module.ts          # Module definition
├── app.module.ts              # Root module
└── main.ts                    # App bootstrap + Swagger
```

### Commands

```bash
# Lint
bun run lint

# Format
bun run format

# Test
bun run test
bun run test:watch
bun run test:cov

# Build
bun run build
```

---

## License

MIT