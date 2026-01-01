<div align="center">

# 🚀 AI Agent Platform

**A modern NestJS-based platform for managing documents, users, and organizations with AWS S3 integration**

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📄 Document Management
- Upload documents with file validation
- Retrieve documents by user or ID
- Delete documents with S3 cleanup
- Secure file storage

</td>
<td width="50%">

### 👥 User & Organization
- User management with authentication
- Multi-tenant organization support
- User-organization relationships
- Role-based access control (ready)

</td>
</tr>
<tr>
<td width="50%">

### ☁️ Cloud Storage
- AWS S3 integration with signed URLs
- Multipart upload for large files (>5MB)
- Automatic file cleanup on deletion
- Secure signed URLs (1-hour expiry)
- Private file access control

</td>
<td width="50%">

### 🏗️ Architecture
- Modular NestJS structure
- TypeORM for database operations
- DTO validation with class-validator
- Global API prefix (`/api`)
- Environment-based configuration
- Docker support

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|:--------:|:----------:|
| **Framework** | NestJS 11.x |
| **Language** | TypeScript 5.7 |
| **Database** | PostgreSQL 15 |
| **ORM** | TypeORM 0.3.x |
| **Storage** | AWS S3 |
| **Validation** | class-validator |
| **Security** | bcrypt |

</div>

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** 15+ (or Docker)
- **AWS Account** with S3 access

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/pratikfulkar/ai-agent-platform.git
cd ai-agent-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start PostgreSQL with Docker

```bash
docker-compose up -d
```

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=ai_agent_platform

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Application
PORT=8080
```

---

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will start on `http://localhost:8080/api`

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Other Commands

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📚 API Documentation

**Base URL:** `http://localhost:8080/api`

All endpoints are prefixed with `/api` and use JSON responses unless otherwise specified.

### 📄 Documents Endpoints

#### Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data

Body (form-data):
- file: File (required) - The file to upload
- userId: string (required, UUID) - User ID who owns the document
- title: string (required, min 3 chars) - Document title
- organizationId: string (optional, UUID) - Organization ID
- description: string (optional) - Document description

Response:
{
  "id": "uuid",
  "title": "My Document",
  "url": "https://bucket.s3.region.amazonaws.com/...?X-Amz-Signature=...",
  "userId": "uuid",
  "organizationId": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Note:** The `url` field contains a **signed URL** that expires after 1 hour for secure access.

#### Get User Documents
```http
GET /api/documents/user/:userId

Response: Array of documents with signed URLs
```

#### Get Document by ID
```http
GET /api/documents/:id?userId=:userId

Response: Single document with signed URL
```

#### Delete Document
```http
DELETE /api/documents/:id?userId=:userId

Response: 204 No Content
```

---

### 👥 Users Endpoints

#### Create User
```http
POST /api/users
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "organizationId": "uuid" (optional)
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "organizationid": "uuid",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Validation:**
- `email`: Must be valid email format
- `password`: Minimum 6 characters
- `name`: Minimum 2 characters
- `organizationId`: Must be valid UUID if provided

---

### 🏢 Organizations Endpoints

#### Create Organization
```http
POST /api/organizations
Content-Type: application/json

Body:
{
  "name": "Acme Corporation"
}

Response:
{
  "id": "uuid",
  "name": "Acme Corporation",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Validation:**
- `name`: Must be string, minimum 2 characters, must be unique

---

## 🔗 Example cURL Commands

### Upload Document
```bash
curl -X POST http://localhost:8080/api/documents/upload \
  -F "file=@/path/to/file.pdf" \
  -F "userId=550e8400-e29b-41d4-a716-446655440000" \
  -F "title=My Document" \
  -F "organizationId=660e8400-e29b-41d4-a716-446655440001" \
  -F "description=Test document"
```

### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Create Organization
```bash
curl -X POST http://localhost:8080/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Corporation"}'
```

---

## 📁 Project Structure

```
ai-agent-platform/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── documents/               # Document management
│   │   ├── dto/
│   │   │   └── upload-document.dto.ts
│   │   ├── entities/
│   │   │   └── document.entity.ts
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   └── documents.module.ts
│   ├── organizations/          # Organization management
│   │   ├── dto/
│   │   │   └── organization.dto.ts
│   │   ├── entities/
│   │   │   └── organization.entity.ts
│   │   ├── organization.controller.ts
│   │   ├── organizations.service.ts
│   │   └── organizations.module.ts
│   ├── users/                  # User management
│   │   ├── dto/
│   │   │   └── user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── shared/                 # Shared services
│   │   ├── services/
│   │   │   └── s3.service.ts   # AWS S3 with signed URLs
│   │   └── shared.module.ts
│   ├── config/                 # Configuration files
│   │   └── database.config.ts
│   ├── app.module.ts
│   └── main.ts                 # Application entry point
├── test/                       # E2E tests
├── docker-compose.yml          # Docker configuration
└── package.json
```

---

## 🔐 Security Features

- ✅ **Signed URLs**: All S3 file URLs are signed and expire after 1 hour
- ✅ **Private Storage**: Files are stored with `ACL: private` in S3
- ✅ **DTO Validation**: Automatic request validation using class-validator
- ✅ **UUID Validation**: All IDs are validated as UUIDs
- ✅ **Input Sanitization**: Unknown properties are stripped from requests

## ⚠️ Security Notes

- ⚠️ Never commit `.env` files to version control
- 🔒 Use strong passwords for database and AWS credentials
- 🛡️ Enable authentication before deploying to production
- 🔐 Use environment variables for all sensitive data
- 🔐 Signed URLs expire after 1 hour - implement refresh mechanism if needed
- 🔐 Ensure AWS_REGION matches your S3 bucket region

---

## 📝 License

This project is **UNLICENSED** - see the repository for more information.

---

<div align="center">

**Built with ❤️ using NestJS**

[Report Bug](https://github.com/pratikfulkar/ai-agent-platform/issues) · [Request Feature](https://github.com/pratikfulkar/ai-agent-platform/issues)

</div>
