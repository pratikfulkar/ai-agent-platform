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
- AWS S3 integration
- Multipart upload for large files
- Automatic file cleanup
- Secure file URLs

</td>
<td width="50%">

### 🏗️ Architecture
- Modular NestJS structure
- TypeORM for database operations
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
PORT=3000
```

---

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will start on `http://localhost:3000`

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

### Documents Endpoints

#### Upload Document
```http
POST /documents/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- organizationId: string
- userId: string (required)
- title: string (required)
- description: string (optional)
```

#### Get User Documents
```http
GET /documents/user/:userId
```

#### Get Document by ID
```http
GET /documents/:id?userId=:userId
```

#### Delete Document
```http
DELETE /documents/:id?userId=:userId
```

---

## 📁 Project Structure

```
ai-agent-platform/
├── src/
│   ├── auth/              # Authentication module
│   ├── documents/         # Document management
│   │   ├── entities/      # Document entity
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   └── documents.module.ts
│   ├── organizations/    # Organization management
│   ├── users/            # User management
│   ├── shared/           # Shared services
│   │   └── services/
│   │       └── s3.service.ts
│   ├── config/           # Configuration files
│   └── main.ts           # Application entry point
├── test/                 # E2E tests
├── docker-compose.yml    # Docker configuration
└── package.json
```

---

## 🔐 Security Notes

- ⚠️ Never commit `.env` files to version control
- 🔒 Use strong passwords for database and AWS credentials
- 🛡️ Enable authentication before deploying to production
- 🔐 Use environment variables for all sensitive data

---

## 📝 License

This project is **UNLICENSED** - see the repository for more information.

---

<div align="center">

**Built with ❤️ using NestJS**

[Report Bug](https://github.com/pratikfulkar/ai-agent-platform/issues) · [Request Feature](https://github.com/pratikfulkar/ai-agent-platform/issues)

</div>
